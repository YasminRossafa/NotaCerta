"use client";

import { cn } from "@/lib/cn";
import { alternarTema, useTema } from "@/lib/tema";
import { useMontado } from "@/lib/use-cliente";

/**
 * Alterna claro/escuro. A troca do ícone é CSS puro (rotação + fade sobre duas
 * camadas), então não precisa de biblioteca de animação nem de JS extra.
 */
export function AlternadorTema({ className }: { className?: string }) {
  const tema = useTema();
  const montado = useMontado();
  const escuro = tema === "escuro";

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label="Alternar tema"
      title={escuro ? "Tema claro" : "Tema escuro"}
      className={cn(
        "text-slate hover:text-navy hover:bg-azul-claro relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
        className,
      )}
    >
      {/* Antes de montar o tema é desconhecido: nada é desenhado para não piscar o ícone errado. */}
      {montado && (
        <span className="relative block h-5 w-5">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-5 w-5 transition-[opacity,transform] duration-300 motion-reduce:transition-none",
              escuro ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
            )}
          >
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
            </g>
          </svg>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-5 w-5 transition-[opacity,transform] duration-300 motion-reduce:transition-none",
              escuro ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
            )}
          >
            <path
              d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
