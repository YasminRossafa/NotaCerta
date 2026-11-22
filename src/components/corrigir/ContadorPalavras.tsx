"use client";

import { cn } from "@/lib/cn";

/**
 * Contador ao vivo dentro da área de texto. A barra usa ~300 palavras como
 * referência de uma redação de 30 linhas e fica verde a partir de 200 — é
 * orientação de escrita, não validação (quem valida o tamanho é o schema).
 */
const REFERENCIA = 300;
const SUFICIENTE = 200;

function contarPalavras(texto: string): number {
  return texto.trim().match(/\S+/g)?.length ?? 0;
}

export function ContadorPalavras({ texto, className }: { texto: string; className?: string }) {
  const palavras = contarPalavras(texto);
  const pct = Math.min(palavras / REFERENCIA, 1) * 100;
  const suficiente = palavras >= SUFICIENTE;

  return (
    <div
      className={cn("text-slate flex items-center gap-2 text-xs font-bold", className)}
      // O leitor de tela recebe só a contagem, sem repetir a cada tecla.
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="tabular-nums">{palavras} palavras</span>
      <span className="bg-trilho block h-1.5 w-[70px] overflow-hidden rounded-full">
        <span
          className={cn(
            "block h-full rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none",
            suficiente ? "bg-verde" : "bg-azul",
          )}
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
}
