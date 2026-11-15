import exemplosBrutos from "../../data/exemplos-estrutura.json";
import type { TipoParagrafo } from "@/lib/schema";

/** Redações-modelo segmentadas (spec §8.7). */

export type ParteExemplo = { rotulo: string; texto: string };
export type ParagrafoExemplo = { tipo: TipoParagrafo; partes: ParteExemplo[] };
export type Exemplo = {
  id: string;
  tema: string;
  paragrafos: ParagrafoExemplo[];
  /** true para exemplos escritos pelo NotaCerta (fora da apostila original) — revisar pela professora. */
  rascunho?: boolean;
  /** observação de revisão, exibida apenas quando rascunho=true. */
  observacao?: string;
};

type LegendaPorParagrafo = Record<TipoParagrafo, string[]>;

type Arquivo = {
  versao: number;
  fonte: string;
  observacao: string;
  legendaPorParagrafo: LegendaPorParagrafo;
  exemplos: Exemplo[];
};

const arquivo = exemplosBrutos as Arquivo;

export const EXEMPLOS: Exemplo[] = arquivo.exemplos;
export const LEGENDA_POR_PARAGRAFO = arquivo.legendaPorParagrafo;
export const FONTE_EXEMPLOS = arquivo.fonte;

export type CorRotulo = { fundo: string; texto: string; borda: string };

/**
 * Uma cor por rótulo, com texto escuro legível (contraste AA sobre fundo -100).
 * As classes precisam aparecer literalmente aqui para o Tailwind gerá-las.
 */
export const COR_ROTULO: Record<string, CorRotulo> = {
  // Introdução
  "Repertório sociocultural": {
    fundo: "bg-violet-100",
    texto: "text-violet-950",
    borda: "border-violet-400",
  },
  "Tema + Brasil": { fundo: "bg-sky-100", texto: "text-sky-950", borda: "border-sky-400" },
  "Duas problemáticas": { fundo: "bg-rose-100", texto: "text-rose-950", borda: "border-rose-400" },
  // Desenvolvimento
  Conectivo: { fundo: "bg-amber-100", texto: "text-amber-950", borda: "border-amber-400" },
  Problemática: { fundo: "bg-rose-100", texto: "text-rose-950", borda: "border-rose-400" },
  Motivo: { fundo: "bg-orange-100", texto: "text-orange-950", borda: "border-orange-400" },
  "Citação (dados)": { fundo: "bg-teal-100", texto: "text-teal-950", borda: "border-teal-400" },
  "Citação (filosófica/sociológica)": {
    fundo: "bg-violet-100",
    texto: "text-violet-950",
    borda: "border-violet-400",
  },
  Argumento: { fundo: "bg-lime-100", texto: "text-lime-950", borda: "border-lime-400" },
  // Conclusão
  "Conectivo conclusivo": {
    fundo: "bg-amber-100",
    texto: "text-amber-950",
    borda: "border-amber-400",
  },
  Agente: { fundo: "bg-blue-100", texto: "text-blue-950", borda: "border-blue-400" },
  Ação: { fundo: "bg-emerald-100", texto: "text-emerald-950", borda: "border-emerald-400" },
  "Modo/Meio": { fundo: "bg-cyan-100", texto: "text-cyan-950", borda: "border-cyan-400" },
  Finalidade: { fundo: "bg-fuchsia-100", texto: "text-fuchsia-950", borda: "border-fuchsia-400" },
  Detalhamento: { fundo: "bg-yellow-100", texto: "text-yellow-950", borda: "border-yellow-400" },
  "Retomada do repertório": {
    fundo: "bg-violet-100",
    texto: "text-violet-950",
    borda: "border-violet-400",
  },
};

const COR_PADRAO: CorRotulo = {
  fundo: "bg-slate-100",
  texto: "text-slate-900",
  borda: "border-slate-400",
};

export function corDoRotulo(rotulo: string): CorRotulo {
  return COR_ROTULO[rotulo] ?? COR_PADRAO;
}

/** Legenda por tipo de parágrafo (ordem do método) — uma legenda por parágrafo (spec §18.2). */
export function legendaDoTipo(tipo: TipoParagrafo): string[] {
  return LEGENDA_POR_PARAGRAFO[tipo];
}
