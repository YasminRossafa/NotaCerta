"use client";

import { useState } from "react";
import { ComparativoCompetencias } from "@/components/evolucao/ComparativoCompetencias";
import { GraficoNota } from "@/components/evolucao/GraficoNota";
import { ListaHistorico } from "@/components/evolucao/ListaHistorico";
import { PontosRecorrentes } from "@/components/evolucao/PontosRecorrentes";
import { TeaserBloqueado } from "@/components/evolucao/TeaserBloqueado";
import { ModalUpgrade, type MotivoUpgrade } from "@/components/freemium/ModalUpgrade";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Campo } from "@/components/ui/Campo";
import { IconeImpressora, IconeLixeira, IconeTendencia } from "@/components/ui/Icones";
import { Modal } from "@/components/ui/Modal";
import { calcularTendencia } from "@/lib/evolucao-analise";
import { gerarHistoricoDemo } from "@/lib/evolucao-demo";
import { useFundador } from "@/lib/fundador-context";
import {
  apagarHistorico,
  lerHistorico,
  lerMeta,
  META_PADRAO,
  removerHistoricoDemo,
  salvarMeta,
  semearHistoricoDemo,
  type EntradaHistorico,
} from "@/lib/historico";
import { useMontado, useSnapshotCliente } from "@/lib/use-cliente";

/**
 * /evolucao (spec "Minha evolução"): histórico de correções do Plano Fundador, salvo só neste
 * navegador (localStorage). Free vê uma prévia bloqueada; Fundador vê o painel completo.
 */
export function PaginaEvolucao() {
  const montado = useMontado();
  const { fundador, carregando: carregandoFundador } = useFundador();
  // setVersao força os snapshots abaixo a reler o localStorage após uma mutação (apagar/semear)
  // — useSyncExternalStore chama lerSnapshot() a cada render, então um re-render já basta.
  const [, setVersao] = useState(0);
  const historico = useSnapshotCliente<EntradaHistorico[]>(() => lerHistorico(), []);
  const meta = useSnapshotCliente(() => lerMeta(), META_PADRAO);
  const [modalApagar, setModalApagar] = useState(false);
  const [modal, setModal] = useState<{ aberto: boolean; motivo: MotivoUpgrade }>({
    aberto: false,
    motivo: "recurso",
  });

  const pedirUpgrade = () => setModal({ aberto: true, motivo: "recurso" });

  function recarregar() {
    setVersao((v) => v + 1);
  }

  function aoMudarMeta(valor: string) {
    const n = Number(valor);
    if (!Number.isFinite(n)) return;
    const limitado = Math.max(0, Math.min(1000, Math.round(n)));
    salvarMeta(limitado);
    recarregar();
  }

  function aoConfirmarApagar() {
    apagarHistorico();
    recarregar();
    setModalApagar(false);
  }

  function aoCarregarDemo() {
    semearHistoricoDemo(gerarHistoricoDemo());
    recarregar();
  }

  function aoRemoverDemo() {
    removerHistoricoDemo();
    recarregar();
  }

  if (!montado || carregandoFundador) {
    return (
      <div className="container-nc py-10 md:py-14" aria-busy="true" aria-label="Carregando">
        <div className="card nc-pulse bg-cinza-fundo h-10 w-64" />
        <div className="card nc-pulse bg-cinza-fundo mt-6 h-72" />
      </div>
    );
  }

  return (
    <div className="container-nc py-10 md:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-navy flex items-center gap-2 text-3xl font-semibold sm:text-4xl">
            <IconeTendencia className="text-azul" />
            Minha evolução
          </h1>
          <p className="text-slate mt-2 max-w-xl">
            Acompanhe sua nota, suas competências e o que mais se repete nos apontamentos, correção
            após correção.
          </p>
        </div>
        {fundador && historico.length > 0 && (
          <div className="flex shrink-0 gap-2 print:hidden">
            <Botao variante="secundario" tamanho="sm" onClick={() => window.print()}>
              <IconeImpressora width={16} height={16} />
              Exportar PDF
            </Botao>
            <Botao variante="secundario" tamanho="sm" onClick={() => setModalApagar(true)}>
              <IconeLixeira width={16} height={16} />
              Apagar histórico
            </Botao>
          </div>
        )}
      </header>

      <Aviso tom="info" compacto className="mt-6 print:hidden">
        As correções ficam salvas apenas neste navegador. Trocar de aparelho ou navegador, ou limpar
        os dados do site, apaga o histórico.
      </Aviso>

      <div className="mt-8">
        {!fundador ? (
          <TeaserBloqueado aoPedirUpgrade={pedirUpgrade} />
        ) : historico.length === 0 ? (
          <EstadoVazio aoCarregarDemo={aoCarregarDemo} />
        ) : (
          <PainelFundador
            historico={historico}
            meta={meta}
            aoMudarMeta={aoMudarMeta}
            aoCarregarDemo={aoCarregarDemo}
            aoRemoverDemo={aoRemoverDemo}
          />
        )}
      </div>

      <Modal aberto={modalApagar} aoFechar={() => setModalApagar(false)} titulo="Apagar histórico">
        <p className="text-slate text-sm leading-relaxed">
          Isso apaga todas as correções salvas neste navegador, incluindo dados de demonstração. Não
          dá para desfazer.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Botao variante="fantasma" onClick={() => setModalApagar(false)}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={aoConfirmarApagar}>
            Apagar histórico
          </Botao>
        </div>
      </Modal>

      <ModalUpgrade
        aberto={modal.aberto}
        motivo={modal.motivo}
        recurso="Minha evolução"
        aoFechar={() => setModal((m) => ({ ...m, aberto: false }))}
      />
    </div>
  );
}

function EstadoVazio({ aoCarregarDemo }: { aoCarregarDemo: () => void }) {
  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <p className="text-navy text-xl font-semibold">Ainda não há correções no histórico</p>
      <p className="text-slate mt-2 text-sm leading-relaxed">
        Corrija uma redação para começar a acompanhar sua evolução aqui, ou carregue dados de
        demonstração para ver como a tela fica com o histórico preenchido.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Botao href="/">Corrigir agora</Botao>
        <Botao variante="secundario" onClick={aoCarregarDemo}>
          Carregar histórico de demonstração
        </Botao>
      </div>
    </div>
  );
}

function PainelFundador({
  historico,
  meta,
  aoMudarMeta,
  aoCarregarDemo,
  aoRemoverDemo,
}: {
  historico: EntradaHistorico[];
  meta: number;
  aoMudarMeta: (valor: string) => void;
  aoCarregarDemo: () => void;
  aoRemoverDemo: () => void;
}) {
  const temDemo = historico.some((e) => e.demo);
  const tendencia = calcularTendencia(historico);

  return (
    <div className="space-y-6">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-navy text-xl font-semibold">Nota ao longo do tempo</h2>
          <div className="print:hidden">
            <Campo
              rotulo="Minha meta"
              type="number"
              min={0}
              max={1000}
              step={40}
              value={meta}
              onChange={(e) => aoMudarMeta(e.target.value)}
              className="w-28"
            />
          </div>
        </div>
        <div className="mt-4">
          <GraficoNota entradas={historico} meta={meta} />
        </div>
      </section>

      {tendencia && (
        <section className="card p-5 sm:p-6">
          <h2 className="text-navy text-xl font-semibold">Competências: primeira × última</h2>
          <div className="mt-4">
            <ComparativoCompetencias entradas={historico} tendencia={tendencia} />
          </div>
        </section>
      )}

      <section className="card p-5 sm:p-6">
        <h2 className="text-navy text-xl font-semibold">Pontos que mais se repetem</h2>
        <div className="mt-4">
          <PontosRecorrentes entradas={historico} />
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-navy text-xl font-semibold">Correções salvas</h2>
        <div className="mt-2">
          <ListaHistorico entradas={historico} />
        </div>
      </section>

      <section className="border-borda flex flex-col items-start gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <p className="text-navy font-semibold">Dados de demonstração</p>
          <p className="text-slate text-sm">
            Preenche o histórico com correções fictícias para ver a tela em ação. Elas aparecem
            marcadas como “exemplo” e nunca contam como dado real.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Botao variante="secundario" tamanho="sm" onClick={aoCarregarDemo}>
            Carregar histórico de demonstração
          </Botao>
          {temDemo && (
            <Botao variante="fantasma" tamanho="sm" onClick={aoRemoverDemo}>
              Remover dados de demonstração
            </Botao>
          )}
        </div>
      </section>
    </div>
  );
}
