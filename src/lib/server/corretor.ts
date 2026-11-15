import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { acervoCondensado, repertorioPorId } from "@/lib/repertorios";
import {
  CorrecaoModeloSchema,
  CorrecaoSchema,
  type CorrecaoModelo,
  type Correcao,
  type Entrada,
} from "@/lib/schema";
import { PROMPT_ACERVO_CABECALHO, PROMPT_METODO } from "@/lib/server/metodo-prompt";

/**
 * Serviço de correção (spec §9). Único lugar do projeto que fala com a Anthropic.
 * A chave vem de process.env.ANTHROPIC_API_KEY (lida pelo SDK) e nunca sai do servidor.
 */

export type CodigoErroCorretor =
  "configuracao" | "api_indisponivel" | "saida_invalida" | "entrada_invalida";

export class ErroCorretor extends Error {
  constructor(
    public codigo: CodigoErroCorretor,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ErroCorretor";
  }
}

// Spec §5/§6 pede "claude-sonnet-5-5"; o id público da geração Sonnet 5 é "claude-sonnet-5".
// TODO(claudia): confirmar o id do modelo desejado e ajustar ANTHROPIC_MODEL no .env.
const MODELO_PADRAO = "claude-sonnet-5";

// Spec §9.3 sugere ~3500; com thinking adaptativo o limite precisa cobrir raciocínio + JSON.
const MAX_TOKENS = 16000;

let cliente: Anthropic | null = null;
function obterCliente(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ErroCorretor("configuracao", "ANTHROPIC_API_KEY não configurada no servidor.");
  }
  cliente ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 2 });
  return cliente;
}

/** Blocos de sistema estáticos, com breakpoint de cache no último (cobre método + acervo). */
function blocosSistema(): Anthropic.TextBlockParam[] {
  return [
    { type: "text", text: PROMPT_METODO },
    {
      type: "text",
      text: `${PROMPT_ACERVO_CABECALHO}\n${acervoCondensado()}`,
      cache_control: { type: "ephemeral" },
    },
  ];
}

function mensagemUsuario(entrada: Entrada): Anthropic.MessageParam {
  const linhaTema = entrada.tema
    ? `TEMA DA REDAÇÃO: ${entrada.tema}`
    : "TEMA DA REDAÇÃO: não informado — infira o tema a partir do texto e marque temaDetectado=true.";

  if (entrada.imagemBase64 && entrada.imagemMime) {
    return {
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: entrada.imagemMime,
            data: entrada.imagemBase64,
          },
        },
        {
          type: "text",
          text: `${linhaTema}\n\nA redação está na imagem acima (manuscrita). Transcreva-a fielmente no campo "transcricao" e depois corrija seguindo o método.`,
        },
      ],
    };
  }

  return {
    role: "user",
    content: `${linhaTema}\n\nREDAÇÃO DO ALUNO:\n"""\n${entrada.texto}\n"""`,
  };
}

function arredondar40(n: number): number {
  const v = Math.round(n / 40) * 40;
  return Math.max(0, Math.min(200, v));
}

/** Ajusta pequenas imperfeições da saída do modelo e aplica as regras duras do spec §12. */
export function normalizarCorrecao(bruto: CorrecaoModelo): unknown {
  const competencias = Object.fromEntries(
    (["c1", "c2", "c3", "c4", "c5"] as const).map((c) => [
      c,
      {
        nota: arredondar40(bruto.competencias[c].nota),
        justificativa: bruto.competencias[c].justificativa.trim(),
      },
    ]),
  ) as Correcao["competencias"];

  const soma = (Object.values(competencias) as { nota: number }[]).reduce((a, c) => a + c.nota, 0);

  // Repertório: só ids do acervo curado, sem duplicatas, no máximo 3 (spec §8.6/§12).
  const vistos = new Set<string>();
  const repertorioSugestoes = bruto.repertorioSugestoes
    .filter((s) => {
      const id = s.id.trim();
      if (vistos.has(id) || !repertorioPorId(id)) return false;
      vistos.add(id);
      return true;
    })
    .slice(0, 3)
    .map((s) => ({ id: s.id.trim(), porqueCombina: s.porqueCombina.trim() }));

  return {
    tema: bruto.tema.trim(),
    temaDetectado: bruto.temaDetectado,
    transcricao: bruto.transcricao?.trim() || null,
    completa: bruto.completa,
    competencias,
    notaTotal: bruto.completa ? soma : null,
    paragrafos: bruto.paragrafos.map((p) => ({
      tipo: p.tipo,
      textoOriginal: p.textoOriginal.trim(),
      status: p.status,
      apontamentos: p.apontamentos
        .filter((a) => a.trecho.trim() && a.problema.trim() && a.motivo.trim())
        .map((a) => ({
          trecho: a.trecho.trim(),
          problema: a.problema.trim(),
          motivo: a.motivo.trim(),
          competencia: a.competencia,
        })),
      reescrita: p.reescrita?.trim() || null,
      checklistModelo: p.checklistModelo.map((i) => ({
        item: i.item.trim(),
        ok: i.ok,
        ...(i.observacao?.trim() ? { observacao: i.observacao.trim() } : {}),
      })),
    })),
    repertorioSugestoes,
    resumoProfessor: bruto.resumoProfessor.trim(),
  };
}

async function chamarModelo(mensagens: Anthropic.MessageParam[]): Promise<CorrecaoModelo | null> {
  const client = obterCliente();
  const modelo = process.env.ANTHROPIC_MODEL || MODELO_PADRAO;

  // Sonnet 5 / Opus 5 rejeitam `temperature` (400) — o spec pedia 0.2; o controle de
  // variação fica por conta do thinking adaptativo + saída estruturada.
  // TODO(claudia): ajustar output_config.effort ("medium" reduz latência/custo) após medir.
  const resposta = await client.messages.parse({
    model: modelo,
    max_tokens: MAX_TOKENS,
    system: blocosSistema(),
    messages: mensagens,
    output_config: { format: zodOutputFormat(CorrecaoModeloSchema) },
  });

  if (resposta.stop_reason === "refusal") {
    throw new ErroCorretor("saida_invalida", "O modelo recusou a solicitação.");
  }
  if (resposta.stop_reason === "max_tokens") {
    throw new ErroCorretor("saida_invalida", "A correção foi cortada por limite de tokens.");
  }
  return resposta.parsed_output ?? null;
}

/**
 * Corrige a redação: chama o modelo, normaliza, valida com Zod.
 * Se a saída não passar no schema estrito, faz 1 tentativa de reparo; senão lança 502.
 */
export async function corrigirRedacao(entrada: Entrada): Promise<Correcao> {
  const mensagens: Anthropic.MessageParam[] = [mensagemUsuario(entrada)];

  let bruto: CorrecaoModelo | null;
  try {
    bruto = await chamarModelo(mensagens);
  } catch (e) {
    throw traduzirErroSdk(e);
  }

  let validado = bruto ? CorrecaoSchema.safeParse(normalizarCorrecao(bruto)) : null;

  if (!validado?.success) {
    // Reparo (1 vez): devolve o JSON anterior + problemas e pede a versão corrigida.
    const problemas = validado
      ? validado.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      : "resposta vazia";
    mensagens.push(
      { role: "assistant", content: bruto ? JSON.stringify(bruto) : "{}" },
      {
        role: "user",
        content: `O JSON anterior não passou na validação (${problemas}). Reenvie a correção completa, válida no schema, mantendo o conteúdo.`,
      },
    );
    try {
      bruto = await chamarModelo(mensagens);
    } catch (e) {
      throw traduzirErroSdk(e);
    }
    validado = bruto ? CorrecaoSchema.safeParse(normalizarCorrecao(bruto)) : null;
  }

  if (!validado?.success) {
    throw new ErroCorretor("saida_invalida", "A correção veio fora do formato esperado.");
  }
  return validado.data;
}

function traduzirErroSdk(e: unknown): ErroCorretor {
  if (e instanceof ErroCorretor) return e;
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    return new ErroCorretor("configuracao", "Chave da API inválida ou sem permissão.");
  }
  if (e instanceof Anthropic.BadRequestError) {
    return new ErroCorretor("entrada_invalida", "A requisição foi rejeitada pelo modelo.");
  }
  if (
    e instanceof Anthropic.RateLimitError ||
    e instanceof Anthropic.InternalServerError ||
    e instanceof Anthropic.APIConnectionError ||
    e instanceof Anthropic.APIError
  ) {
    return new ErroCorretor("api_indisponivel", "O serviço de correção está indisponível.");
  }
  return new ErroCorretor("api_indisponivel", "Falha inesperada ao corrigir.");
}
