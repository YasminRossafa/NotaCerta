import "server-only";

import { ApiError, GoogleGenAI, type Part } from "@google/genai";
import { ErroProvider, type AiProvider, type EntradaProvider } from "@/lib/ai/provider";
import { correcaoModeloResponseSchema } from "@/lib/ai/gemini-schema";

export class GeminiProvider implements AiProvider {
  private cliente: GoogleGenAI | null = null;

  private obterCliente(): GoogleGenAI {
    if (!process.env.GEMINI_API_KEY) {
      throw new ErroProvider("configuracao", "GEMINI_API_KEY não configurada no servidor.");
    }
    this.cliente ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return this.cliente;
  }

  async corrigirRedacao({
    systemPrompt,
    userContent,
    imageBase64,
    imageMime,
  }: EntradaProvider): Promise<string> {
    const modelo = process.env.GEMINI_MODEL;
    if (!modelo) {
      throw new ErroProvider("configuracao", "GEMINI_MODEL não configurado no servidor.");
    }
    const client = this.obterCliente();

    const partes: Part[] = [];
    if (imageBase64 && imageMime) {
      partes.push({ inlineData: { mimeType: imageMime, data: imageBase64 } });
    }
    partes.push({ text: userContent });

    try {
      const resposta = await client.models.generateContent({
        model: modelo,
        contents: [{ role: "user", parts: partes }],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: correcaoModeloResponseSchema,
        },
      });

      const texto = resposta.text;
      if (!texto) {
        throw new ErroProvider("indisponivel", "O modelo não retornou conteúdo.");
      }
      return texto;
    } catch (e) {
      throw traduzirErro(e);
    }
  }
}

function traduzirErro(e: unknown): ErroProvider {
  if (e instanceof ErroProvider) return e;
  if (e instanceof ApiError) {
    if (e.status === 401 || e.status === 403) {
      return new ErroProvider("configuracao", "Chave da API Gemini inválida ou sem permissão.");
    }
    if (e.status === 429) {
      return new ErroProvider(
        "limite_taxa",
        "Limite de uso do provedor atingido, tente em instantes.",
      );
    }
    return new ErroProvider("indisponivel", "O serviço de correção está indisponível.");
  }
  return new ErroProvider("indisponivel", "Falha inesperada ao corrigir.");
}
