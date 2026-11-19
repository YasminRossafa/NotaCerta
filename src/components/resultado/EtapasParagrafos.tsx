"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { ROTULO_PARAGRAFO, type Paragrafo } from "@/lib/schema";
import { COR_PONTO_STATUS, ROTULO_STATUS } from "@/lib/status-paragrafo";
import { proximoIndice } from "@/lib/teclado";

/** Stepper de parágrafos (spec §11.3): Introdução, D1, D2, Conclusão, com status por ponto. */
export function EtapasParagrafos({
  paragrafos,
  indiceAtivo,
  aoSelecionar,
}: {
  paragrafos: Paragrafo[];
  indiceAtivo: number;
  aoSelecionar: (indice: number) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    const prox = proximoIndice(indiceAtivo, paragrafos.length, e.key);
    if (prox == null) return;
    e.preventDefault();
    aoSelecionar(prox);
    refs.current[prox]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Parágrafos da redação"
      onKeyDown={onKeyDown}
      className="flex gap-2 overflow-x-auto pb-1 print:hidden"
    >
      {paragrafos.map((p, i) => (
        <button
          key={`${p.tipo}-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`etapa-paragrafo-${i}`}
          aria-selected={indiceAtivo === i}
          aria-controls={`painel-paragrafo-${i}`}
          tabIndex={indiceAtivo === i ? 0 : -1}
          onClick={() => aoSelecionar(i)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors",
            indiceAtivo === i
              ? "border-azul bg-azul-claro text-azul-escuro"
              : "border-borda text-slate hover:bg-cinza-fundo",
          )}
        >
          <span
            className={cn("h-2.5 w-2.5 shrink-0 rounded-full", COR_PONTO_STATUS[p.status])}
            aria-hidden="true"
          />
          {ROTULO_PARAGRAFO[p.tipo]}
          <span className="sr-only"> ({ROTULO_STATUS[p.status]})</span>
        </button>
      ))}
    </div>
  );
}
