import { BarraCompetencia } from "@/components/resultado/BarraCompetencia";
import { cn } from "@/lib/cn";
import { CODIGOS_COMPETENCIA } from "@/lib/competencias";
import { ROTULO_PARAGRAFO, type Correcao } from "@/lib/schema";
import { CLASSES_CHIP_STATUS, COR_PONTO_STATUS, ROTULO_STATUS } from "@/lib/status-paragrafo";

/**
 * Seção "Visão geral" (spec §11): nota por competência com justificativa, e os parágrafos como
 * atalhos que levam direto à etapa correspondente em "Texto por parágrafo".
 */
export function SecaoVisaoGeral({
  correcao,
  aoAbrirParagrafo,
}: {
  correcao: Correcao;
  aoAbrirParagrafo: (indice: number) => void;
}) {
  return (
    <div className="space-y-6">
      <section aria-labelledby="vg-competencias-titulo" className="card p-5 sm:p-6">
        <h2 id="vg-competencias-titulo" className="text-navy text-xl font-semibold">
          Nota por competência
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 print:block print:space-y-4">
          {CODIGOS_COMPETENCIA.map((c) => (
            <div
              key={c}
              className="border-borda bg-superficie-2 card-elevavel min-w-0 rounded-2xl border p-4"
            >
              <BarraCompetencia
                codigo={c}
                nota={correcao.competencias[c].nota}
                justificativa={correcao.competencias[c].justificativa}
              />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="vg-paragrafos-titulo" className="card p-5 sm:p-6">
        <h2 id="vg-paragrafos-titulo" className="text-navy text-xl font-semibold">
          Parágrafos
        </h2>
        <ul className="mt-4 space-y-2">
          {correcao.paragrafos.map((p, i) => (
            <li key={`${p.tipo}-${i}`}>
              <button
                type="button"
                onClick={() => aoAbrirParagrafo(i)}
                className="border-borda hover:border-azul/50 hover:bg-azul-claro flex min-h-[52px] w-full items-center justify-between gap-3 rounded-2xl border px-4 text-left transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn("h-2.5 w-2.5 shrink-0 rounded-full", COR_PONTO_STATUS[p.status])}
                    aria-hidden="true"
                  />
                  <span className="text-navy font-medium">{ROTULO_PARAGRAFO[p.tipo]}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                    CLASSES_CHIP_STATUS[p.status],
                  )}
                >
                  {ROTULO_STATUS[p.status]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
