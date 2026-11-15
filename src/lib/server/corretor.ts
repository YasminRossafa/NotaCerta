import "server-only";

import { acervoCondensado, repertorioPorId } from "@/lib/repertorios";
import {
  CorrecaoModeloSchema,
  CorrecaoSchema,
  type CorrecaoModelo,
  type Correcao,
  type Entrada,
} from "@/lib/schema";
import { PROMPT_ACERVO_CABECALHO, PROMPT_METODO } from "@/lib/server/metodo-prompt";
import { ErroProvider, obterProvider } from "@/lib/ai/provider";

/**
 * Serviço de correção (spec §9). Único lugar do projeto que fala com o provedor de IA
 * (Anthropic ou Gemini, escolhido por `AI_PROVIDER` — ver `lib/ai/provider.ts`).
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

/** System prompt estático (método + acervo condensado) — igual em toda chamada. */
function systemPromptCompleto(): string {
  return `${PROMPT_METODO}\n\n${PROMPT_ACERVO_CABECALHO}\n${acervoCondensado()}`;
}

function userContentEntrada(entrada: Entrada): string {
  const linhaTema = entrada.tema
    ? `TEMA DA REDAÇÃO: ${entrada.tema}`
    : "TEMA DA REDAÇÃO: não informado — infira o tema a partir do texto e marque temaDetectado=true.";

  if (entrada.imagemBase64) {
    return `${linhaTema}\n\nA redação está na imagem anexada (manuscrita). Transcreva-a fielmente no campo "transcricao" e depois corrija seguindo o método.`;
  }

  return `${linhaTema}\n\nREDAÇÃO DO ALUNO:\n"""\n${entrada.texto}\n"""`;
}

/** Remove possíveis cercas de código (```json ... ```) antes de JSON.parse. */
function extrairJson(bruto: string): unknown {
  const limpo = bruto
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(limpo);
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

/** Chama o provedor e tenta interpretar a resposta como `CorrecaoModelo`; null se inválida. */
async function chamarProvider(
  systemPrompt: string,
  userContent: string,
  entrada: Entrada,
): Promise<CorrecaoModelo | null> {
  const provider = await obterProvider();
  let bruto: string;
  try {
    bruto = await provider.corrigirRedacao({
      systemPrompt,
      userContent,
      imageBase64: entrada.imagemBase64,
      imageMime: entrada.imagemMime,
    });
  } catch (e) {
    throw traduzirErroProvider(e);
  }

  let json: unknown;
  try {
    json = extrairJson(bruto);
  } catch {
    return null;
  }
  const analisado = CorrecaoModeloSchema.safeParse(json);
  return analisado.success ? analisado.data : null;
}

/**
 * Corrige a redação: chama o provedor de IA, normaliza, valida com Zod.
 * Se a saída não passar no schema estrito, faz 1 tentativa de reparo; senão lança 502.
 */
export async function corrigirRedacao(entrada: Entrada): Promise<Correcao> {
  const systemPrompt = systemPromptCompleto();
  const userContentOriginal = userContentEntrada(entrada);

  let bruto = await chamarProvider(systemPrompt, userContentOriginal, entrada);
  let validado = bruto ? CorrecaoSchema.safeParse(normalizarCorrecao(bruto)) : null;

  if (!validado?.success) {
    // Reparo (1 vez): devolve o JSON anterior + problemas e pede a versão corrigida.
    const problemas = validado
      ? validado.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      : "resposta vazia ou JSON inválido";
    const anterior = bruto ? JSON.stringify(bruto) : "(a resposta anterior não era um JSON válido)";
    const userContentReparo = `${userContentOriginal}\n\n---\nSUA TENTATIVA ANTERIOR NÃO FOI ACEITA.\nResposta anterior: ${anterior}\nProblemas: ${problemas}\nReenvie a correção completa, válida no schema, mantendo o conteúdo.`;

    bruto = await chamarProvider(systemPrompt, userContentReparo, entrada);
    validado = bruto ? CorrecaoSchema.safeParse(normalizarCorrecao(bruto)) : null;
  }

  if (!validado?.success) {
    throw new ErroCorretor("saida_invalida", "A correção veio fora do formato esperado.");
  }
  return validado.data;
}

function traduzirErroProvider(e: unknown): ErroCorretor {
  if (e instanceof ErroProvider) {
    switch (e.codigo) {
      case "configuracao":
        return new ErroCorretor("configuracao", e.message);
      case "limite_taxa":
        // Limite momentâneo do provedor (ex.: cota da camada gratuita) — distinto do
        // limite_diario do plano gratuito do NotaCerta (spec §9.1/§13).
        return new ErroCorretor(
          "api_indisponivel",
          "Limite de uso do provedor de IA atingido, tente em instantes.",
        );
      case "recusado":
        return new ErroCorretor("saida_invalida", e.message);
      case "indisponivel":
      default:
        return new ErroCorretor("api_indisponivel", e.message);
    }
  }
  if (e instanceof ErroCorretor) return e;
  return new ErroCorretor("api_indisponivel", "Falha inesperada ao corrigir.");
}
