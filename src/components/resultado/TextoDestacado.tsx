import type { ReactNode } from "react";
import type { Apontamento } from "@/lib/schema";

type Segmento = { texto: string; indice: number | null };

function normalizarEspacos(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Localiza cada `trecho` dentro do texto original (sem sobreposição) e devolve segmentos.
 * Tenta correspondência exata; depois ignora caixa; depois ignora diferenças de espaço.
 */
export function segmentarTexto(texto: string, apontamentos: Apontamento[]): Segmento[] {
  const marcas: { inicio: number; fim: number; indice: number }[] = [];
  const baixo = texto.toLowerCase();

  apontamentos.forEach((a, indice) => {
    const trecho = a.trecho.trim();
    if (!trecho) return;
    let inicio = texto.indexOf(trecho);
    if (inicio < 0) inicio = baixo.indexOf(trecho.toLowerCase());
    let fim = inicio >= 0 ? inicio + trecho.length : -1;

    if (inicio < 0) {
      // Tolerância a espaços/quebras: procura com regex onde cada espaço vira \s+
      const escapado = normalizarEspacos(trecho)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/ /g, "\\s+");
      const m = new RegExp(escapado, "i").exec(texto);
      if (m) {
        inicio = m.index;
        fim = m.index + m[0].length;
      }
    }
    if (inicio < 0) return;
    const sobrepoe = marcas.some((m) => inicio < m.fim && fim > m.inicio);
    if (!sobrepoe) marcas.push({ inicio, fim, indice });
  });

  marcas.sort((a, b) => a.inicio - b.inicio);

  const segmentos: Segmento[] = [];
  let cursor = 0;
  for (const m of marcas) {
    if (m.inicio > cursor) segmentos.push({ texto: texto.slice(cursor, m.inicio), indice: null });
    segmentos.push({ texto: texto.slice(m.inicio, m.fim), indice: m.indice });
    cursor = m.fim;
  }
  if (cursor < texto.length) segmentos.push({ texto: texto.slice(cursor), indice: null });
  return segmentos;
}

/**
 * Texto original do parágrafo com os trechos problemáticos destacados.
 * `ativo`/`aoFocar` sincronizam o destaque (hover/foco) com o apontamento na lista; `aoClicar`
 * é disparado ao clicar/Enter num trecho, para quem chama decidir como revelar e rolar até o
 * cartão correspondente (ex.: limpando um filtro que o esconderia).
 */
export function TextoDestacado({
  texto,
  apontamentos,
  ativo,
  aoFocar,
  aoClicar,
  idBase,
}: {
  texto: string;
  apontamentos: Apontamento[];
  ativo: number | null;
  aoFocar: (indice: number | null) => void;
  aoClicar?: (indice: number) => void;
  idBase: string;
}): ReactNode {
  const segmentos = segmentarTexto(texto, apontamentos);
  return (
    <p className="text-navy text-[15.5px] leading-[1.75] sm:text-base">
      {segmentos.map((s, i) => {
        if (s.indice == null) return <span key={i}>{s.texto}</span>;
        const indice = s.indice;
        return (
          <mark
            key={i}
            className="nc-destaque"
            data-ativo={ativo === indice ? "true" : "false"}
            tabIndex={0}
            role="button"
            aria-describedby={`${idBase}-ap-${indice}`}
            aria-label={`Trecho com apontamento ${indice + 1}: ${apontamentos[indice].problema}`}
            onMouseEnter={() => aoFocar(indice)}
            onMouseLeave={() => aoFocar(null)}
            onFocus={() => aoFocar(indice)}
            onBlur={() => aoFocar(null)}
            onClick={() => aoClicar?.(indice)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                aoClicar?.(indice);
              }
            }}
          >
            {s.texto}
            <sup className="ml-0.5 text-[10px] font-bold text-amber-700">{indice + 1}</sup>
          </mark>
        );
      })}
    </p>
  );
}
