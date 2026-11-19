"use client";

import { useId, useState } from "react";
import { segmentarTexto } from "@/components/resultado/TextoDestacado";
import { cn } from "@/lib/cn";
import { COMPETENCIAS } from "@/lib/competencias";
import { EXEMPLO_CORRECAO } from "@/lib/exemplo-correcao";
import { ROTULO_PARAGRAFO } from "@/lib/schema";

/**
 * Exemplo interativo da home: um parágrafo real da correção de exemplo. Os trechos
 * apontados ficam sublinhados em vermelho e o que já está dentro do modelo, em
 * verde; clicar, focar ou passar o mouse troca o painel ao lado com o motivo.
 *
 * Usa a mesma fixture e o mesmo segmentador da tela de resultado — nada aqui é
 * inventado para a vitrine.
 */

const PARAGRAFO =
  EXEMPLO_CORRECAO.paragrafos.find((p) => p.tipo === "conclusao") ??
  EXEMPLO_CORRECAO.paragrafos[0];

type Nota = { codigo: string; titulo: string; texto: string; tom: "erro" | "ok" };

const NOTAS: Nota[] = PARAGRAFO.apontamentos.map((a) => ({
  codigo: `${COMPETENCIAS[a.competencia].sigla} · ${COMPETENCIAS[a.competencia].nome}`,
  titulo: a.problema,
  texto: a.motivo,
  tom: "erro",
}));

/** Fecha o exemplo com o que o parágrafo já acerta, tirado do checklist do modelo. */
const ACERTO = PARAGRAFO.checklistModelo.find((i) => i.ok);

export function DemoCorrecao() {
  const idBase = useId();
  const [ativo, setAtivo] = useState(0);
  const segmentos = segmentarTexto(PARAGRAFO.textoOriginal, PARAGRAFO.apontamentos);

  const notaAcerto: Nota | null = ACERTO
    ? {
        codigo: "Dentro do modelo",
        titulo: ACERTO.item,
        texto:
          "Este item do modelo já está cumprido no parágrafo. Nada a ajustar aqui — o corretor marca como adequado.",
        tom: "ok",
      }
    : null;
  const todas = notaAcerto ? [...NOTAS, notaAcerto] : NOTAS;
  const nota = todas[ativo] ?? todas[0];

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Texto do aluno */}
      <div className="bg-superficie border-borda rounded-[20px] border p-6 text-[17px] leading-[2.05] shadow-[var(--shadow-3)] sm:p-7">
        <span className="bg-azul-claro text-azul-escuro mb-2.5 inline-block rounded-full px-2.5 py-1 text-xs font-extrabold tracking-[0.06em] uppercase">
          {ROTULO_PARAGRAFO[PARAGRAFO.tipo]}
        </span>
        <p className="text-navy">
          {segmentos.map((s, i) => {
            if (s.indice == null) return <span key={i}>{s.texto}</span>;
            const indice = s.indice;
            return (
              <mark
                key={i}
                className="nc-trecho bg-transparent text-inherit"
                data-tom="erro"
                data-ativo={ativo === indice ? "true" : "false"}
                tabIndex={0}
                role="button"
                aria-pressed={ativo === indice}
                aria-describedby={`${idBase}-painel`}
                aria-label={`Trecho ${indice + 1}: ${PARAGRAFO.apontamentos[indice].problema}`}
                onClick={() => setAtivo(indice)}
                onMouseEnter={() => setAtivo(indice)}
                onFocus={() => setAtivo(indice)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setAtivo(indice);
                  }
                }}
              >
                {s.texto}
              </mark>
            );
          })}
        </p>
        {notaAcerto && (
          <p className="text-navy mt-4 text-[15px] leading-relaxed">
            <button
              type="button"
              className="nc-trecho bg-transparent text-left font-medium"
              data-tom="ok"
              data-ativo={ativo === todas.length - 1 ? "true" : "false"}
              aria-pressed={ativo === todas.length - 1}
              aria-describedby={`${idBase}-painel`}
              onClick={() => setAtivo(todas.length - 1)}
              onMouseEnter={() => setAtivo(todas.length - 1)}
              onFocus={() => setAtivo(todas.length - 1)}
            >
              {ACERTO?.item}
            </button>{" "}
            <span className="text-slate">— o que este parágrafo já faz certo.</span>
          </p>
        )}
        <p className="text-slate mt-3.5 text-sm leading-normal">
          Trecho de exemplo, corrigido pelo método.
        </p>
      </div>

      {/* Painel do motivo */}
      <aside
        id={`${idBase}-painel`}
        aria-live="polite"
        className="rounded-[20px] border border-white/12 bg-white/[0.07] p-6 backdrop-blur-lg lg:sticky lg:top-[100px] lg:min-h-[260px]"
      >
        {/* key força a entrada a cada troca de apontamento. */}
        <div key={ativo} className="animate-[nc-surgir_.4s_ease-out]">
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-1 text-xs font-extrabold",
              nota.tom === "ok" ? "bg-[#4ADE80] text-[#06281A]" : "bg-ambar text-navy-fixo",
            )}
          >
            {nota.codigo}
          </span>
          <h3 className="mt-3.5 text-[21px] text-white">{nota.titulo}</h3>
          <p className="mt-2.5 text-[#C9D4F2]">{nota.texto}</p>
          {nota.tom === "erro" && PARAGRAFO.reescrita && (
            <p className="mt-4 rounded-xl bg-[rgb(22_163_74/.16)] px-3.5 py-3 text-[15px] font-semibold text-[#BFF3D2]">
              Na correção completa, este parágrafo vem reescrito do jeito certo.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {todas.map((n, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={ativo === i}
              aria-label={`Apontamento ${i + 1}: ${n.titulo}`}
              onClick={() => setAtivo(i)}
              className={cn(
                "min-h-[44px] min-w-[44px] rounded-full border px-3 text-xs font-bold transition-colors",
                ativo === i
                  ? "border-transparent bg-white text-[#0B1220]"
                  : "border-white/25 text-white/75 hover:border-white/60 hover:text-white",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
