"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";
import { CheckDesenhado } from "@/components/motion/CheckDesenhado";
import { segmentarTexto } from "@/components/resultado/TextoDestacado";
import { IconeSeta } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { COMPETENCIAS } from "@/lib/competencias";
import { EXEMPLO_CORRECAO } from "@/lib/exemplo-correcao";
import { ROTULO_PARAGRAFO } from "@/lib/schema";

/**
 * Demonstração interativa na home (spec §18.1): um parágrafo real da correção de exemplo,
 * com os trechos apontados marcados a caneta. Passar o mouse ou tocar abre o motivo — é o
 * diferencial do produto (o "por quê", não só o "errado") mostrado antes do cadastro.
 *
 * Usa a mesma fixture e o mesmo segmentador da tela de resultado: nada inventado aqui.
 */
export function DemoCorrecao() {
  // A conclusão é o parágrafo mais didático: tem agente genérico, detalhamento curto e crase.
  const paragrafo =
    EXEMPLO_CORRECAO.paragrafos.find((p) => p.tipo === "conclusao") ??
    EXEMPLO_CORRECAO.paragrafos[0];
  const apontamentos = paragrafo.apontamentos;

  const idBase = useId();
  const [ativo, setAtivo] = useState<number | null>(0);
  const [fixado, setFixado] = useState<number | null>(null);
  const reduzido = useReducedMotion();

  const mostrado = fixado ?? ativo;
  const apontamento = mostrado == null ? null : apontamentos[mostrado];
  const segmentos = segmentarTexto(paragrafo.textoOriginal, apontamentos);

  return (
    <div className="card overflow-hidden">
      <div className="border-borda/70 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-7">
        <div>
          <p className="text-navy text-lg font-bold tracking-tight">
            {ROTULO_PARAGRAFO[paragrafo.tipo]} de uma redação real
          </p>
          <p className="text-slate mt-0.5 text-sm">
            Toque num trecho marcado para ver o motivo do apontamento.
          </p>
        </div>
        <span className="bg-ambar-claro text-ambar-texto rounded-full px-3 py-1 text-xs font-bold">
          {apontamentos.length} apontamentos
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* Texto do aluno, com as marcas de caneta */}
        <div className="p-5 sm:p-7">
          <p className="text-navy text-[15.5px] leading-[1.95] sm:text-base">
            {segmentos.map((s, i) => {
              if (s.indice == null) return <span key={i}>{s.texto}</span>;
              const indice = s.indice;
              const selecionado = mostrado === indice;
              return (
                <mark
                  key={i}
                  className="nc-destaque"
                  data-ativo={selecionado ? "true" : "false"}
                  tabIndex={0}
                  role="button"
                  aria-pressed={fixado === indice}
                  aria-describedby={`${idBase}-motivo`}
                  aria-label={`Trecho ${indice + 1}: ${apontamentos[indice].problema}`}
                  onMouseEnter={() => setAtivo(indice)}
                  onFocus={() => setAtivo(indice)}
                  onClick={() => setFixado(fixado === indice ? null : indice)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFixado(fixado === indice ? null : indice);
                    }
                  }}
                >
                  {s.texto}
                  <sup className="text-ambar-texto ml-0.5 text-[10px] font-bold">{indice + 1}</sup>
                </mark>
              );
            })}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {apontamentos.map((a, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={mostrado === i}
                onClick={() => setFixado(fixado === i ? null : i)}
                onMouseEnter={() => setAtivo(i)}
                className={cn(
                  "min-h-[44px] rounded-full border px-3 text-xs font-bold transition-colors",
                  mostrado === i
                    ? "border-azul bg-azul text-white"
                    : "border-borda text-slate hover:text-navy hover:border-azul/60",
                )}
              >
                {i + 1}. {COMPETENCIAS[a.competencia].sigla}
              </button>
            ))}
          </div>
        </div>

        {/* O motivo — o que o NotaCerta faz de diferente */}
        <div className="bg-cinza-fundo border-borda/70 border-t p-5 sm:p-7 lg:border-t-0 lg:border-l">
          <AnimatePresence mode="wait" initial={false}>
            {apontamento ? (
              <motion.div
                key={mostrado}
                initial={reduzido ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduzido ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="bg-azul-claro text-azul-escuro inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold">
                  {COMPETENCIAS[apontamento.competencia].sigla} ·{" "}
                  {COMPETENCIAS[apontamento.competencia].nome}
                </span>
                <p className="text-navy mt-3 font-bold">{apontamento.problema}</p>
                <p className="text-slate mt-2 text-sm leading-relaxed" id={`${idBase}-motivo`}>
                  <strong className="text-navy font-bold">Por quê:</strong> {apontamento.motivo}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="vazio"
                initial={reduzido ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate text-sm"
              >
                Passe o mouse num trecho marcado.
              </motion.p>
            )}
          </AnimatePresence>

          {paragrafo.reescrita && (
            <div className="border-borda mt-5 border-t pt-5">
              <p className="text-verde-texto flex items-center gap-2 text-sm font-bold">
                <CheckDesenhado tamanho={18} espessura={3} />E a reescrita que ensina
              </p>
              <p className="text-navy mt-2 line-clamp-3 text-sm leading-relaxed">
                {paragrafo.reescrita}
              </p>
            </div>
          )}

          <Link
            href="/resultado?exemplo=1"
            className="text-azul hover:text-azul-escuro group mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold"
          >
            Ver a correção de exemplo completa
            <IconeSeta
              width={16}
              height={16}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
