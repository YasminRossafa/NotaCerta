"use client";

import { useId, useState, type ReactNode } from "react";
import { IconeChevron } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";

/**
 * Bloco colapsável de um dos 4 "blocos" do parágrafo (spec §11: seu texto / o que ajustar /
 * checklist / reescrita). O conteúdo fica sempre no DOM (só visibilidade muda) para a
 * exportação em PDF (`print:block`) mostrar tudo, mesmo o que está fechado na tela.
 */
export function BlocoColapsavel({
  titulo,
  abertoInicialmente = true,
  acoes,
  children,
  className,
}: {
  titulo: string;
  abertoInicialmente?: boolean;
  acoes?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [aberto, setAberto] = useState(abertoInicialmente);
  const id = useId();

  return (
    <section className={cn("card break-inside-avoid overflow-hidden", className)}>
      <div className="border-borda/60 flex items-center justify-between gap-3 border-b px-5 py-3.5">
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls={id}
          className="text-navy flex min-h-[44px] flex-1 items-center gap-2 text-left text-base font-semibold sm:text-lg"
        >
          {titulo}
          <IconeChevron
            className={cn(
              "text-slate ml-auto shrink-0 transition-transform print:hidden",
              aberto && "rotate-180",
            )}
          />
        </button>
        {acoes}
      </div>
      <div id={id} className={cn(aberto ? "block" : "hidden", "print:block", "p-5")}>
        {children}
      </div>
    </section>
  );
}
