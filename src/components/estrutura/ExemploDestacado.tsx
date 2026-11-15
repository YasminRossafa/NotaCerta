"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { corDoRotulo, legendaDoTipo, type Exemplo } from "@/lib/estrutura";
import { ROTULO_PARAGRAFO } from "@/lib/schema";

/**
 * Redação-modelo com cada parte colorida pelo rótulo, legenda e seletor de tema (spec §8.7).
 * Clicar/focar um item da legenda realça as partes daquele rótulo.
 */
export function ExemploDestacado({ exemplos }: { exemplos: Exemplo[] }) {
  const [idx, setIdx] = useState(0);
  const [rotuloAtivo, setRotuloAtivo] = useState<string | null>(null);
  const seletorId = useId();
  const exemplo = exemplos[idx];

  return (
    <div className="space-y-5">
      {exemplos.length > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={seletorId} className="text-navy text-sm font-semibold">
            Tema do exemplo
          </label>
          <select
            id={seletorId}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="border-borda text-navy focus:border-azul min-h-[44px] w-full rounded-xl border bg-white px-3 text-base focus:outline-none sm:max-w-xl"
          >
            {exemplos.map((ex, i) => (
              <option key={ex.id} value={i}>
                {ex.tema}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="bg-navy px-5 py-4 text-white sm:px-7">
          <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">Tema</p>
          <p className="font-serif text-xl leading-snug font-semibold sm:text-2xl">
            {exemplo.tema}
          </p>
        </div>

        {exemplo.rascunho && (
          <p className="bg-amber-50 px-5 py-2.5 text-xs text-amber-900 sm:px-7">
            Exemplo escrito pelo NotaCerta seguindo o método — ainda não revisado pela professora.
          </p>
        )}

        <div className="divide-borda divide-y">
          {exemplo.paragrafos.map((p, i) => {
            const legendaParagrafo = legendaDoTipo(p.tipo);
            return (
              <section
                key={`${exemplo.id}-${p.tipo}`}
                aria-label={ROTULO_PARAGRAFO[p.tipo]}
                className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_220px]"
              >
                {/* Texto colorido */}
                <div>
                  <p className="text-slate mb-2 text-xs font-semibold tracking-wide uppercase">
                    {i + 1}. {ROTULO_PARAGRAFO[p.tipo]}
                  </p>
                  <p className="text-navy text-[15.5px] leading-[1.9] sm:text-base">
                    {p.partes.map((parte, j) => {
                      const cor = corDoRotulo(parte.rotulo);
                      const apagado = rotuloAtivo !== null && rotuloAtivo !== parte.rotulo;
                      return (
                        <span key={j}>
                          <span
                            className={cn(
                              "rounded-[4px] border-b-2 px-1 py-0.5 transition-opacity",
                              cor.fundo,
                              cor.texto,
                              cor.borda,
                              apagado && "opacity-35",
                            )}
                            title={parte.rotulo}
                          >
                            <span className="sr-only">[{parte.rotulo}] </span>
                            {parte.texto}
                          </span>{" "}
                        </span>
                      );
                    })}
                  </p>
                </div>

                {/* Legenda deste parágrafo */}
                <aside aria-label={`Legenda — ${ROTULO_PARAGRAFO[p.tipo]}`}>
                  <p className="text-slate mb-2 text-xs font-semibold tracking-wide uppercase">
                    Legenda
                  </p>
                  <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
                    {legendaParagrafo.map((r) => {
                      const cor = corDoRotulo(r);
                      const ativo = rotuloAtivo === r;
                      return (
                        <li key={r}>
                          <button
                            type="button"
                            aria-pressed={ativo}
                            onClick={() => setRotuloAtivo(ativo ? null : r)}
                            className={cn(
                              "flex min-h-[36px] w-full items-center gap-2 rounded-lg px-2 text-left text-sm transition-colors",
                              ativo ? "bg-cinza-fundo" : "hover:bg-cinza-fundo",
                            )}
                          >
                            <span
                              className={cn(
                                "h-3.5 w-3.5 shrink-0 rounded-sm border-b-2",
                                cor.fundo,
                                cor.borda,
                              )}
                              aria-hidden="true"
                            />
                            <span className="text-navy">{r}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </aside>
              </section>
            );
          })}
        </div>

        {rotuloAtivo && (
          <div className="border-borda border-t px-5 py-3 sm:px-7">
            <button
              type="button"
              onClick={() => setRotuloAtivo(null)}
              className="text-azul min-h-[36px] text-xs font-semibold underline"
            >
              Mostrar todos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
