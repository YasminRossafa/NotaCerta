import { CORES_FAIXA, faixaDaNotaTotal } from "@/lib/competencias";
import { cn } from "@/lib/cn";

const TAMANHOS = {
  md: { px: 96, traco: 8, fonte: "text-2xl" },
  lg: { px: 168, traco: 12, fonte: "text-5xl" },
} as const;

/**
 * Círculo com a nota total (0–1000). Quando `nota` é null (redação incompleta),
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

  return (
    <div
      role="img"
      aria-label={nota == null ? "Nota não estimada: redação incompleta" : `Nota estimada ${nota} de 1000`}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: px, height: px }}
    >
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} aria-hidden="true">
        <circle cx={px / 2} cy={px / 2} r={raio} fill="none" stroke="#E2E8F0" strokeWidth={traco} />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={raio}
          fill="none"
          stroke={cor}
          strokeWidth={traco}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - fracao)}
          transform={`rotate(-90 ${px / 2} ${px / 2})`}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={cn("font-serif font-semibold text-navy tabular-nums", fonte)}>
          {nota == null ? "—" : nota}
        </span>
        <span
          className={cn(
            "mt-1 font-medium text-slate",
            tamanho === "lg" ? "text-sm" : "text-[10px]",
          )}
        >
          {nota == null ? "incompleta" : "de 1000"}
        </span>
      </div>
    </div>
  );
}
