import { AnelDeNota } from "@/components/resultado/AnelDeNota";
import { Botao } from "@/components/ui/Botao";
import { IconeImpressora, IconeTexto } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { CODIGOS_COMPETENCIA, COMPETENCIAS, CORES_FAIXA, faixaDaNota } from "@/lib/competencias";
import type { Correcao } from "@/lib/schema";

/**
 * Cabeçalho compacto do resultado (spec §11): nota total, as 5 competências em barras bem
 * pequenas e o tema — fica visível (sticky) no desktop enquanto o aluno navega pelas seções.
 */
export function CabecalhoResumo({
  correcao,
  aoAbrirRedacaoCompleta,
  aoExportar,
}: {
  correcao: Correcao;
  aoAbrirRedacaoCompleta: () => void;
  aoExportar: () => void;
}) {
  return (
    <div className="border-borda/60 bg-superficie/95 py-4 backdrop-blur lg:sticky lg:top-16 lg:z-30 lg:border-b print:static print:border-0 print:bg-superficie print:py-0">
      <div className="container-nc flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <AnelDeNota nota={correcao.notaTotal} tamanho="sm" />
          <div className="min-w-0">
            <p className="text-slate text-xs font-semibold tracking-wide uppercase">Tema</p>
            <p className="text-navy truncate text-base font-semibold sm:text-lg">{correcao.tema}</p>
            {!correcao.completa && (
              <p className="text-xs font-semibold text-ambar-texto">
                Redação incompleta — nota não estimada
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {CODIGOS_COMPETENCIA.map((c) => {
            const nota = correcao.competencias[c].nota;
            const cores = CORES_FAIXA[faixaDaNota(nota)];
            const pct = Math.max(0, Math.min(100, (nota / 200) * 100));
            return (
              <div
                key={c}
                role="img"
                aria-label={`${COMPETENCIAS[c].nome}: ${nota} de 200`}
                className="flex flex-col items-center gap-1"
                title={`${COMPETENCIAS[c].nome}: ${nota}/200`}
              >
                <span className={cn("text-[11px] font-bold", cores.texto)}>
                  {COMPETENCIAS[c].sigla}
                </span>
                <div className="bg-cinza-fundo h-1.5 w-9 overflow-hidden rounded-full sm:w-11">
                  <div
                    className={cn("h-full rounded-full", cores.barra)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex shrink-0 gap-2 print:hidden">
          <Botao variante="secundario" tamanho="sm" onClick={aoAbrirRedacaoCompleta}>
            <IconeTexto width={16} height={16} />
            <span className="hidden sm:inline">Ver redação completa</span>
            <span className="sm:hidden">Redação completa</span>
          </Botao>
          <Botao variante="secundario" tamanho="sm" onClick={aoExportar}>
            <IconeImpressora width={16} height={16} />
            Exportar PDF
          </Botao>
        </div>
      </div>
    </div>
  );
}
