"use client";

import { useId, useState } from "react";
import { Bloqueado } from "@/components/freemium/Bloqueado";
import { TextoDestacado } from "@/components/resultado/TextoDestacado";
import { IconeCaneta, IconeCheck, IconeChevron, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { COMPETENCIAS } from "@/lib/competencias";
import { ROTULO_PARAGRAFO, type Paragrafo, type StatusParagrafo } from "@/lib/schema";

const STATUS: Record<StatusParagrafo, { rotulo: string; classes: string; ponto: string }> = {
  adequado: { rotulo: "Adequado", classes: "bg-verde-claro text-green-800", ponto: "bg-verde" },
  ajustes: {
    rotulo: "Precisa de ajustes",
    classes: "bg-ambar-claro text-amber-800",
    ponto: "bg-ambar",
  },
  incompleto: {
    rotulo: "Incompleto",
    classes: "bg-vermelho-claro text-red-800",
    ponto: "bg-vermelho",
  },
};

/**
 * Cartão de um parágrafo (spec §11.3): status, texto com destaques, apontamentos com motivo,
 * reescrita colapsável (bloqueável no grátis) e checklist do modelo.
 */
export function CartaoParagrafo({
  paragrafo,
  numero,
  reescritaBloqueada,
  aoPedirUpgrade,
  abertoInicialmente,
}: {
  paragrafo: Paragrafo;
  numero: number;
  reescritaBloqueada: boolean;
  aoPedirUpgrade: () => void;
  abertoInicialmente?: boolean;
}) {
  const idBase = useId();
  const [ativo, setAtivo] = useState<number | null>(null);
  const [reescritaAberta, setReescritaAberta] = useState(Boolean(abertoInicialmente));
  const st = STATUS[paragrafo.status];
  const temReescrita = Boolean(paragrafo.reescrita);
  const itensOk = paragrafo.checklistModelo.filter((i) => i.ok).length;

  return (
    <article className="card overflow-hidden" aria-labelledby={`${idBase}-titulo`}>
      {/* Cabeçalho */}
      <header className="border-borda/60 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="bg-navy flex h-8 w-8 items-center justify-center rounded-lg font-serif text-sm font-semibold text-white">
            {numero}
          </span>
          <h3 id={`${idBase}-titulo`} className="text-navy font-serif text-xl font-semibold">
            {ROTULO_PARAGRAFO[paragrafo.tipo]}
          </h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            st.classes,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", st.ponto)} aria-hidden="true" />
          {st.rotulo}
        </span>
      </header>

      <div className="space-y-5 px-5 py-5">
        {/* Texto original com destaques */}
        <section aria-label="Texto original">
          <p className="text-slate mb-2 text-xs font-semibold tracking-wide uppercase">
            Seu texto
            {paragrafo.apontamentos.length > 0 && (
              <span className="ml-2 font-normal normal-case">
                · passe o dedo ou o mouse nos trechos marcados
              </span>
            )}
          </p>
          {paragrafo.textoOriginal ? (
            <TextoDestacado
              texto={paragrafo.textoOriginal}
              apontamentos={paragrafo.apontamentos}
              ativo={ativo}
              aoFocar={setAtivo}
              idBase={idBase}
            />
          ) : (
            <p className="text-slate text-sm italic">Parágrafo não encontrado na redação.</p>
          )}
        </section>

        {/* Apontamentos */}
        {paragrafo.apontamentos.length > 0 ? (
          <section aria-label="Apontamentos">
            <p className="text-slate mb-2 text-xs font-semibold tracking-wide uppercase">
              {paragrafo.apontamentos.length === 1
                ? "1 apontamento"
                : `${paragrafo.apontamentos.length} apontamentos`}
            </p>
            <ol className="space-y-3">
              {paragrafo.apontamentos.map((a, i) => {
                const comp = COMPETENCIAS[a.competencia];
                return (
                  <li
                    key={i}
                    id={`${idBase}-ap-${i}`}
                    onMouseEnter={() => setAtivo(i)}
                    onMouseLeave={() => setAtivo(null)}
                    className={cn(
                      "rounded-xl border p-4 transition-colors",
                      ativo === i ? "border-ambar bg-ambar-claro/40" : "border-borda/70 bg-white",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-navy text-sm">
                        <span className="bg-ambar-claro mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-amber-800">
                          {i + 1}
                        </span>
                        <q className="font-medium">{a.trecho}</q>
                      </p>
                      <span
                        className="bg-cinza-fundo text-slate shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold"
                        title={comp.nome}
                      >
                        {comp.sigla}
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
                );
              })}
            </ol>
          </section>
        ) : (
          paragrafo.status === "adequado" && (
            <p className="bg-verde-claro flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-green-900">
              <IconeCheck width={18} height={18} />
              Dentro do modelo. Nada a apontar aqui.
            </p>
          )
        )}

        {/* Reescrita */}
        {temReescrita && (
          <section aria-label="Reescrita">
            <button
              type="button"
              onClick={() => setReescritaAberta((v) => !v)}
              aria-expanded={reescritaAberta}
              aria-controls={`${idBase}-reescrita`}
              className="border-azul/30 bg-azul-claro text-azul-escuro hover:bg-azul-claro/70 flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border px-4 text-left text-sm font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <IconeCaneta width={18} height={18} />
                Ver como ficaria melhor
              </span>
              <IconeChevron
                width={18}
                height={18}
                className={cn("transition-transform", reescritaAberta && "rotate-180")}
              />
            </button>
            <div id={`${idBase}-reescrita`} hidden={!reescritaAberta} className="mt-3">
              {reescritaBloqueada ? (
                <Bloqueado
                  rotulo="No plano grátis você vê a reescrita do parágrafo mais crítico. As demais fazem parte do Plano Fundador."
                  aoPedirUpgrade={aoPedirUpgrade}
                >
                  <ReescritaTexto texto={paragrafo.reescrita!} />
                </Bloqueado>
              ) : (
                <ReescritaTexto texto={paragrafo.reescrita!} />
              )}
            </div>
          </section>
        )}

        {/* Checklist do modelo */}
        {paragrafo.checklistModelo.length > 0 && (
          <section aria-label="Checklist do modelo" className="bg-cinza-fundo rounded-xl p-4">
            <p className="text-slate mb-2 flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
              Checklist do modelo
              <span className="font-normal normal-case">
                {itensOk}/{paragrafo.checklistModelo.length}
              </span>
            </p>
            <ul className="space-y-1.5">
              {paragrafo.checklistModelo.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      item.ok ? "bg-verde text-white" : "bg-vermelho-claro text-vermelho",
                    )}
                    aria-label={item.ok ? "Atende" : "Não atende"}
                    role="img"
                  >
                    {item.ok ? (
                      <IconeCheck width={13} height={13} />
                    ) : (
                      <IconeX width={13} height={13} />
                    )}
                  </span>
                  <span className={item.ok ? "text-slate" : "text-navy"}>
                    {item.item}
                    {!item.ok && item.observacao && (
                      <span className="text-slate block text-xs">{item.observacao}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}

function ReescritaTexto({ texto }: { texto: string }) {
  return (
    <div className="border-verde bg-verde-claro/50 rounded-xl border-l-4 px-4 py-3">
      <p className="mb-1 text-xs font-semibold tracking-wide text-green-800 uppercase">
        Versão seguindo o método
      </p>
      <p className="text-navy text-[15.5px] leading-[1.75] sm:text-base">{texto}</p>
      <p className="text-slate mt-2 text-xs">
        Use como guia: mantenha suas ideias e ajuste a estrutura. Não copie dados que você não
        confere.
      </p>
    </div>
  );
}
