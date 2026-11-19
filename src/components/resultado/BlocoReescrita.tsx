"use client";

import { useState } from "react";
import { Bloqueado } from "@/components/freemium/Bloqueado";
import { IconeCheck, IconeCopiar } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";

type Aba = "original" | "reescrita";

/**
 * Bloco "Reescrita" (spec §11.3): original e reescrita lado a lado no desktop; no mobile,
 * empilhado com um alternador. "Copiar reescrita" usa a Clipboard API (ignora se indisponível).
 */
export function BlocoReescrita({
  original,
  reescrita,
  bloqueada,
  aoPedirUpgrade,
}: {
  original: string;
  reescrita: string;
  bloqueada: boolean;
  aoPedirUpgrade: () => void;
}) {
  const [aba, setAba] = useState<Aba>("reescrita");
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(reescrita);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1600);
    } catch {
      /* Clipboard indisponível (ex.: contexto não seguro) — ignora silenciosamente. */
    }
  }

  const conteudo = (
    <div className="grid gap-4 md:grid-cols-2 print:block print:space-y-4">
      <div className={cn("md:block print:block", aba === "reescrita" && "hidden")}>
        <p className="text-slate mb-1.5 text-xs font-semibold tracking-wide uppercase">Original</p>
        <p className="text-navy border-borda/70 rounded-xl border bg-white p-4 text-[15px] leading-relaxed">
          {original}
        </p>
      </div>
      <div className={cn("md:block print:block", aba === "original" && "hidden")}>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-green-800 uppercase">
            Versão seguindo o método
          </p>
          <button
            type="button"
            onClick={copiar}
            className="text-verde inline-flex min-h-[32px] items-center gap-1 text-xs font-semibold hover:text-green-800 print:hidden"
          >
            {copiado ? (
              <>
                <IconeCheck width={14} height={14} />
                Copiado
              </>
            ) : (
              <>
                <IconeCopiar width={14} height={14} />
                Copiar reescrita
              </>
            )}
          </button>
        </div>
        <p className="border-verde bg-verde-claro/50 text-navy rounded-xl border-l-4 p-4 text-[15px] leading-relaxed">
          {reescrita}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Mostrar"
        className="bg-cinza-fundo mb-3 inline-flex rounded-lg p-1 text-sm font-semibold md:hidden print:hidden"
      >
        {(["original", "reescrita"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAba(v)}
            aria-pressed={aba === v}
            className={cn(
              "min-h-[36px] rounded-md px-3",
              aba === v ? "text-azul-escuro bg-white shadow-sm" : "text-slate",
            )}
          >
            {v === "original" ? "Original" : "Reescrita"}
          </button>
        ))}
      </div>

      {bloqueada ? (
        <Bloqueado
          rotulo="No plano grátis você vê a reescrita do parágrafo mais crítico. As demais fazem parte do Plano Fundador."
          aoPedirUpgrade={aoPedirUpgrade}
        >
          {conteudo}
        </Bloqueado>
      ) : (
        conteudo
      )}
      <p className="text-slate mt-2 text-xs">
        Use como guia: mantenha suas ideias e ajuste a estrutura. Não copie dados que você não
        confere.
      </p>
    </div>
  );
}
