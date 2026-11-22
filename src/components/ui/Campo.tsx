"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  rotulo: string;
  ajuda?: ReactNode;
  erro?: string;
  className?: string;
};

export const Campo = forwardRef<HTMLInputElement, Props>(function Campo(
  { rotulo, ajuda, erro, className, id, ...rest },
  ref,
) {
  const gerado = useId();
  const inputId = id ?? gerado;
  const ajudaId = `${inputId}-ajuda`;
  const erroId = `${inputId}-erro`;
  const describedBy = [ajuda ? ajudaId : null, erro ? erroId : null].filter(Boolean).join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-navy text-sm font-semibold">
        {rotulo}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={erro ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          "text-navy placeholder:text-slate/70 min-h-[44px] w-full rounded-xl border bg-superficie px-3.5 text-base",
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
