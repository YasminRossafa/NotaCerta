import { COMPETENCIAS, CORES_FAIXA, faixaDaNota, type CodigoCompetencia } from "@/lib/competencias";
import { cn } from "@/lib/cn";

/**
 * Barra de uma competência (C1–C5) com nota em cor semântica e justificativa.
 * `compacta` esconde a justificativa e reduz a altura (usada na prévia e na lateral).
 */
export function BarraCompetencia({
  codigo,
  nota,
  justificativa,
  compacta,
  className,
}: {
  codigo: CodigoCompetencia;
  nota: number;
  justificativa?: string;
  compacta?: boolean;
  className?: string;
}) {
  const meta = COMPETENCIAS[codigo];
  const cores = CORES_FAIXA[faixaDaNota(nota)];
  const pct = Math.max(0, Math.min(100, (nota / 200) * 100));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "flex h-7 w-9 shrink-0 items-center justify-center rounded-md text-xs font-bold",
              cores.fundo,
              cores.texto,
            )}
          >
            {meta.sigla}
          </span>
          <span
            className={cn("text-navy truncate font-medium", compacta ? "text-sm" : "text-base")}
            title={meta.descricao}
          >
            {meta.nome}
          </span>
        </div>
        <span
          className={cn(
            "shrink-0 font-semibold tabular-nums",
            cores.texto,
            compacta ? "text-sm" : "text-base",
          )}
        >
          {nota}
          <span className="text-slate text-xs font-normal">/200</span>
        </span>
      </div>
      <div
        role="meter"
        aria-label={`${meta.sigla} ${meta.nome}`}
        aria-valuemin={0}
        aria-valuemax={200}
        aria-valuenow={nota}
        className={cn(
          "bg-cinza-fundo w-full overflow-hidden rounded-full",
          compacta ? "h-2" : "h-2.5",
        )}
      >
        <div
          className={cn("h-full rounded-full", cores.barra)}
          style={{ width: `${pct}%`, transition: "width 700ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </div>
      {!compacta && justificativa && (
        <p className="text-slate text-sm leading-relaxed">{justificativa}</p>
      )}
    </div>
  );
}
