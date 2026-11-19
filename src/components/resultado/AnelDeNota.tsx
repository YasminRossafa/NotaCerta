"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { ContadorAnimado } from "@/components/motion/ContadorAnimado";
import { CORES_FAIXA, faixaDaNotaTotal } from "@/lib/competencias";
import { cn } from "@/lib/cn";

const TAMANHOS = {
  sm: { px: 56, traco: 5, fonte: "text-sm" },
  md: { px: 96, traco: 8, fonte: "text-2xl" },
  lg: { px: 168, traco: 12, fonte: "text-5xl" },
} as const;

/**
 * Círculo com a nota total (0–1000). O arco se desenha e o número conta de 0 até a nota
 * quando o anel entra na tela (spec §18.5). Quando `nota` é null (redação incompleta),
 * mostra um traço e o rótulo "incompleta".
 */
export function AnelDeNota({
  nota,
  tamanho = "lg",
  className,
}: {
  nota: number | null;
  tamanho?: keyof typeof TAMANHOS;
  className?: string;
}) {
  const { px, traco, fonte } = TAMANHOS[tamanho];
  const raio = (px - traco) / 2;
  const circ = 2 * Math.PI * raio;
  const fracao = nota == null ? 0 : Math.max(0, Math.min(1, nota / 1000));
  const cor = nota == null ? "#94A3B8" : CORES_FAIXA[faixaDaNotaTotal(nota)].hex;

  const ref = useRef<HTMLDivElement>(null);
  const naTela = useInView(ref, { once: true, amount: 0.5 });
  const reduzido = useReducedMotion();
  const desenhar = reduzido || naTela;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={
        nota == null ? "Nota não estimada: redação incompleta" : `Nota estimada ${nota} de 1000`
      }
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: px, height: px }}
    >
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} aria-hidden="true">
        <circle
          cx={px / 2}
          cy={px / 2}
          r={raio}
          fill="none"
          stroke="var(--nc-eixo)"
          strokeWidth={traco}
        />
        <motion.circle
          cx={px / 2}
          cy={px / 2}
          r={raio}
          fill="none"
          stroke={cor}
          strokeWidth={traco}
          strokeLinecap="round"
          strokeDasharray={circ}
          transform={`rotate(-90 ${px / 2} ${px / 2})`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - (desenhar ? fracao : 0)) }}
          transition={
            reduzido ? { duration: 0 } : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={cn("text-navy font-extrabold tabular-nums", fonte)}>
          {nota == null ? "—" : <ContadorAnimado valor={nota} />}
        </span>
        <span
          className={cn(
            "text-slate mt-1 font-semibold",
            tamanho === "lg" ? "text-sm" : "text-[10px]",
          )}
        >
          {nota == null ? "incompleta" : "de 1000"}
        </span>
      </div>
    </div>
  );
}
