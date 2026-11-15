import { CorrecaoSchema, type Correcao } from "@/lib/schema";

/**
 * Estado do resultado entre /corrigir e /resultado (spec §4: sem banco; o objeto da resposta
 * vai para a página). Usa sessionStorage para sobreviver a um reload da aba.
 */

const CHAVE = "nc:resultado";

export type ResultadoSalvo = {
  correcao: Correcao;
  origem: "texto" | "imagem";
  em: string;
};

export function salvarResultado(r: Omit<ResultadoSalvo, "em">): void {
  try {
    window.sessionStorage.setItem(CHAVE, JSON.stringify({ ...r, em: new Date().toISOString() }));
  } catch {
    /* ignorar */
  }
}

/** Lê e valida com Zod antes de renderizar (spec §12). Retorna null se não houver/for inválido. */
export function lerResultado(): ResultadoSalvo | null {
  try {
    const raw = window.sessionStorage.getItem(CHAVE);
    if (!raw) return null;
    const obj = JSON.parse(raw) as Partial<ResultadoSalvo>;
    const parsed = CorrecaoSchema.safeParse(obj.correcao);
    if (!parsed.success) return null;
    return {
      correcao: parsed.data,
      origem: obj.origem === "imagem" ? "imagem" : "texto",
      em: typeof obj.em === "string" ? obj.em : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function limparResultado(): void {
  try {
    window.sessionStorage.removeItem(CHAVE);
  } catch {
    /* ignorar */
  }
}

// TODO(claudia): histórico/progresso (plano pago) — trocar este store por persistência em banco.
export interface HistoricoRepositorio {
  listar(): Promise<ResultadoSalvo[]>;
  salvar(r: ResultadoSalvo): Promise<void>;
}
