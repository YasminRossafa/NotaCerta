import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { ErroProvider, type AiProvider, type EntradaProvider } from "@/lib/ai/provider";

// Spec §5/§6 pede "claude-sonnet-5-5"; o id público da geração Sonnet 5 é "claude-sonnet-5".
const MODELO_PADRAO = "claude-sonnet-5";
const MAX_TOKENS = 16000;

export class AnthropicProvider implements AiProvider {
  private cliente: Anthropic | null = null;

  private obterCliente(): Anthropic {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new ErroProvider("configuracao", "ANTHROPIC_API_KEY não configurada no servidor.");
    }
    this.cliente ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 2 });
    return this.cliente;
  }

  async corrigirRedacao({
    systemPrompt,
    userContent,
    imageBase64,
    imageMime,
  }: EntradaProvider): Promise<string> {
    const client = this.obterCliente();
    const modelo = process.env.ANTHROPIC_MODEL || MODELO_PADRAO;

    const conteudo: Anthropic.MessageParam["content"] =
      imageBase64 && imageMime
        ? [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageMime as Anthropic.Base64ImageSource["media_type"],
                data: imageBase64,
              },
            },
            { type: "text", text: userContent },
          ]
        : userContent;

    try {
      // Bloco de sistema único com cache_control: método + acervo são estáticos entre chamadas
      // (spec §9.2) — só o conteúdo do usuário varia.
      const resposta = await client.messages.create({
        model: modelo,
        max_tokens: MAX_TOKENS,
        system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: conteudo }],
      });

      if (resposta.stop_reason === "refusal") {
        throw new ErroProvider("recusado", "O modelo recusou a solicitação.");
      }
      const bloco = resposta.content.find((b) => b.type === "text");
      if (!bloco || bloco.type !== "text" || !bloco.text) {
        throw new ErroProvider("indisponivel", "O modelo não retornou texto.");
      }
      return bloco.text;
    } catch (e) {
      throw traduzirErro(e);
    }
  }
}

function traduzirErro(e: unknown): ErroProvider {
  if (e instanceof ErroProvider) return e;
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    return new ErroProvider("configuracao", "Chave da API Anthropic inválida ou sem permissão.");
  }
  if (e instanceof Anthropic.RateLimitError) {
    return new ErroProvider(
      "limite_taxa",
      "Limite de uso do provedor atingido, tente em instantes.",
    );
  }
  if (e instanceof Anthropic.BadRequestError) {
    return new ErroProvider("recusado", "A requisição foi rejeitada pelo modelo.");
  }
  if (
    e instanceof Anthropic.InternalServerError ||
    e instanceof Anthropic.APIConnectionError ||
    e instanceof Anthropic.APIError
  ) {
    return new ErroProvider("indisponivel", "O serviço de correção está indisponível.");
  }
  return new ErroProvider("indisponivel", "Falha inesperada ao corrigir.");
}
