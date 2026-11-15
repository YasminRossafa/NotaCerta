"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconeX } from "@/components/ui/Icones";

/** Modal acessível baseado em <dialog>: fecha com Esc, clique fora e botão. */
export function Modal({
  aberto,
  aoFechar,
  titulo,
  children,
  className,
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (aberto && !el.open) el.showModal();
    if (!aberto && el.open) el.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
      className={cn(
        "border-borda text-navy m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border bg-white p-0 shadow-xl",
        "backdrop:bg-navy/50 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      <div className="p-5 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-2xl leading-tight font-semibold">{titulo}</h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="text-slate hover:bg-cinza-fundo -mt-2 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            <IconeX />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
