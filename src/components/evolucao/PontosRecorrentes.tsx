import { COMPETENCIAS } from "@/lib/competencias";
import {
  contarApontamentosPorCompetencia,
  palavrasFrequentesProblemas,
} from "@/lib/evolucao-analise";
import type { EntradaHistorico } from "@/lib/historico";

/**
 * "Pontos que mais se repetem" (spec "Minha evolução"): conta apontamentos por competência e
 * extrai as palavras mais frequentes nos `problema` de todas as correções — um raio-x rápido do
 * que mais vale a pena estudar.
 */
export function PontosRecorrentes({ entradas }: { entradas: EntradaHistorico[] }) {
  const porCompetencia = contarApontamentosPorCompetencia(entradas);
  const palavras = palavrasFrequentesProblemas(entradas);
  const maiorContagem = porCompetencia[0]?.total ?? 1;

  if (porCompetencia.length === 0) {
    return (
      <p className="text-slate text-sm">
        Nenhum apontamento registrado ainda — corrija mais redações para ver seus pontos recorrentes
        aqui.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h3 className="text-navy text-sm font-semibold">Por competência</h3>
        <ul className="mt-3 space-y-2.5">
          {porCompetencia.map((c) => (
            <li key={c.codigo}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-navy font-medium">
                  {COMPETENCIAS[c.codigo].sigla} · {COMPETENCIAS[c.codigo].nome}
                </span>
                <span className="text-slate tabular-nums">
                  {c.total} {c.total === 1 ? "apontamento" : "apontamentos"}
                </span>
              </div>
              <div
                className="bg-cinza-fundo mt-1 h-2 w-full overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <div
                  className="bg-azul h-full rounded-full"
                  style={{ width: `${(c.total / maiorContagem) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-navy text-sm font-semibold">Palavras mais frequentes nos problemas</h3>
        {palavras.length === 0 ? (
          <p className="text-slate mt-3 text-sm">
            Ainda não há repetição suficiente para destacar palavras-chave.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Palavras mais frequentes">
            {palavras.map((p) => (
              <li
                key={p.palavra}
                className="bg-cinza-fundo text-navy rounded-full px-3 py-1.5 text-sm"
              >
                {p.palavra} <span className="text-slate text-xs">× {p.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
