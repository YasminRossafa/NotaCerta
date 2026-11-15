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

  // Legenda global: união das legendas na ordem introdução → desenvolvimento → conclusão, sem repetir.
  const legenda = Array.from(
    new Set([
      ...legendaDoTipo("introducao"),
      ...legendaDoTipo("desenvolvimento1"),
      ...legendaDoTipo("conclusao"),
    ]),
  );

  return (
    <div className="space-y-5">
      {exemplos.length > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={seletorId} className="text-sm font-semibold text-navy">
            Tema do exemplo
          </label>
          <select
            id={seletorId}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="min-h-[44px] w-full rounded-xl border border-borda bg-white px-3 text-base text-navy focus:border-azul focus:outline-none sm:max-w-xl"
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
          <p className="font-serif text-xl leading-snug font-semibold sm:text-2xl">{exemplo.tema}</p>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_240px]">
          {/* Texto colorido */}
          <div className="space-y-6">
            {exemplo.paragrafos.map((p, i) => (
              <section key={`${exemplo.id}-${p.tipo}`} aria-label={ROTULO_PARAGRAFO[p.tipo]}>
                <p className="mb-2 text-xs font-semibold tracking-wide text-slate uppercase">
                  {i + 1}. {ROTULO_PARAGRAFO[p.tipo]}
                </p>
                <p className="text-[15.5px] leading-[1.9] text-navy sm:text-base">
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
              </section>
            ))}
          </div>

          {/* Legenda */}
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Legenda das cores">
            <p className="mb-2 text-xs font-semibold tracking-wide text-slate uppercase">Legenda</p>
            <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
              {legenda.map((r) => {
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
                      <span className={cn("h-3.5 w-3.5 shrink-0 rounded-sm border-b-2", cor.fundo, cor.borda)} aria-hidden="true" />
                      <span className="text-navy">{r}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {rotuloAtivo && (
              <button
                type="button"
                onClick={() => setRotuloAtivo(null)}
                className="mt-2 min-h-[36px] text-xs font-semibold text-azul underline"
              >
                Mostrar todos
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
