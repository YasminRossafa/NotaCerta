"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Revelação ao rolar. A animação é CSS (utilitário `revelar`); aqui só entra o
 * IntersectionObserver que liga `data-visivel`. Com `prefers-reduced-motion` o
 * próprio CSS já deixa o conteúdo visível e parado.
 */
export function Revelar({
  children,
  atraso = 0,
  className,
  as: Componente = "div",
}: {
  children: ReactNode;
  /** milissegundos de atraso — para escalonar itens de uma lista */
  atraso?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span" | "aside";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            setVisivel(true);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Componente
      // @ts-expect-error — ref polimórfico: o elemento é sempre um HTMLElement.
      ref={ref}
      data-visivel={visivel ? "true" : "false"}
      style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}
      className={cn("revelar", className)}
    >
      {children}
    </Componente>
  );
}
