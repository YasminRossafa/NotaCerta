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
import { EXEMPLO_CORRECAO } from "@/lib/exemplo-correcao";
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
  // `?exemplo=1` mostra uma correção de demonstração (sem chamar a API).
  const raw = useSnapshotCliente(() => {
    if (new URLSearchParams(window.location.search).has("exemplo")) {
      return JSON.stringify({ correcao: EXEMPLO_CORRECAO, origem: "texto", em: "", exemplo: true });
    }
    const r = lerResultado();
    return r ? JSON.stringify(r) : null;
  }, null);
  const plano = useSnapshotCliente(planoAtivo, "gratis");

  if (!montado) return <EsqueletoResultado />;
  if (!raw) return <ResultadoVazio />;

  const resultado = JSON.parse(raw) as ResultadoSalvo & { exemplo?: boolean };
  return <Resultado resultado={resultado} plano={plano} exemplo={Boolean(resultado.exemplo)} />;
}

function Resultado({
  resultado,
  plano,
  exemplo,
}: {
  resultado: ResultadoSalvo;
  plano: "gratis" | "fundador";
  exemplo: boolean;
}) {
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
    .filter((r): r is { item: NonNullable<typeof r.item>; porqueCombina: string } =>
      Boolean(r.item),
    );

  return (
    <div className="container-nc py-8 md:py-12">
      {exemplo && (
        <Aviso tom="info" className="mb-6" compacto>
          Esta é uma <strong>correção de exemplo</strong> para você conhecer a tela.{" "}
          <Link href="/corrigir" className="font-semibold underline">
            Corrija a sua redação
          </Link>{" "}
          para ver o feedback do seu texto.
        </Aviso>
      )}
      {/* 1. Cabeçalho do resultado */}
      <header className="card flex flex-col items-center gap-6 p-6 text-center sm:p-8 lg:flex-row lg:text-left">
        <AnelDeNota nota={correcao.notaTotal} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="border-borda bg-azul-claro text-azul-escuro rounded-full border px-3 py-1 text-xs font-semibold">
              Nota estimada
            </span>
            {correcao.temaDetectado && (
              <span className="bg-cinza-fundo text-slate rounded-full px-3 py-1 text-xs font-semibold">
                Tema detectado pelo texto
              </span>
            )}
            {resultado.origem === "imagem" && (
              <span className="bg-cinza-fundo text-slate rounded-full px-3 py-1 text-xs font-semibold">
                Transcrita da foto
              </span>
            )}
          </div>
          <p className="text-slate mt-3 text-xs font-semibold tracking-wide uppercase">Tema</p>
          <h1 className="text-navy font-serif text-2xl leading-tight font-semibold sm:text-3xl">
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
            <h2 id="competencias-titulo" className="text-navy font-serif text-lg font-semibold">
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
              <summary className="text-navy flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                Ver a transcrição da foto
                <IconeChevron className="transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-slate mt-3 text-sm whitespace-pre-line">{correcao.transcricao}</p>
              <p className="text-slate mt-2 text-xs">
                Transcrevemos sem corrigir a ortografia; os erros aparecem nos apontamentos.
              </p>
            </details>
          )}

          {/* 3. Parágrafo a parágrafo */}
          <section aria-labelledby="paragrafos-titulo" className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <h2 id="paragrafos-titulo" className="text-navy font-serif text-2xl font-semibold">
                Parágrafo a parágrafo
              </h2>
              <p className="text-slate text-xs">Trecho → problema → motivo</p>
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
              <h2
                id="repertorio-titulo"
                className="text-navy flex items-center gap-2 font-serif text-2xl font-semibold"
              >
                <IconeLivro className="text-azul" />
                Repertório para este tema
              </h2>
              <p className="text-slate mt-1 text-sm">
                Do nosso acervo curado, nunca inventado. Cada um diz por que combina com o tema.
              </p>
            </div>
            {repertorios.length === 0 ? (
              <div className="card text-slate p-5 text-sm">
                Não encontramos um repertório do acervo para este tema.{" "}
                <Link href="/repertorios" className="text-azul font-semibold underline">
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
          <section className="border-borda flex flex-col items-start gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-navy font-semibold">Quer corrigir outra redação?</p>
              <p className="text-slate text-sm">
                O plano grátis libera 2 por mês. Para corrigir sem limite, conheça o Plano Fundador.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Botao href="/corrigir" variante="secundario" className="whitespace-nowrap">
                Corrigir outra redação
                <IconeSeta />
              </Botao>
              <Botao
                onClick={() => pedirUpgrade("Correções ilimitadas")}
                className="whitespace-nowrap"
              >
                Plano Fundador
              </Botao>
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
    <section
      className={cn("card border-l-azul border-l-4 p-5", className)}
      aria-labelledby="resumo-titulo"
    >
      <h2 id="resumo-titulo" className="text-navy font-serif text-lg font-semibold">
        Resumo do professor
      </h2>
      <p className="text-navy mt-2 text-[15.5px] leading-relaxed">{texto}</p>
    </section>
  );
}

function ResultadoVazio() {
  return (
    <div className="container-nc py-16">
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="text-navy font-serif text-2xl font-semibold">Nenhuma correção para mostrar</p>
        <p className="text-slate mt-2">
          O resultado fica disponível só nesta aba, logo após a correção. Envie uma redação para ver
          o feedback completo.
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
      <div className="card nc-pulse bg-cinza-fundo h-40" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="card nc-pulse bg-cinza-fundo h-80" />
        <div className="space-y-4">
          <div className="card nc-pulse bg-cinza-fundo h-56" />
          <div className="card nc-pulse bg-cinza-fundo h-56" />
        </div>
      </div>
    </div>
  );
}
