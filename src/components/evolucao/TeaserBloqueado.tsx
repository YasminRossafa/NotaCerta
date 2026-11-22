"use client";

import { ComparativoCompetencias } from "@/components/evolucao/ComparativoCompetencias";
import { GraficoNota } from "@/components/evolucao/GraficoNota";
import { Bloqueado } from "@/components/freemium/Bloqueado";
import { Botao } from "@/components/ui/Botao";
import { calcularTendencia } from "@/lib/evolucao-analise";
import { gerarHistoricoDemo } from "@/lib/evolucao-demo";
import { META_PADRAO } from "@/lib/historico";

/**
 * Prévia bloqueada de "Minha evolução" para quem não é Fundador: mesmos gráficos, com dados de
 * amostra (gerados na hora, nunca salvos) e borrados, com CTA para o Plano Fundador.
 */
export function TeaserBloqueado({ aoPedirUpgrade }: { aoPedirUpgrade: () => void }) {
  const amostra = gerarHistoricoDemo();
  const tendencia = calcularTendencia(amostra);

  return (
    <div className="space-y-6">
      <div className="card bg-azul-claro flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-navy font-semibold">Acompanhe sua evolução, exclusivo Fundador</p>
          <p className="text-slate mt-1 text-sm">
            Veja a nota subir ao longo do tempo, compare competências entre a primeira e a última
            correção e descubra o que mais se repete nos apontamentos.
          </p>
        </div>
        <Botao onClick={aoPedirUpgrade} className="shrink-0 whitespace-nowrap">
          Plano Fundador
        </Botao>
      </div>

      <Bloqueado
        rotulo="Minha evolução é um recurso do Plano Fundador."
        aoPedirUpgrade={aoPedirUpgrade}
      >
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <h2 className="text-navy text-xl font-semibold">Nota ao longo do tempo</h2>
            <div className="mt-4">
              <GraficoNota entradas={amostra} meta={META_PADRAO} />
            </div>
          </section>
          {tendencia && (
            <section className="card p-5 sm:p-6">
              <h2 className="text-navy text-xl font-semibold">Competências: primeira × última</h2>
              <div className="mt-4">
                <ComparativoCompetencias entradas={amostra} tendencia={tendencia} />
              </div>
            </section>
          )}
        </div>
      </Bloqueado>
    </div>
  );
}
