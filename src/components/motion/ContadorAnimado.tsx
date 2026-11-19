"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Conta de 0 até `valor` quando entra na tela (spec §18.5 — usado na nota total).
 * Respeita `prefers-reduced-motion` mostrando o número final direto.
 */
export function ContadorAnimado({
  valor,
  duracao = 1.1,
  className,
}: {
  valor: number;
  duracao?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const naTela = useInView(ref, { once: true, amount: 0.4 });
  const reduzido = useReducedMotion();
  const [animado, setAnimado] = useState(0);

  useEffect(() => {
    if (reduzido || !naTela) return;
    const controles = animate(0, valor, {
      duration: duracao,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAnimado(Math.round(v)),
    });
    return () => controles.stop();
  }, [naTela, valor, duracao, reduzido]);

  return (
    <span ref={ref} className={className}>
      {reduzido ? valor : animado}
    </span>
  );
}
