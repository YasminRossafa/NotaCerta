"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { alternarTema, useTema } from "@/lib/tema";
import { useMontado } from "@/lib/use-cliente";

/** Sol/lua desenhados no mesmo traço dos outros ícones. */
function Sol() {
  return (
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </g>
  );
}

function Lua() {
  return (
    <path
      d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

export function AlternadorTema({ className }: { className?: string }) {
  const tema = useTema();
  const montado = useMontado();
  const reduzido = useReducedMotion();
  const escuro = tema === "escuro";

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className={cn(
        "border-borda text-slate hover:text-navy hover:border-azul/50 relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
        className,
      )}
    >
      {/* Antes de montar o estado é desconhecido: não desenha nada para não piscar o ícone errado. */}
      {montado && (
        <motion.svg
          key={escuro ? "lua" : "sol"}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
          initial={reduzido ? false : { rotate: -70, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {escuro ? <Lua /> : <Sol />}
        </motion.svg>
      )}
    </button>
  );
}
