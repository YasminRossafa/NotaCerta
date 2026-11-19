"use client";

import { useEffect, useId, useState } from "react";
import { ApontamentosAgrupados } from "@/components/resultado/ApontamentosAgrupados";
import { BlocoColapsavel } from "@/components/resultado/BlocoColapsavel";
import { BlocoReescrita } from "@/components/resultado/BlocoReescrita";
import { ChecklistModelo } from "@/components/resultado/ChecklistModelo";
import { TextoDestacado } from "@/components/resultado/TextoDestacado";
import { cn } from "@/lib/cn";
import type { CodigoCompetencia } from "@/lib/competencias";
import { ROTULO_PARAGRAFO, type Paragrafo } from "@/lib/schema";
import { CLASSES_CHIP_STATUS, ROTULO_STATUS } from "@/lib/status-paragrafo";

type FiltroCompetencia = CodigoCompetencia | "todas";

/**
 * Painel de um parágrafo (spec §11.3): 4 blocos separados e colapsáveis — "Seu texto",
 * "O que ajustar", "Checklist do modelo" e "Reescrita". Clicar num trecho destacado no bloco
 * (a) mostra todos os apontamentos (limpa o filtro) e rola/pisca até o cartão correspondente
 * no bloco (b).
 */
export function PainelParagrafo({
  paragrafo,
  reescritaBloqueada,
  aoPedirUpgrade,
  abertoInicialmente,
}: {
  paragrafo: Paragrafo;
  reescritaBloqueada: boolean;
  aoPedirUpgrade: () => void;
  abertoInicialmente?: boolean;
}) {
  const idBase = useId();
  const [destacado, setDestacado] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<FiltroCompetencia>("todas");
  const [foco, setFoco] = useState<{ indice: number; n: number } | null>(null);

  useEffect(() => {
    if (!foco) return;
    const el = document.getElementById(`${idBase}-ap-${foco.indice}`);
    if (!el) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "center" });
    el.classList.add("nc-flash");
    const t = window.setTimeout(() => el.classList.remove("nc-flash"), 900);
    return () => window.clearTimeout(t);
  }, [foco, idBase]);

  function aoClicarTrecho(indice: number) {
    setFiltro("todas");
    setFoco((f) => ({ indice, n: (f?.n ?? 0) + 1 }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-navy text-xl font-semibold">{ROTULO_PARAGRAFO[paragrafo.tipo]}</h3>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            CLASSES_CHIP_STATUS[paragrafo.status],
          )}
        >
          {ROTULO_STATUS[paragrafo.status]}
        </span>
      </div>

      <BlocoColapsavel titulo="Seu texto">
        {paragrafo.textoOriginal ? (
          <TextoDestacado
            texto={paragrafo.textoOriginal}
            apontamentos={paragrafo.apontamentos}
            ativo={destacado}
            aoFocar={setDestacado}
            aoClicar={aoClicarTrecho}
            idBase={idBase}
          />
        ) : (
          <p className="text-slate text-sm italic">Parágrafo não encontrado na redação.</p>
        )}
        {paragrafo.apontamentos.length > 0 && (
          <p className="text-slate mt-2 text-xs">
            Passe o dedo ou o mouse, ou clique num trecho marcado para ver o apontamento completo.
          </p>
        )}
      </BlocoColapsavel>

      <BlocoColapsavel titulo="O que ajustar">
        <ApontamentosAgrupados
          apontamentos={paragrafo.apontamentos}
          idBase={idBase}
          ativo={destacado}
          aoFocar={setDestacado}
          filtro={filtro}
          aoFiltrar={setFiltro}
        />
      </BlocoColapsavel>

      <BlocoColapsavel titulo="Checklist do modelo" abertoInicialmente={false}>
        <ChecklistModelo itens={paragrafo.checklistModelo} />
      </BlocoColapsavel>

      {paragrafo.reescrita && (
        <BlocoColapsavel titulo="Reescrita" abertoInicialmente={Boolean(abertoInicialmente)}>
          <BlocoReescrita
            original={paragrafo.textoOriginal}
            reescrita={paragrafo.reescrita}
            bloqueada={reescritaBloqueada}
            aoPedirUpgrade={aoPedirUpgrade}
          />
        </BlocoColapsavel>
      )}
    </div>
  );
}
