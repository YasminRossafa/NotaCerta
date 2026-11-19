"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CheckDesenhado } from "@/components/motion/CheckDesenhado";
import { cn } from "@/lib/cn";

/** Recados que giram enquanto a correção roda — contam o que está acontecendo. */
const RECADOS = [
  "Lendo sua introdução…",
  "Conferindo a estrutura dos parágrafos…",
  "Olhando vírgula, crase e concordância…",
  "Procurando a frase do motivo em cada desenvolvimento…",
  "Checando os 7 elementos da proposta de intervenção…",
  "Escolhendo repertórios para o seu tema…",
  "Montando a reescrita…",
];

const MS_POR_RECADO = 4200;

/** Etapas por competência — o avanço é por tempo (a API não transmite progresso). */
const ETAPAS = [
  { rotulo: "Redação lida e parágrafos separados", ms: 3500 },
  { rotulo: "C1 · Norma culta", ms: 6000 },
  { rotulo: "C2 · Tema e estrutura", ms: 6000 },
  { rotulo: "C3 · Argumentação e repertório", ms: 7000 },
  { rotulo: "C4 · Coesão entre os parágrafos", ms: 6000 },
  { rotulo: "C5 · Proposta de intervenção", ms: 7000 },
  { rotulo: "Reescritas e repertórios", ms: 999999 },
];

/**
 * Estado de carregando (spec §3.5): recados que giram, as competências sendo marcadas uma a
 * uma e o esqueleto do resultado abaixo, para o aluno já reconhecer a tela que vem.
 */
export function Carregando({ comImagem }: { comImagem?: boolean }) {
  const [etapa, setEtapa] = useState(0);
  const [recado, setRecado] = useState(0);
  const reduzido = useReducedMotion();

  useEffect(() => {
    if (etapa >= ETAPAS.length - 1) return;
    const t = window.setTimeout(() => setEtapa((e) => e + 1), ETAPAS[etapa].ms);
    return () => window.clearTimeout(t);
  }, [etapa]);

  useEffect(() => {
    const t = window.setInterval(
      () => setRecado((r) => (r + 1) % RECADOS.length),
      MS_POR_RECADO,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <div role="status" aria-live="polite">
      <div className="card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
            <span className="border-borda border-t-azul absolute inset-0 animate-spin rounded-full border-4 motion-reduce:animate-none" />
          </span>
          <div className="min-w-0 flex-1">
            {/* O recado troca com um deslize curto; é o que o aluno lê enquanto espera. */}
            <div className="h-7 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={recado}
                  initial={reduzido ? false : { y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduzido ? { opacity: 0 } : { y: -14, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="text-navy text-xl font-bold tracking-tight"
                >
                  {RECADOS[recado]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-slate mt-1 text-sm">
              {comImagem ? "Transcrevendo a foto e analisando" : "Analisando"} pelo método,
              competência por competência. Leva cerca de um minuto.
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
                  "flex items-center gap-3 text-sm transition-colors",
                  feita ? "text-slate" : atual ? "text-navy font-semibold" : "text-slate/50",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    feita
                      ? "border-verde text-verde bg-verde-claro"
                      : atual
                        ? "nc-pulse border-azul bg-azul-claro"
                        : "border-borda bg-superficie",
                  )}
                  aria-hidden="true"
                >
                  {feita && <CheckDesenhado tamanho={14} espessura={3.4} />}
                </span>
                {e.rotulo}
              </li>
            );
          })}
        </ol>
      </div>

      <EsqueletoResultado />
    </div>
  );
}

/** Prévia em cinza da tela de resultado, para a espera não terminar num salto. */
function EsqueletoResultado() {
  return (
    <div className="mt-4" aria-hidden="true">
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="nc-esqueleto h-16 w-16 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="nc-esqueleto h-3 w-20" />
            <div className="nc-esqueleto h-5 w-full max-w-xs" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="nc-esqueleto h-2.5 w-6" />
              <div className="nc-esqueleto h-1.5 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="nc-esqueleto h-24" />
        <div className="nc-esqueleto h-24" />
      </div>
    </div>
  );
}
