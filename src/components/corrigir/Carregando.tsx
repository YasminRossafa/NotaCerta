"use client";

import { useEffect, useState } from "react";
import { IconeCheck } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";

const ETAPAS = [
  { rotulo: "Lendo a redação e identificando os parágrafos", ms: 3500 },
  { rotulo: "C1 · Norma culta: vírgula, crase, concordância", ms: 6000 },
  { rotulo: "C2 · Tema e estrutura da introdução", ms: 6000 },
  { rotulo: "C3 · Argumentação: motivo, citação e repertório", ms: 7000 },
  { rotulo: "C4 · Coesão: conectivos de D1, D2 e conclusão", ms: 6000 },
  { rotulo: "C5 · Proposta de intervenção: os 7 elementos", ms: 7000 },
  { rotulo: "Escrevendo as reescritas e escolhendo repertórios", ms: 999999 },
];

/**
 * Estado de carregando que mostra a análise avançando por competência (spec §3.5).
 * O avanço é por tempo (a API não transmite progresso); a última etapa fica aberta até a resposta.
 */
export function Carregando({ comImagem }: { comImagem?: boolean }) {
  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    if (etapa >= ETAPAS.length - 1) return;
    const t = window.setTimeout(() => setEtapa((e) => e + 1), ETAPAS[etapa].ms);
    return () => window.clearTimeout(t);
  }, [etapa]);

  return (
    <div className="card mx-auto max-w-xl p-6 sm:p-8" role="status" aria-live="polite">
      <div className="flex items-center gap-4">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-borda border-t-azul" />
        </span>
        <div>
          <p className="font-serif text-xl font-semibold text-navy">Corrigindo sua redação…</p>
          <p className="text-sm text-slate">
            {comImagem ? "Transcrevendo a foto e " : ""}analisando pelo método, competência por
            competência. Leva cerca de um minuto.
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-2.5">
        {ETAPAS.map((e, i) => {
          const feita = i < etapa;
          const atual = i === etapa;
          return (
            <li
              key={e.rotulo}
              className={cn(
                "flex items-center gap-3 text-sm",
                feita ? "text-slate" : atual ? "font-medium text-navy" : "text-slate/60",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  feita
                    ? "border-verde bg-verde text-white"
                    : atual
                      ? "nc-pulse border-azul bg-azul-claro"
                      : "border-borda bg-white",
                )}
                aria-hidden="true"
              >
                {feita && <IconeCheck width={14} height={14} />}
              </span>
              {e.rotulo}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
