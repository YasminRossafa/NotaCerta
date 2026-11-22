export type CodigoCompetencia = "c1" | "c2" | "c3" | "c4" | "c5";

export const COMPETENCIAS: Record<
  CodigoCompetencia,
  { sigla: string; nome: string; descricao: string }
> = {
  c1: {
    sigla: "C1",
    nome: "Norma culta",
    descricao: "Domínio da escrita formal: vírgula, crase, acentuação, concordância e regência.",
  },
  c2: {
    sigla: "C2",
    nome: "Tema e estrutura",
    descricao:
      "Compreender a proposta, citar o tema por completo e manter a estrutura dissertativa.",
  },
  c3: {
    sigla: "C3",
    nome: "Argumentação",
    descricao:
      "Selecionar, organizar e relacionar informações, fatos e repertório em defesa de um ponto de vista.",
  },
  c4: {
    sigla: "C4",
    nome: "Coesão",
    descricao: "Conectivos adequados e encadeamento entre frases e parágrafos.",
  },
  c5: {
    sigla: "C5",
    nome: "Proposta de intervenção",
    descricao: "Agente, ação, modo, finalidade e detalhamento, respeitando os direitos humanos.",
  },
};

export const CODIGOS_COMPETENCIA: CodigoCompetencia[] = ["c1", "c2", "c3", "c4", "c5"];

export type FaixaNota = "verde" | "ambar" | "vermelho";

/** Cor semântica da nota de competência (spec §10): 120–200 verde · 80–100 âmbar · 0–40 vermelho. */
export function faixaDaNota(nota: number): FaixaNota {
  if (nota >= 120) return "verde";
  if (nota >= 80) return "ambar";
  return "vermelho";
}

/** Faixa da nota total (0–1000), proporcional à régua das competências. */
export function faixaDaNotaTotal(total: number): FaixaNota {
  if (total >= 600) return "verde";
  if (total >= 400) return "ambar";
  return "vermelho";
}

export const CORES_FAIXA: Record<
  FaixaNota,
  { texto: string; fundo: string; barra: string; hex: string }
> = {
  verde: { texto: "text-verde-texto", fundo: "bg-verde-claro", barra: "bg-verde", hex: "#16A34A" },
  ambar: { texto: "text-ambar-texto", fundo: "bg-ambar-claro", barra: "bg-ambar", hex: "#F59E0B" },
  vermelho: {
    texto: "text-vermelho-texto",
    fundo: "bg-vermelho-claro",
    barra: "bg-vermelho",
    hex: "#DC2626",
  },
};
