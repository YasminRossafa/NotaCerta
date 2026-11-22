"use client";

import { useId, useState } from "react";
import { CORES_FAIXA, faixaDaNotaTotal } from "@/lib/competencias";
import {
  formatarDataCompleta,
  formatarDataCurta,
  ordemCronologica,
  resumoTextoEvolucao,
} from "@/lib/evolucao-analise";
import type { EntradaHistorico } from "@/lib/historico";

const LARGURA = 640;
const ALTURA = 280;
const PAD = { esquerda: 44, direita: 16, topo: 16, baixo: 34 };
const PLOT_W = LARGURA - PAD.esquerda - PAD.direita;
const PLOT_H = ALTURA - PAD.topo - PAD.baixo;

function x(i: number, n: number): number {
  return n <= 1 ? PAD.esquerda + PLOT_W / 2 : PAD.esquerda + (i / (n - 1)) * PLOT_W;
}
function y(nota: number): number {
  return PAD.topo + (1 - Math.max(0, Math.min(1000, nota)) / 1000) * PLOT_H;
}

/**
 * Gráfico de linha da nota ao longo do tempo (spec "Minha evolução"), em SVG — sem libs. Eixo Y
 * fixo 0–1000, linha de meta editável tracejada, ponto colorido pela faixa da nota (spec §10).
 * Acessível: `aria-label` com o resumo, resumo em texto sempre visível e uma tabela opcional.
 */
export function GraficoNota({ entradas, meta }: { entradas: EntradaHistorico[]; meta: number }) {
  const idBase = useId();
  const [ativo, setAtivo] = useState<number | null>(null);
  const [tabelaAberta, setTabelaAberta] = useState(false);

  const pontos = ordemCronologica(entradas).filter(
    (e): e is EntradaHistorico & { notaTotal: number } => e.notaTotal != null,
  );
  const resumo = resumoTextoEvolucao(entradas);

  if (pontos.length === 0) {
    return <p className="text-slate text-sm">Ainda não há correções com nota estimada.</p>;
  }

  const linha = pontos.map((p, i) => `${x(i, pontos.length)},${y(p.notaTotal)}`).join(" ");
  const ponto = ativo != null ? pontos[ativo] : null;

  return (
    <div>
      <p className="text-navy text-sm leading-relaxed">{resumo}</p>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          role="img"
          aria-label={resumo}
          className="h-auto w-full overflow-visible"
        >
          {/* grade horizontal */}
          {[0, 250, 500, 750, 1000].map((v) => (
            <g key={v}>
              <line
                x1={PAD.esquerda}
                x2={LARGURA - PAD.direita}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--nc-eixo)"
                strokeWidth={1}
              />
              {(v === 0 || v === 500 || v === 1000) && (
                <text
                  x={PAD.esquerda - 8}
                  y={y(v)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-slate text-[11px]"
                >
                  {v}
                </text>
              )}
            </g>
          ))}

          {/* linha de meta */}
          <line
            x1={PAD.esquerda}
            x2={LARGURA - PAD.direita}
            y1={y(meta)}
            y2={y(meta)}
            stroke="var(--color-azul)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text
            x={LARGURA - PAD.direita}
            y={y(meta) - 6}
            textAnchor="end"
            className="fill-azul-escuro text-[11px] font-semibold"
          >
            Meta: {meta}
          </text>

          {/* linha da nota */}
          <polyline
            points={linha}
            fill="none"
            stroke="var(--color-azul)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* eixo X: datas */}
          {pontos.map((p, i) => (
            <text
              key={`eixo-${p.id}`}
              x={x(i, pontos.length)}
              y={ALTURA - PAD.baixo + 20}
              textAnchor="middle"
              className="fill-slate text-[10px]"
            >
              {pontos.length <= 8 || i === 0 || i === pontos.length - 1 || i % 2 === 0
                ? formatarDataCurta(p.criadoEm)
                : ""}
            </text>
          ))}

          {/* pontos */}
          {pontos.map((p, i) => {
            const cor = CORES_FAIXA[faixaDaNotaTotal(p.notaTotal)].hex;
            return (
              <circle
                key={p.id}
                id={`${idBase}-pt-${i}`}
                cx={x(i, pontos.length)}
                cy={y(p.notaTotal)}
                r={ativo === i ? 7 : 5}
                fill={cor}
                stroke="var(--color-superficie)"
                strokeWidth={2}
                tabIndex={0}
                aria-label={`${formatarDataCompleta(p.criadoEm)}: nota ${p.notaTotal} de 1000, tema ${p.tema}${p.demo ? " (exemplo)" : ""}`}
                className="cursor-pointer transition-[r] outline-none motion-reduce:transition-none"
                onMouseEnter={() => setAtivo(i)}
                onMouseLeave={() => setAtivo(null)}
                onFocus={() => setAtivo(i)}
                onBlur={() => setAtivo(null)}
              />
            );
          })}
        </svg>

        {ponto && (
          <div
            role="status"
            className="border-borda text-navy pointer-events-none absolute z-10 w-max max-w-[220px] -translate-x-1/2 -translate-y-full rounded-lg border bg-superficie px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${(x(ativo ?? 0, pontos.length) / LARGURA) * 100}%`,
              top: `${(y(ponto.notaTotal) / ALTURA) * 100}%`,
            }}
          >
            <p className="font-semibold">{ponto.notaTotal} pontos</p>
            <p className="text-slate">{formatarDataCompleta(ponto.criadoEm)}</p>
            <p className="text-slate truncate">{ponto.tema}</p>
            {ponto.demo && <p className="text-ambar-texto">Exemplo (dado de demonstração)</p>}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setTabelaAberta((v) => !v)}
        aria-expanded={tabelaAberta}
        className="text-azul mt-3 min-h-[36px] text-sm font-semibold underline print:hidden"
      >
        {tabelaAberta ? "Ocultar tabela de dados" : "Ver dados em tabela"}
      </button>

      <div className={tabelaAberta ? "mt-3 block" : "mt-3 hidden print:block"}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="text-slate text-xs font-semibold tracking-wide uppercase">
              <tr>
                <th scope="col" className="py-1.5 pr-4">
                  Data
                </th>
                <th scope="col" className="py-1.5 pr-4">
                  Tema
                </th>
                <th scope="col" className="py-1.5">
                  Nota
                </th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((p) => (
                <tr key={p.id} className="border-borda/60 border-t">
                  <td className="text-navy py-1.5 pr-4 whitespace-nowrap">
                    {formatarDataCurta(p.criadoEm)}
                    {p.demo && <span className="text-slate"> (exemplo)</span>}
                  </td>
                  <td className="text-navy py-1.5 pr-4">{p.tema}</td>
                  <td className="text-navy py-1.5 font-semibold">{p.notaTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
