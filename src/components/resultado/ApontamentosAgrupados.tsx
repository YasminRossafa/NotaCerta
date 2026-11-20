"use client";

import { IconeCheck } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { CODIGOS_COMPETENCIA, COMPETENCIAS, type CodigoCompetencia } from "@/lib/competencias";
import type { Apontamento } from "@/lib/schema";

type Filtro = CodigoCompetencia | "todas";

/**
 * Bloco "O que ajustar" (spec §11.3): um cartão por apontamento, agrupado por competência com
 * filtro. Cada cartão tem um id estável (`${idBase}-ap-${indiceOriginal}`) para o clique no
 * trecho destacado (bloco "Seu texto") rolar e piscar até ele.
 */
export function ApontamentosAgrupados({
  apontamentos,
  idBase,
  ativo,
  aoFocar,
  filtro,
  aoFiltrar,
}: {
  apontamentos: Apontamento[];
  idBase: string;
  ativo: number | null;
  aoFocar: (indice: number | null) => void;
  filtro: Filtro;
  aoFiltrar: (f: Filtro) => void;
}) {
  if (apontamentos.length === 0) {
    return (
      <p className="bg-verde-claro flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-verde-texto">
        <IconeCheck width={18} height={18} />
        Dentro do modelo. Nada a apontar aqui.
      </p>
    );
  }

  const grupos = CODIGOS_COMPETENCIA.map((codigo) => ({
    codigo,
    itens: apontamentos
      .map((a, indiceOriginal) => ({ ...a, indiceOriginal }))
      .filter((a) => a.competencia === codigo),
  })).filter((g) => g.itens.length > 0);

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrar por competência"
        className="flex flex-wrap gap-2 print:hidden"
      >
        <ChipFiltro ativo={filtro === "todas"} onClick={() => aoFiltrar("todas")}>
          Todas ({apontamentos.length})
        </ChipFiltro>
        {grupos.map((g) => (
          <ChipFiltro
            key={g.codigo}
            ativo={filtro === g.codigo}
            onClick={() => aoFiltrar(g.codigo)}
          >
            {COMPETENCIAS[g.codigo].sigla} ({g.itens.length})
          </ChipFiltro>
        ))}
      </div>

      {/* Todos os grupos ficam no DOM (só a visibilidade muda) para a exportação em PDF
          mostrar tudo, mesmo o que o filtro esconde na tela — ver `print:block`. */}
      <div className="mt-4 space-y-5">
        {grupos.map((g) => (
          <div
            key={g.codigo}
            className={cn(
              filtro === "todas" || filtro === g.codigo ? "block" : "hidden",
              "print:block",
            )}
          >
            {grupos.length > 1 && (
              <p className="text-slate mb-2 text-xs font-semibold tracking-wide uppercase">
                {COMPETENCIAS[g.codigo].nome}
              </p>
            )}
            <ol className="space-y-3">
              {g.itens.map((a) => (
                <li
                  key={a.indiceOriginal}
                  id={`${idBase}-ap-${a.indiceOriginal}`}
                  tabIndex={0}
                  onMouseEnter={() => aoFocar(a.indiceOriginal)}
                  onMouseLeave={() => aoFocar(null)}
                  onFocus={() => aoFocar(a.indiceOriginal)}
                  onBlur={() => aoFocar(null)}
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    ativo === a.indiceOriginal
                      ? "border-ambar bg-ambar-claro/40"
                      : "border-borda/70 bg-superficie",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-navy text-sm">
                      <span className="bg-ambar-claro mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-ambar-texto">
                        {a.indiceOriginal + 1}
                      </span>
                      <q className="font-medium">{a.trecho}</q>
                    </p>
                    <span
                      className="bg-cinza-fundo text-slate shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold"
                      title={COMPETENCIAS[a.competencia].nome}
                    >
                      {COMPETENCIAS[a.competencia].sigla}
                    </span>
                  </div>
                  <dl className="mt-2.5 space-y-1.5 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-vermelho w-[72px] shrink-0 font-semibold">Problema</dt>
                      <dd className="text-navy">{a.problema}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-azul-escuro w-[72px] shrink-0 font-semibold">Motivo</dt>
                      <dd className="text-navy">{a.motivo}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChipFiltro({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={cn(
        "min-h-[32px] rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        ativo ? "bg-azul-acao text-white" : "bg-cinza-fundo text-slate hover:text-navy",
      )}
    >
      {children}
    </button>
  );
}
