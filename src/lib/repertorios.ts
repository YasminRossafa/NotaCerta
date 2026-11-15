import acervoBruto from "../../data/repertorios.json";

/** Categorias do acervo (spec §8.6). */
export const CATEGORIAS = [
  "filme",
  "conto-fabula",
  "obra-br",
  "obra-estrangeira",
  "fato-historico",
  "filosofia",
  "sociologia",
  "dado",
  "conceito",
] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  filme: "Filme",
  "conto-fabula": "Conto / fábula",
  "obra-br": "Obra brasileira",
  "obra-estrangeira": "Obra estrangeira",
  "fato-historico": "Fato histórico",
  filosofia: "Filosofia",
  sociologia: "Sociologia",
  dado: "Fonte de dados",
  conceito: "Conceito",
};

export type UsoRepertorio = "introducao" | "d1" | "d2";
export const ROTULO_USO: Record<UsoRepertorio, string> = {
  introducao: "Introdução",
  d1: "D1",
  d2: "D2",
};
export const DESCRICAO_USO: Record<UsoRepertorio, string> = {
  introducao: "Contextualização na introdução",
  d1: "Citação científica, dado ou fato (D1)",
  d2: "Citação filosófica, sociológica ou literária (D2)",
};

export type Repertorio = {
  id: string;
  titulo: string;
  autor?: string;
  categoria: Categoria;
  resumo: string;
  comoUsar: string;
  temas: string[];
  uso: UsoRepertorio[];
};

type AcervoArquivo = {
  versao: number;
  fonte: string;
  observacao: string;
  categorias: string[];
  itens: Repertorio[];
};

const acervo = acervoBruto as AcervoArquivo;

/** Todos os itens do acervo curado, na ordem do arquivo. */
export const REPERTORIOS: Repertorio[] = acervo.itens;
export const FONTE_ACERVO = acervo.fonte;

const porId = new Map(REPERTORIOS.map((r) => [r.id, r]));

/** Busca um repertório pelo id. Retorna undefined se o id não existir no acervo. */
export function repertorioPorId(id: string): Repertorio | undefined {
  return porId.get(id);
}

/** Lista de temas (tags) únicos, ordenada alfabeticamente, com contagem. */
export function temasDoAcervo(): { tema: string; total: number }[] {
  const mapa = new Map<string, number>();
  for (const r of REPERTORIOS) for (const t of r.temas) mapa.set(t, (mapa.get(t) ?? 0) + 1);
  return [...mapa.entries()]
    .map(([tema, total]) => ({ tema, total }))
    .sort((a, b) => a.tema.localeCompare(b.tema, "pt-BR"));
}

/**
 * Versão condensada do acervo para o system prompt (spec §9): só id, titulo, temas e uso.
 * Ordem e formato determinísticos para o prompt caching funcionar.
 */
export function acervoCondensado(): string {
  return REPERTORIOS.map(
    (r) => `- ${r.id} | ${r.titulo} | temas: ${r.temas.join(", ")} | uso: ${r.uso.join(", ")}`,
  ).join("\n");
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Filtro de busca usado na página /repertorios (cliente). */
export function filtrarRepertorios(
  itens: Repertorio[],
  { busca, categoria, tema }: { busca?: string; categoria?: Categoria | ""; tema?: string },
): Repertorio[] {
  const q = busca ? normalizar(busca.trim()) : "";
  return itens.filter((r) => {
    if (categoria && r.categoria !== categoria) return false;
    if (tema && !r.temas.includes(tema)) return false;
    if (!q) return true;
    const alvo = normalizar(
      [r.titulo, r.autor ?? "", r.resumo, r.comoUsar, r.temas.join(" ")].join(" "),
    );
    return alvo.includes(q);
  });
}
