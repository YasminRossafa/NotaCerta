"use client";

import Link from "next/link";
import { useState } from "react";
import { Bloqueado } from "@/components/freemium/Bloqueado";
import { CapturaEmail } from "@/components/freemium/CapturaEmail";
import { ModalUpgrade, type MotivoUpgrade } from "@/components/freemium/ModalUpgrade";
import { CartaoRepertorio } from "@/components/repertorios/CartaoRepertorio";
import { AnelDeNota } from "@/components/resultado/AnelDeNota";
import { BarraCompetencia } from "@/components/resultado/BarraCompetencia";
import { CartaoParagrafo } from "@/components/resultado/CartaoParagrafo";
import { Aviso, AvisoNotaEstimada } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { IconeChevron, IconeLivro, IconeSeta } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { CODIGOS_COMPETENCIA } from "@/lib/competencias";
import { planoAtivo } from "@/lib/freemium";
import { calcularGating, indiceParagrafoMaisCritico } from "@/lib/gating";
import { repertorioPorId } from "@/lib/repertorios";
import { lerResultado, type ResultadoSalvo } from "@/lib/resultado-store";
import { useMontado, useSnapshotCliente } from "@/lib/use-cliente";

/**
 * Tela de resultado (spec §11). Mobile: empilhado. Desktop (lg+): lateral sticky
 * (nota + competências + resumo) e coluna principal (parágrafos + repertório).
 */
export function ResultadoView() {
  const montado = useMontado();
  // Snapshot primitivo (string) para não quebrar a hidratação; parse abaixo.
  const raw = useSnapshotCliente(() => {
    const r = lerResultado();
    return r ? JSON.stringify(r) : null;
  }, null);
  const plano = useSnapshotCliente(planoAtivo, "gratis");

  if (!montado) return <EsqueletoResultado />;
  if (!raw) return <ResultadoVazio />;

  const resultado = JSON.parse(raw) as ResultadoSalvo;
  return <Resultado resultado={resultado} plano={plano} />;
}

function Resultado({ resultado, plano }: { resultado: ResultadoSalvo; plano: "gratis" | "fundador" }) {
  const { correcao } = resultado;
  const [modal, setModal] = useState<{ aberto: boolean; motivo: MotivoUpgrade; recurso?: string }>({
    aberto: false,
    motivo: "recurso",
  });
  const gating = calcularGating(correcao, plano);
  const critico = indiceParagrafoMaisCritico(correcao.paragrafos);

  const pedirUpgrade = (recurso: string) => setModal({ aberto: true, motivo: "recurso", recurso });

  const repertorios = correcao.repertorioSugestoes
    .map((s) => ({ item: repertorioPorId(s.id), porqueCombina: s.porqueCombina }))
    .filter((r): r is { item: NonNullable<typeof r.item>; porqueCombina: string } => Boolean(r.item));

  return (
    <div className="container-nc py-8 md:py-12">
      {/* 1. Cabeçalho do resultado */}
      <header className="card flex flex-col items-center gap-6 p-6 text-center sm:p-8 lg:flex-row lg:text-left">
        <AnelDeNota nota={correcao.notaTotal} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="rounded-full border border-borda bg-azul-claro px-3 py-1 text-xs font-semibold text-azul-escuro">
              Nota estimada
            </span>
            {correcao.temaDetectado && (
              <span className="rounded-full bg-cinza-fundo px-3 py-1 text-xs font-semibold text-slate">
                Tema detectado pelo texto
              </span>
            )}
            {resultado.origem === "imagem" && (
              <span className="rounded-full bg-cinza-fundo px-3 py-1 text-xs font-semibold text-slate">
                Transcrita da foto
              </span>
            )}
          </div>
          <p className="mt-3 text-xs font-semibold tracking-wide text-slate uppercase">Tema</p>
          <h1 className="font-serif text-2xl leading-tight font-semibold text-navy sm:text-3xl">
            {correcao.tema}
          </h1>
          {!correcao.completa && (
            <Aviso tom="atencao" className="mt-4 text-left" compacto>
              A redação parece <strong>incompleta</strong> (faltam parágrafos ou a leitura falhou).
              Por isso não estimamos a nota total. Corrigimos o que foi possível.
            </Aviso>
          )}
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Lateral (sticky no desktop): competências + resumo do professor */}
        <aside className="space-y-6 lg:sticky lg:top-20">
          <section className="card p-5" aria-labelledby="competencias-titulo">
            <h2 id="competencias-titulo" className="font-serif text-lg font-semibold text-navy">
              Competências
            </h2>
            <div className="mt-4 space-y-4">
              {CODIGOS_COMPETENCIA.map((c) => (
                <BarraCompetencia
                  key={c}
                  codigo={c}
                  nota={correcao.competencias[c].nota}
                  justificativa={correcao.competencias[c].justificativa}
                />
              ))}
            </div>
          </section>

          <ResumoProfessor texto={correcao.resumoProfessor} className="hidden lg:block" />
        </aside>

        {/* Principal */}
        <div className="space-y-6">
          {correcao.transcricao && (
            <details className="card group p-5">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 font-semibold text-navy">
                Ver a transcrição da foto
                <IconeChevron className="transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm whitespace-pre-line text-slate">{correcao.transcricao}</p>
              <p className="mt-2 text-xs text-slate">
                Transcrevemos sem corrigir a ortografia; os erros aparecem nos apontamentos.
              </p>
            </details>
          )}

          {/* 3. Parágrafo a parágrafo */}
          <section aria-labelledby="paragrafos-titulo" className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <h2 id="paragrafos-titulo" className="font-serif text-2xl font-semibold text-navy">
                Parágrafo a parágrafo
              </h2>
              <p className="text-xs text-slate">Trecho → problema → motivo</p>
            </div>
            {correcao.paragrafos.map((p, i) => (
              <CartaoParagrafo
                key={`${p.tipo}-${i}`}
                paragrafo={p}
                numero={i + 1}
                reescritaBloqueada={!gating.reescritaLiberada(i)}
                aoPedirUpgrade={() => pedirUpgrade("Todas as reescritas")}
                abertoInicialmente={i === critico}
              />
            ))}
          </section>

          {/* 4. Repertório sugerido */}
          <section aria-labelledby="repertorio-titulo" className="space-y-4">
            <div>
              <h2 id="repertorio-titulo" className="flex items-center gap-2 font-serif text-2xl font-semibold text-navy">
                <IconeLivro className="text-azul" />
                Repertório para este tema
              </h2>
              <p className="mt-1 text-sm text-slate">
                Do nosso acervo curado, nunca inventado. Cada um diz por que combina com o tema.
              </p>
            </div>
            {repertorios.length === 0 ? (
              <div className="card p-5 text-sm text-slate">
                Não encontramos um repertório do acervo para este tema.{" "}
                <Link href="/repertorios" className="font-semibold text-azul underline">
                  Explore o acervo completo.
                </Link>
              </div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {repertorios.map((r, i) => (
                  <li key={r.item.id}>
                    {gating.repertorioLiberado(i) ? (
                      <CartaoRepertorio item={r.item} porqueCombina={r.porqueCombina} linkAcervo />
                    ) : (
                      <Bloqueado
                        rotulo="Repertório completo por tema é do Plano Fundador."
                        aoPedirUpgrade={() => pedirUpgrade("Repertório completo por tema")}
                        className="h-full"
                      >
                        <CartaoRepertorio item={r.item} porqueCombina={r.porqueCombina} />
                      </Bloqueado>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 5. Resumo do professor (no mobile fica aqui, na ordem do spec) */}
          <ResumoProfessor texto={correcao.resumoProfessor} className="lg:hidden" />

          {/* Captura de e-mail (spec §13) */}
          <section className="card bg-azul-claro p-5 sm:p-6">
            <CapturaEmail
              origem="resultado"
              titulo="Salve esta correção e receba as melhorias"
              texto="Enviamos a correção por e-mail e avisamos quando o histórico e o plano Fundador abrirem."
              rotuloBotao="Salvar correção"
            />
          </section>

          {/* 6. CTA contextual */}
          <section className="flex flex-col items-start gap-4 rounded-2xl border border-borda p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-navy">Quer corrigir outra redação?</p>
              <p className="text-sm text-slate">
                O plano grátis libera 1 por dia. Para corrigir sem limite, conheça o Plano Fundador.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Botao href="/corrigir" variante="secundario">
                Corrigir outra redação
                <IconeSeta />
              </Botao>
              <Botao onClick={() => pedirUpgrade("Correções ilimitadas")}>Plano Fundador</Botao>
            </div>
          </section>

          <AvisoNotaEstimada />
        </div>
      </div>

      <ModalUpgrade
        aberto={modal.aberto}
        motivo={modal.motivo}
        recurso={modal.recurso}
        aoFechar={() => setModal((m) => ({ ...m, aberto: false }))}
      />
    </div>
  );
}

function ResumoProfessor({ texto, className }: { texto: string; className?: string }) {
  return (
    <section className={cn("card border-l-4 border-l-azul p-5", className)} aria-labelledby="resumo-titulo">
      <h2 id="resumo-titulo" className="font-serif text-lg font-semibold text-navy">
        Resumo do professor
      </h2>
      <p className="mt-2 text-[15.5px] leading-relaxed text-navy">{texto}</p>
    </section>
  );
}

function ResultadoVazio() {
  return (
    <div className="container-nc py-16">
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="font-serif text-2xl font-semibold text-navy">Nenhuma correção para mostrar</p>
        <p className="mt-2 text-slate">
          O resultado fica disponível só nesta aba, logo após a correção. Envie uma redação para
          ver o feedback completo.
        </p>
        <Botao href="/corrigir" className="mt-6" tamanho="lg">
          Corrigir uma redação
          <IconeSeta />
        </Botao>
      </div>
    </div>
  );
}

function EsqueletoResultado() {
  return (
    <div className="container-nc py-8 md:py-12" aria-busy="true" aria-label="Carregando resultado">
      <div className="card h-40 nc-pulse bg-cinza-fundo" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="card h-80 nc-pulse bg-cinza-fundo" />
        <div className="space-y-4">
          <div className="card h-56 nc-pulse bg-cinza-fundo" />
          <div className="card h-56 nc-pulse bg-cinza-fundo" />
        </div>
      </div>
    </div>
  );
}
