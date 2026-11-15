import type { Correcao, Paragrafo } from "@/lib/schema";

/**
 * Regras de gating do plano grátis (spec §13):
 * nota + competências + apontamentos de todos os parágrafos + 1 reescrita (a do parágrafo
 * mais crítico) + resumo. As demais reescritas e o repertório completo ficam bloqueados.
 */

const PESO_STATUS: Record<Paragrafo["status"], number> = { incompleto: 2, ajustes: 1, adequado: 0 };

/** Índice do parágrafo mais crítico que tenha reescrita; -1 se nenhum tiver. */
export function indiceParagrafoMaisCritico(paragrafos: Paragrafo[]): number {
  let melhor = -1;
  let melhorPontos = -1;
  paragrafos.forEach((p, i) => {
    if (!p.reescrita) return;
    const pontos = p.apontamentos.length * 10 + PESO_STATUS[p.status];
    if (pontos > melhorPontos) {
      melhorPontos = pontos;
      melhor = i;
    }
  });
  return melhor;
}

export type Gating = {
  reescritaLiberada: (indice: number) => boolean;
  repertorioLiberado: (indice: number) => boolean;
};

export function calcularGating(correcao: Correcao, plano: "gratis" | "fundador"): Gating {
  if (plano === "fundador") {
    return { reescritaLiberada: () => true, repertorioLiberado: () => true };
  }
  const critico = indiceParagrafoMaisCritico(correcao.paragrafos);
  return {
    reescritaLiberada: (i) => i === critico,
    // No grátis o primeiro repertório sugerido é liberado; os demais aparecem borrados.
    repertorioLiberado: (i) => i === 0,
  };
}
