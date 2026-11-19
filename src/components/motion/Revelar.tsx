"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Revelação ao rolar (spec §18.5): sobe alguns pixels e aparece, uma vez só.
 * Com `prefers-reduced-motion` o conteúdo já nasce visível, sem animação.
 */
export function Revelar({
  children,
  atraso = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: ReactNode;
  /** segundos de atraso — use para escalonar itens de uma lista */
  atraso?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const reduzido = useReducedMotion();
  const Componente = motion[as];

  if (reduzido) {
    const Simples = as;
    return <Simples className={className}>{children}</Simples>;
  }

  return (
    <Componente
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Componente>
  );
}
