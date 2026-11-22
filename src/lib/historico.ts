import { z } from "zod";
import { CorrecaoSchema, type Correcao } from "@/lib/schema";

/**
 * Histórico de correções (Plano Fundador, só neste navegador): localStorage, chave
 * `nc_historico`, no máximo 50 itens, mais recente primeiro. Sem backend, sem banco — tudo
 * client-side, sempre dentro de try/catch (spec §4), validado com Zod na leitura.
 */

const CHAVE = "nc_historico";
const LIMITE = 50;

const CompetenciasNotasSchema = z.object({
  c1: z.number(),
  c2: z.number(),
  c3: z.number(),
  c4: z.number(),
  c5: z.number(),
});
export type CompetenciasNotas = z.infer<typeof CompetenciasNotasSchema>;

const EntradaHistoricoSchema = z.object({
  id: z.string().min(1),
  criadoEm: z.string().min(1), // ISO
  tema: z.string().min(1),
  notaTotal: z.number().nullable(),
  competencias: CompetenciasNotasSchema,
  resultado: CorrecaoSchema,
  textoOriginal: z.string(),
  demo: z.boolean().optional(),
});
export type EntradaHistorico = z.infer<typeof EntradaHistoricoSchema>;

// Cache da última leitura: `lerHistorico()` é usada como getSnapshot de useSyncExternalStore
// (ver useSnapshotCliente), que exige referência estável quando nada mudou — sem isso, um
// array novo a cada chamada causa loop infinito de render.
let cacheRaw: string | null | undefined;
let cacheLista: EntradaHistorico[] = [];

/** Lê o histórico salvo. Entradas corrompidas/fora do schema são descartadas em silêncio. */
export function lerHistorico(): EntradaHistorico[] {
  try {
    const raw = window.localStorage.getItem(CHAVE);
    if (raw === cacheRaw) return cacheLista;
    cacheRaw = raw;
    if (!raw) {
      cacheLista = [];
      return cacheLista;
    }
    const bruto: unknown = JSON.parse(raw);
    if (!Array.isArray(bruto)) {
      cacheLista = [];
      return cacheLista;
    }
    cacheLista = bruto
      .map((item) => EntradaHistoricoSchema.safeParse(item))
      .filter((r): r is { success: true; data: EntradaHistorico } => r.success)
      .map((r) => r.data);
    return cacheLista;
  } catch {
    cacheRaw = undefined; // força reler na próxima tentativa
    cacheLista = [];
    return cacheLista;
  }
}

function gravar(lista: EntradaHistorico[]): void {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(lista.slice(0, LIMITE)));
  } catch {
    /* modo privado / cota cheia: ignorar (spec §4) */
  }
}

/** Salva uma correção no histórico (chamado só para o Plano Fundador). */
export function salvarCorrecaoNoHistorico(entrada: {
  resultado: Correcao;
  textoOriginal: string;
  demo?: boolean;
  criadoEm?: string;
}): EntradaHistorico {
  const nova: EntradaHistorico = {
    id: crypto.randomUUID(),
    criadoEm: entrada.criadoEm ?? new Date().toISOString(),
    tema: entrada.resultado.tema,
    notaTotal: entrada.resultado.notaTotal,
    competencias: {
      c1: entrada.resultado.competencias.c1.nota,
      c2: entrada.resultado.competencias.c2.nota,
      c3: entrada.resultado.competencias.c3.nota,
      c4: entrada.resultado.competencias.c4.nota,
      c5: entrada.resultado.competencias.c5.nota,
    },
    resultado: entrada.resultado,
    textoOriginal: entrada.textoOriginal,
    ...(entrada.demo ? { demo: true } : {}),
  };
  const atual = lerHistorico();
  const ordenada = [nova, ...atual].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );
  gravar(ordenada);
  return nova;
}

/** Apaga todo o histórico (reais e de demonstração). */
export function apagarHistorico(): void {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    /* ignorar */
  }
}

/** Substitui as entradas de demonstração pelas fornecidas, mantendo as reais intactas. */
export function semearHistoricoDemo(entradas: EntradaHistorico[]): void {
  const reais = lerHistorico().filter((e) => !e.demo);
  const combinado = [...entradas, ...reais].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );
  gravar(combinado);
}

/** Remove só as entradas de demonstração, mantendo correções reais. */
export function removerHistoricoDemo(): void {
  gravar(lerHistorico().filter((e) => !e.demo));
}

/* --------------------------------- meta de nota --------------------------------- */

const CHAVE_META = "nc_meta_evolucao";
export const META_PADRAO = 900;

export function lerMeta(): number {
  try {
    const raw = window.localStorage.getItem(CHAVE_META);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n >= 0 && n <= 1000 ? n : META_PADRAO;
  } catch {
    return META_PADRAO;
  }
}

export function salvarMeta(meta: number): void {
  try {
    window.localStorage.setItem(CHAVE_META, String(Math.round(meta)));
  } catch {
    /* ignorar */
  }
}
