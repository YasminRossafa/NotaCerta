"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { proximoIndice } from "@/lib/teclado";

export type SecaoResultado = "visao-geral" | "paragrafos" | "repertorios" | "resumo";

export const SECOES_RESULTADO: { id: SecaoResultado; rotulo: string }[] = [
  { id: "visao-geral", rotulo: "Visão geral" },
  { id: "paragrafos", rotulo: "Texto por parágrafo" },
  { id: "repertorios", rotulo: "Repertórios" },
  { id: "resumo", rotulo: "Resumo do professor" },
];

/**
 * Navegação entre as 4 seções do resultado (spec §11): abas roláveis no mobile, coluna lateral
 * no desktop — mesma marcação, só muda a direção via classes responsivas.
 */
export function NavegacaoSecoes({
  ativa,
  aoSelecionar,
}: {
  ativa: SecaoResultado;
  aoSelecionar: (secao: SecaoResultado) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduzido = useReducedMotion();

  function onKeyDown(e: React.KeyboardEvent) {
    const atual = SECOES_RESULTADO.findIndex((s) => s.id === ativa);
    const prox = proximoIndice(atual, SECOES_RESULTADO.length, e.key);
    if (prox == null) return;
    e.preventDefault();
    aoSelecionar(SECOES_RESULTADO[prox].id);
    refs.current[prox]?.focus();
  }

  // min-w-0: sem isso a faixa rolável de abas alarga a coluna da grade no mobile.
  return (
    <nav aria-label="Seções do resultado" className="min-w-0 print:hidden">
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {SECOES_RESULTADO.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`aba-${s.id}`}
            aria-selected={ativa === s.id}
            aria-controls={`painel-${s.id}`}
            tabIndex={ativa === s.id ? 0 : -1}
            onClick={() => aoSelecionar(s.id)}
            className={cn(
              "relative min-h-[44px] shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-bold whitespace-nowrap transition-colors",
              ativa === s.id ? "text-white" : "text-slate hover:bg-cinza-fundo hover:text-navy",
            )}
          >
            {/* Fundo que desliza entre as seções (spec §18.5). */}
            {ativa === s.id && (
              <motion.span
                layoutId="indicador-secao-resultado"
                className="bg-azul-acao absolute inset-0 rounded-xl"
                transition={
                  reduzido
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 480, damping: 38, mass: 0.6 }
                }
              />
            )}
            <span className="relative">{s.rotulo}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
