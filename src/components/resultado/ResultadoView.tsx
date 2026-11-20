"use client";

import Link from "next/link";
import { useState } from "react";
import { ModalUpgrade, type MotivoUpgrade } from "@/components/freemium/ModalUpgrade";
import { CabecalhoResumo } from "@/components/resultado/CabecalhoResumo";
import { EtapasParagrafos } from "@/components/resultado/EtapasParagrafos";
import { GavetaRedacaoCompleta } from "@/components/resultado/GavetaRedacaoCompleta";
import { NavegacaoSecoes, type SecaoResultado } from "@/components/resultado/NavegacaoSecoes";
import { PainelParagrafo } from "@/components/resultado/PainelParagrafo";
import { SecaoRepertorios } from "@/components/resultado/SecaoRepertorios";
import { SecaoResumo } from "@/components/resultado/SecaoResumo";
import { SecaoVisaoGeral } from "@/components/resultado/SecaoVisaoGeral";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { IconeSeta } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { EXEMPLO_CORRECAO } from "@/lib/exemplo-correcao";
import { useFundador } from "@/lib/fundador-context";
import { calcularGating, indiceParagrafoMaisCritico } from "@/lib/gating";
import { lerResultado, type ResultadoSalvo } from "@/lib/resultado-store";
import { useMontado, useSnapshotCliente } from "@/lib/use-cliente";

/**
 * Tela de resultado (spec §11, reconstruída para separar claramente cada parte): cabeçalho
 * compacto fixo (nota + competências + tema) e 4 seções navegáveis — só uma visível por vez.
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
  const { fundador } = useFundador();

  if (!montado) return <EsqueletoResultado />;
  if (!raw) return <ResultadoVazio />;

  const resultado = JSON.parse(raw) as ResultadoSalvo & { exemplo?: boolean };
  return (
    <Resultado
      resultado={resultado}
      plano={fundador ? "fundador" : "gratis"}
      fundador={fundador}
      exemplo={Boolean(resultado.exemplo)}
    />
  );
}

function Resultado({
  resultado,
  plano,
  fundador,
  exemplo,
}: {
  resultado: ResultadoSalvo;
  plano: "gratis" | "fundador";
  fundador: boolean;
  exemplo: boolean;
}) {
  const { correcao } = resultado;
  const gating = calcularGating(correcao, plano);
  const critico = indiceParagrafoMaisCritico(correcao.paragrafos);

  const [secao, setSecao] = useState<SecaoResultado>("visao-geral");
  const [paragrafoAtivo, setParagrafoAtivo] = useState(critico >= 0 ? critico : 0);
  const [gavetaAberta, setGavetaAberta] = useState(false);
  const [modal, setModal] = useState<{ aberto: boolean; motivo: MotivoUpgrade; recurso?: string }>({
    aberto: false,
    motivo: "recurso",
  });

  const pedirUpgrade = (recurso: string) => setModal({ aberto: true, motivo: "recurso", recurso });

  function irParaParagrafo(indice: number) {
    setParagrafoAtivo(indice);
    setSecao("paragrafos");
  }

  return (
    <div className="pb-10">
      {exemplo && (
        <div className="container-nc pt-6">
          <Aviso tom="info" compacto>
            Esta é uma <strong>correção de exemplo</strong> para você conhecer a tela.{" "}
            <Link href="/" className="font-semibold underline">
              Corrija a sua redação
            </Link>{" "}
            para ver o feedback do seu texto.
          </Aviso>
        </div>
      )}

      <CabecalhoResumo
        correcao={correcao}
        aoAbrirRedacaoCompleta={() => setGavetaAberta(true)}
        aoExportar={() => (fundador ? window.print() : pedirUpgrade("Exportar em PDF"))}
      />

      <div className="container-nc py-6">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start print:block">
          <NavegacaoSecoes ativa={secao} aoSelecionar={setSecao} />

          <div className="min-w-0">
            <div
              id="painel-visao-geral"
              role="tabpanel"
              aria-labelledby="aba-visao-geral"
              tabIndex={0}
              className={cn(secao === "visao-geral" ? "block" : "hidden", "print:mt-6 print:block")}
            >
              <SecaoVisaoGeral correcao={correcao} aoAbrirParagrafo={irParaParagrafo} />
            </div>

            <div
              id="painel-paragrafos"
              role="tabpanel"
              aria-labelledby="aba-paragrafos"
              tabIndex={0}
              className={cn(secao === "paragrafos" ? "block" : "hidden", "print:mt-6 print:block")}
            >
              <div className="space-y-4">
                <EtapasParagrafos
                  paragrafos={correcao.paragrafos}
                  indiceAtivo={paragrafoAtivo}
                  aoSelecionar={setParagrafoAtivo}
                />
                {correcao.paragrafos.map((p, i) => (
                  <div
                    key={`${p.tipo}-${i}`}
                    id={`painel-paragrafo-${i}`}
                    role="tabpanel"
                    aria-labelledby={`etapa-paragrafo-${i}`}
                    className={cn(
                      paragrafoAtivo === i ? "block" : "hidden",
                      "print:mt-6 print:block",
                    )}
                  >
                    <PainelParagrafo
                      paragrafo={p}
                      reescritaBloqueada={!gating.reescritaLiberada(i)}
                      aoPedirUpgrade={() => pedirUpgrade("Todas as reescritas")}
                      abertoInicialmente={i === critico}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div
              id="painel-repertorios"
              role="tabpanel"
              aria-labelledby="aba-repertorios"
              tabIndex={0}
              className={cn(secao === "repertorios" ? "block" : "hidden", "print:mt-6 print:block")}
            >
              <SecaoRepertorios correcao={correcao} gating={gating} aoPedirUpgrade={pedirUpgrade} />
            </div>

            <div
              id="painel-resumo"
              role="tabpanel"
              aria-labelledby="aba-resumo"
              tabIndex={0}
              className={cn(secao === "resumo" ? "block" : "hidden", "print:mt-6 print:block")}
            >
              <SecaoResumo
                texto={correcao.resumoProfessor}
                fundador={fundador}
                aoPedirUpgrade={() => pedirUpgrade("Correções ilimitadas")}
              />
            </div>
          </div>
        </div>
      </div>

      <GavetaRedacaoCompleta
        aberta={gavetaAberta}
        aoFechar={() => setGavetaAberta(false)}
        correcao={correcao}
        gating={gating}
        aoPedirUpgrade={() => pedirUpgrade("Reescrita completa")}
      />
      <ModalUpgrade
        aberto={modal.aberto}
        motivo={modal.motivo}
        recurso={modal.recurso}
        aoFechar={() => setModal((m) => ({ ...m, aberto: false }))}
      />
    </div>
  );
}

function ResultadoVazio() {
  return (
    <div className="container-nc py-16">
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="text-navy text-2xl font-semibold">Nenhuma correção para mostrar</p>
        <p className="text-slate mt-2">
          O resultado fica disponível só nesta aba, logo após a correção. Envie uma redação para ver
          o feedback completo.
        </p>
        <Botao href="/" className="mt-6" tamanho="lg">
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
      <div className="nc-esqueleto h-40 rounded-[20px]" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="nc-esqueleto h-40 rounded-[20px]" />
        <div className="space-y-4">
          <div className="nc-esqueleto h-56 rounded-[20px]" />
          <div className="nc-esqueleto h-56 rounded-[20px]" />
        </div>
      </div>
    </div>
  );
}
