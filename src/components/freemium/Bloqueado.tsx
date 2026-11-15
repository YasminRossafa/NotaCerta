"use client";

import type { ReactNode } from "react";
import { Botao } from "@/components/ui/Botao";
import { IconeCadeado } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";

/**
 * Envolve conteúdo do plano pago: mostra borrado, sem seleção, com cadeado e CTA (spec §13).
 */
export function Bloqueado({
  children,
  rotulo,
  aoPedirUpgrade,
  className,
}: {
  children: ReactNode;
  rotulo: string;
  aoPedirUpgrade: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div className="nc-borrado" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/55 p-4 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-azul-escuro shadow">
          <IconeCadeado />
        </span>
        <p className="max-w-xs text-sm font-medium text-navy">{rotulo}</p>
        <Botao tamanho="sm" onClick={aoPedirUpgrade}>
          Desbloquear com o Plano Fundador
        </Botao>
      </div>
    </div>
  );
}
