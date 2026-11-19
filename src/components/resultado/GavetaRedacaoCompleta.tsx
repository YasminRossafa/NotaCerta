"use client";

import { useEffect, useRef, useState } from "react";
import { Bloqueado } from "@/components/freemium/Bloqueado";
import { TextoDestacado } from "@/components/resultado/TextoDestacado";
import { IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import type { Gating } from "@/lib/gating";
import { ROTULO_PARAGRAFO, type Correcao } from "@/lib/schema";

type Modo = "original" | "reescrita";

/**
 * "Ver redação completa" (spec §11): os 4 parágrafos em ordem, com destaques, numa visão de
 * leitura; alterna para a reescrita completa (respeitando o gating do plano grátis).
 */
export function GavetaRedacaoCompleta({
  aberta,
  aoFechar,
  correcao,
  gating,
  aoPedirUpgrade,
}: {
  aberta: boolean;
  aoFechar: () => void;
  correcao: Correcao;
  gating: Gating;
  aoPedirUpgrade: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [modo, setModo] = useState<Modo>("original");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (aberta && !el.open) el.showModal();
    if (!aberta && el.open) el.close();
  }, [aberta]);

  return (
    <dialog
      ref={ref}
      aria-label="Redação completa"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
      className="border-borda text-navy backdrop:bg-navy-fixo/70 m-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl border bg-superficie p-0 shadow-xl backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[85vh] flex-col">
        <header className="border-borda/60 flex items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <h2 className="text-navy text-xl font-semibold">Redação completa</h2>
            <p className="text-slate truncate text-sm">{correcao.tema}</p>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="text-slate hover:bg-cinza-fundo -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            <IconeX />
          </button>
        </header>

        <div className="border-borda/60 border-b px-5 py-3">
          <div
            role="group"
            aria-label="Versão"
            className="bg-cinza-fundo inline-flex rounded-lg p-1 text-sm font-semibold"
          >
            {(["original", "reescrita"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setModo(v)}
                aria-pressed={modo === v}
                className={cn(
                  "min-h-[36px] rounded-md px-3",
                  modo === v ? "text-azul-escuro bg-superficie shadow-sm" : "text-slate",
                )}
              >
                {v === "original" ? "Original com apontamentos" : "Reescrita completa"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          {correcao.paragrafos.map((p, i) => (
            <section key={`${p.tipo}-${i}`}>
              <h3 className="text-navy mb-2 text-sm font-semibold tracking-wide uppercase">
                {ROTULO_PARAGRAFO[p.tipo]}
              </h3>
              {modo === "original" || !p.reescrita ? (
                <TextoDestacado
                  texto={p.textoOriginal}
                  apontamentos={p.apontamentos}
                  ativo={null}
                  aoFocar={() => {}}
                  idBase={`gaveta-${i}`}
                />
              ) : gating.reescritaLiberada(i) ? (
                <p className="text-navy text-[15px] leading-relaxed">{p.reescrita}</p>
              ) : (
                <Bloqueado
                  rotulo="Reescrita completa é do Plano Fundador."
                  aoPedirUpgrade={aoPedirUpgrade}
                >
                  <p className="text-navy text-[15px] leading-relaxed">{p.reescrita}</p>
                </Bloqueado>
              )}
            </section>
          ))}
        </div>
      </div>
    </dialog>
  );
}
