"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * O "certo" da professora: um check de caneta, com a mão tremida e o laço final
 * mais comprido, que se desenha sozinho. É a assinatura visual do NotaCerta —
 * aparece em cada sucesso e em cada item aprovado.
 */
export function CheckDesenhado({
  tamanho = 28,
  className,
  espessura = 2.6,
  atraso = 0,
  titulo,
}: {
  tamanho?: number;
  className?: string;
  espessura?: number;
  /** segundos antes de começar o traço */
  atraso?: number;
  titulo?: string;
}) {
  const reduzido = useReducedMotion();

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role={titulo ? "img" : undefined}
      aria-hidden={titulo ? undefined : true}
    >
      {titulo && <title>{titulo}</title>}
      {/* Traço único: desce curto, vira e sobe longo, como caneta em papel. */}
      <motion.path
        d="M5.2 16.8c1.9.7 3.4 2.4 4.9 5.4 1.1-4 3.3-8 6.1-11.4C18.9 7.9 22.2 5 26.4 3"
        stroke="currentColor"
        strokeWidth={espessura}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduzido ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduzido ? { duration: 0 } : { duration: 0.55, delay: atraso, ease: [0.3, 0.9, 0.4, 1] }
        }
      />
    </svg>
  );
}
