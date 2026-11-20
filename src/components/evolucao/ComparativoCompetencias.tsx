"use client";

import { ContadorAnimado } from "@/components/motion/ContadorAnimado";
import { COMPETENCIAS } from "@/lib/competencias";
import { compararPrimeiraEUltima, type TendenciaNota } from "@/lib/evolucao-analise";
import type { EntradaHistorico } from "@/lib/historico";

/**
 * Compara as 5 competências entre a primeira e a última correção com nota (spec "Minha
 * evolução"). Barras pareadas: cinza para "Primeira" (linha de base), azul para "Mais recente"
 * (atual) — sempre com rótulo de texto, nunca só pela cor.
 */
export function ComparativoCompetencias({
  entradas,
  tendencia,
}: {
  entradas: EntradaHistorico[];
  tendencia: TendenciaNota;
}) {
  const linhas = compararPrimeiraEUltima(entradas);
  if (!linhas) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="bg-slate inline-block h-2.5 w-2.5 rounded-full" aria-hidden="true" />
          Primeira ({new Date(tendencia.primeira.criadoEm).toLocaleDateString("pt-BR")})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-azul inline-block h-2.5 w-2.5 rounded-full" aria-hidden="true" />
          Mais recente ({new Date(tendencia.ultima.criadoEm).toLocaleDateString("pt-BR")})
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {linhas.map((l) => (
          <div key={l.codigo}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-navy font-medium">
                {COMPETENCIAS[l.codigo].sigla} · {COMPETENCIAS[l.codigo].nome}
              </span>
              <span className="text-slate tabular-nums">
                {l.primeira} →{" "}
                <span className="text-navy font-bold">
                  <ContadorAnimado valor={l.ultima} duracao={0.9} />
                </span>
                <span className="text-xs"> /200</span>
              </span>
            </div>
            <div className="mt-1.5 space-y-1">
              <div
                className="bg-trilho h-2 w-full overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <div
                  className="bg-slate barra-anima h-full rounded-full"
                  style={{ "--pct": `${(l.primeira / 200) * 100}%` } as React.CSSProperties}
                />
              </div>
              <div
                className="bg-trilho h-2 w-full overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <div
                  className="bg-azul barra-anima h-full rounded-full"
                  style={{ "--pct": `${(l.ultima / 200) * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
