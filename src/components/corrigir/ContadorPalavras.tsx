"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Uma redação do ENEM tem até 30 linhas; na prática fica entre ~220 e ~400 palavras.
 * A barra usa essa faixa como referência — é orientação de escrita, não validação
 * (quem valida o tamanho é o schema, por caracteres).
 */
const IDEAL_MIN = 220;
const IDEAL_MAX = 400;

function contarPalavras(texto: string): number {
  const limpo = texto.trim();
  return limpo ? limpo.split(/\s+/).length : 0;
}

type Situacao = "vazio" | "curta" | "ideal" | "longa";

function situacaoDe(palavras: number): Situacao {
  if (palavras === 0) return "vazio";
  if (palavras < IDEAL_MIN) return "curta";
  if (palavras <= IDEAL_MAX) return "ideal";
  return "longa";
}

const RECADO: Record<Situacao, string> = {
  vazio: "Cole a redação completa",
  curta: "Ainda curta para 30 linhas",
  ideal: "No tamanho de uma redação de 30 linhas",
  longa: "Mais longa que 30 linhas",
};

const COR_BARRA: Record<Situacao, string> = {
  vazio: "bg-borda",
  curta: "bg-ambar",
  ideal: "bg-verde",
  longa: "bg-ambar",
};

const COR_TEXTO: Record<Situacao, string> = {
  vazio: "text-slate",
  curta: "text-ambar-texto",
  ideal: "text-verde-texto",
  longa: "text-ambar-texto",
};

/** Contador ao vivo de palavras e caracteres, com barra até o tamanho de uma redação. */
export function ContadorPalavras({ texto, className }: { texto: string; className?: string }) {
  const reduzido = useReducedMotion();
  const palavras = contarPalavras(texto);
  const situacao = situacaoDe(palavras);
  const pct = Math.min(100, (palavras / IDEAL_MAX) * 100);

  return (
    <div className={cn("flex shrink-0 flex-col items-end gap-1", className)}>
      <p className="text-xs tabular-nums">
        <span className={cn("font-bold", COR_TEXTO[situacao])}>{palavras}</span>
        <span className="text-slate"> palavras · {texto.length.toLocaleString("pt-BR")} car.</span>
      </p>
      <div className="bg-cinza-fundo h-1 w-28 overflow-hidden rounded-full sm:w-36">
        <motion.div
          className={cn("h-full rounded-full", COR_BARRA[situacao])}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={reduzido ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {/* aria-live: o leitor de tela recebe só o recado, não o número a cada tecla. */}
      <p className={cn("text-[11px] font-medium", COR_TEXTO[situacao])} aria-live="polite">
        {RECADO[situacao]}
      </p>
    </div>
  );
}
