"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { corDoRotulo, legendaDoTipo, type Exemplo } from "@/lib/estrutura";
import { ROTULO_PARAGRAFO } from "@/lib/schema";

/**
 * Redação-modelo com cada parte colorida pelo rótulo, legenda interativa e seletor
 * de tema (spec §8.7 e §18.2).
 *
 * Passar o mouse (ou focar) num item da legenda já realça as partes daquele rótulo
 * e apaga o resto; clicar fixa o realce, para quem usa toque ou quer ler com calma.
 * A troca de tema faz o texto desaparecer e voltar suavemente.
 */
export function ExemploDestacado({ exemplos }: { exemplos: Exemplo[] }) {
  const [idx, setIdx] = useState(0);
  const [fixado, setFixado] = useState<string | null>(null);
  const [sobrevoado, setSobrevoado] = useState<string | null>(null);
  const seletorId = useId();
  const exemplo = exemplos[idx];

  // O que está fixado manda; o mouse só pré-visualiza.
  const rotuloAtivo = fixado ?? sobrevoado;

  return (
    <div className="space-y-5">
      {exemplos.length > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor={seletorId} className="text-navy text-sm font-bold">
            Tema do exemplo
          </label>
          <select
            id={seletorId}
            value={idx}
            onChange={(e) => {
              setIdx(Number(e.target.value));
              setFixado(null);
              setSobrevoado(null);
            }}
            className="border-borda bg-superficie text-navy focus:border-azul min-h-[44px] w-full rounded-full border px-4 text-base transition-colors focus:outline-none sm:max-w-xl"
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
        <div className="bg-navy-fixo px-5 py-4 text-white sm:px-7">
          <p className="text-xs font-bold tracking-wide text-white/70 uppercase">Tema</p>
          <p className="text-xl leading-snug font-extrabold sm:text-2xl">{exemplo.tema}</p>
        </div>

        {exemplo.rascunho && (
          <p className="bg-ambar-claro text-ambar-texto px-5 py-2.5 text-xs sm:px-7">
            Exemplo escrito pelo NotaCerta seguindo o método — ainda não revisado pela professora.
          </p>
        )}

        {/* key por exemplo: ao trocar de tema, o conteúdo entra de novo em vez de piscar. */}
        <div key={exemplo.id} className="divide-borda animate-[nc-surgir_.35s_ease-out] divide-y">
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
                  <p className="text-slate mb-2 text-xs font-bold tracking-wide uppercase">
                    {i + 1}. {ROTULO_PARAGRAFO[p.tipo]}
                  </p>
                  <p className="text-navy text-[15.5px] leading-[1.9] sm:text-base">
                    {p.partes.map((parte, j) => {
                      const cor = corDoRotulo(parte.rotulo);
                      const apagado = rotuloAtivo !== null && rotuloAtivo !== parte.rotulo;
                      const realcado = rotuloAtivo === parte.rotulo;
                      return (
                        <span key={j}>
                          <span
                            className={cn(
                              "rounded-[4px] border-b-2 px-1 py-0.5",
                              "transition-[opacity,box-shadow,transform] duration-200",
                              cor.fundo,
                              cor.texto,
                              cor.borda,
                              apagado && "opacity-25",
                              realcado &&
                                "shadow-[0_6px_14px_-6px_rgb(11_18_32/.45)] ring-2 ring-current/30",
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
                  <p className="text-slate mb-2 text-xs font-bold tracking-wide uppercase">
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
                            aria-pressed={fixado === r}
                            onClick={() => setFixado(fixado === r ? null : r)}
                            onMouseEnter={() => setSobrevoado(r)}
                            onMouseLeave={() => setSobrevoado(null)}
                            onFocus={() => setSobrevoado(r)}
                            onBlur={() => setSobrevoado(null)}
                            className={cn(
                              "flex min-h-[44px] w-full items-center gap-2 rounded-xl px-2 text-left text-sm transition-colors",
                              ativo ? "bg-azul-claro text-azul-escuro" : "hover:bg-cinza-fundo",
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
                            <span className={ativo ? "font-bold" : "text-navy"}>{r}</span>
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

        {fixado && (
          <div className="border-borda border-t px-5 py-3 sm:px-7">
            <button
              type="button"
              onClick={() => setFixado(null)}
              className="text-azul inline-flex min-h-[44px] items-center text-xs font-bold underline"
            >
              Mostrar todos os rótulos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
