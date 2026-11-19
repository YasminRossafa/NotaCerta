"use client";

import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  rotulo: string;
  ajuda?: ReactNode;
  erro?: string;
  contador?: string;
  className?: string;
};

export const AreaTexto = forwardRef<HTMLTextAreaElement, Props>(function AreaTexto(
  { rotulo, ajuda, erro, contador, className, id, ...rest },
  ref,
) {
  const gerado = useId();
  const areaId = id ?? gerado;
  const ajudaId = `${areaId}-ajuda`;
  const erroId = `${areaId}-erro`;
  const describedBy = [ajuda ? ajudaId : null, erro ? erroId : null].filter(Boolean).join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={areaId} className="text-navy text-sm font-semibold">
          {rotulo}
        </label>
        {contador && <span className="text-slate text-xs tabular-nums">{contador}</span>}
      </div>
      <textarea
        ref={ref}
        id={areaId}
        aria-invalid={erro ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          "text-navy placeholder:text-slate/70 min-h-[260px] w-full resize-y rounded-xl border bg-superficie px-3.5 py-3 text-base leading-relaxed",
          "focus:border-azul focus:outline-none",
          erro ? "border-vermelho" : "border-borda",
        )}
        {...rest}
      />
      {ajuda && !erro && (
        <p id={ajudaId} className="text-slate text-sm">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={erroId} role="alert" className="text-vermelho text-sm font-medium">
          {erro}
        </p>
      )}
    </div>
  );
});
