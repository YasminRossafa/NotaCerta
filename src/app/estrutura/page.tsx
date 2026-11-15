import type { Metadata } from "next";
import { ExemploDestacado } from "@/components/estrutura/ExemploDestacado";
import { Botao } from "@/components/ui/Botao";
import { cn } from "@/lib/cn";
import { corDoRotulo, EXEMPLOS, FONTE_EXEMPLOS } from "@/lib/estrutura";

export const metadata: Metadata = {
  title: "Estrutura da redação ENEM: introdução, D1, D2 e conclusão com exemplos",
  description:
    "Aprenda a estrutura da redação do ENEM pelo método: introdução em 3 frases, desenvolvimentos com conectivo, problemática, motivo, citação e argumento, e conclusão com os 7 elementos. Com redações-modelo destacadas por cor.",
  alternates: { canonical: "/estrutura" },
};

type Elemento = { rotulo: string; texto: string };

const INTRO: Elemento[] = [
  {
    rotulo: "Repertório sociocultural",
    texto:
      "Um conhecimento de fora (filme, livro, fato histórico, conceito) que abre o texto e se relaciona com o tema.",
  },
  {
    rotulo: "Tema + Brasil",
    texto:
      "Liga o repertório ao tema, citando o tema por completo e trazendo para o Brasil (“na sociedade brasileira”).",
  },
  {
    rotulo: "Duas problemáticas",
    texto:
      "Dois problemas específicos, tirados dos textos de apoio, unidos por “e” ou “além de”. Nada genérico.",
  },
];

const D1: Elemento[] = [
  {
    rotulo: "Conectivo",
    texto: "Abre com “Primeiramente” ou “Em primeiro lugar”. Um só, só neste parágrafo.",
  },
  {
    rotulo: "Problemática",
    texto: "Retoma, com suas palavras, a 1ª problemática apresentada na introdução.",
  },
  {
    rotulo: "Motivo",
    texto:
      "A frase do “porque”: explica por que aquilo é um problema. Sem ela, o parágrafo fica sem causa.",
  },
  {
    rotulo: "Citação (dados)",
    texto: "Repertório científico: dado, pesquisa, fato. Sempre confira o número.",
  },
  {
    rotulo: "Argumento",
    texto: "Aprofunda o impacto e fecha o parágrafo: “Desse modo”, “Logo”, “Dessa forma”.",
  },
];

const D2: Elemento[] = [
  {
    rotulo: "Conectivo",
    texto: "Abre com “Em segundo lugar” ou “Ademais”. Um só, só neste parágrafo.",
  },
  {
    rotulo: "Problemática",
    texto: "Retoma, com suas palavras, a 2ª problemática apresentada na introdução.",
  },
  {
    rotulo: "Motivo",
    texto:
      "A frase do “porque”: explica por que aquilo é um problema. Sem ela, o parágrafo fica sem causa.",
  },
  {
    rotulo: "Citação (filosófica/sociológica)",
    texto: "Repertório filosófico, sociológico ou literário, integrado ao argumento.",
  },
  {
    rotulo: "Argumento",
    texto: "Aprofunda o impacto e fecha o parágrafo: “Desse modo”, “Logo”, “Dessa forma”.",
  },
];

const CONCL: Elemento[] = [
  { rotulo: "Conectivo conclusivo", texto: "Portanto / Dessa forma / Assim / Logo / Sendo assim." },
  {
    rotulo: "Agente",
    texto:
      "Quem faz: um órgão real (MEC, Ministério da Saúde, Congresso Nacional…). “O governo” não vale.",
  },
  {
    rotulo: "Ação",
    texto: "O que fazer, com verbo no infinitivo: capacitar, fiscalizar, investir, criar…",
  },
  {
    rotulo: "Modo/Meio",
    texto: "Como: “por meio de”, “mediante”, “através de”, “por intermédio de”.",
  },
  {
    rotulo: "Finalidade",
    texto: "Para quê: “com a finalidade de”, “a fim de que”, “com o objetivo de”.",
  },
  {
    rotulo: "Detalhamento",
    texto:
      "Uma frase inteira que aprofunda a ação: “Em detalhe,”, “isto é,”, “como, por exemplo,”.",
  },
  {
    rotulo: "Retomada do repertório",
    texto: "Volta à obra ou ao personagem da introdução, fechando o circuito do texto.",
  },
];

function ListaElementos({ itens, inicio = 1 }: { itens: Elemento[]; inicio?: number }) {
  return (
    <ol className="mt-4 space-y-3" start={inicio}>
      {itens.map((el, i) => {
        const cor = corDoRotulo(el.rotulo);
        return (
          <li key={el.rotulo} className="flex gap-3">
            <span className="bg-navy mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
              {inicio + i}
            </span>
            <div>
              <span
                className={cn(
                  "rounded-[4px] border-b-2 px-1.5 py-0.5 text-sm font-semibold",
                  cor.fundo,
                  cor.texto,
                  cor.borda,
                )}
              >
                {el.rotulo}
              </span>
              <p className="text-slate mt-1.5 text-sm leading-relaxed">{el.texto}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function PaginaEstrutura() {
  return (
    <div className="container-nc py-10 md:py-14">
      <header className="max-w-2xl">
        <h1 className="text-navy font-serif text-3xl font-semibold sm:text-4xl">
          A estrutura da redação, parágrafo por parágrafo
        </h1>
        <p className="text-slate mt-3">
          Quatro parágrafos, cada um com elementos fixos. É exatamente o que o corretor do NotaCerta
          verifica. Primeiro a explicação; depois, redações-modelo com cada elemento destacado por
          cor.
        </p>
      </header>

      {/* Camada 1: explicação dos elementos */}
      <section className="mt-10 grid gap-5 lg:grid-cols-4" aria-label="Elementos de cada parágrafo">
        <article className="card p-6">
          <p className="text-slate text-xs font-semibold tracking-wide uppercase">Parágrafo 1</p>
          <h2 className="text-navy mt-1 font-serif text-2xl font-semibold">Introdução</h2>
          <p className="text-slate mt-1 text-sm">
            Três frases, impessoal, sem 1ª pessoa, sem dado estatístico.
          </p>
          <ListaElementos itens={INTRO} />
        </article>

        <article className="card p-6">
          <p className="text-slate text-xs font-semibold tracking-wide uppercase">Parágrafo 2</p>
          <h2 className="text-navy mt-1 font-serif text-2xl font-semibold">Desenvolvimento 1</h2>
          <p className="text-slate mt-1 text-sm">
            Retoma a 1ª problemática, com citação científica.
          </p>
          <ListaElementos itens={D1} />
        </article>

        <article className="card p-6">
          <p className="text-slate text-xs font-semibold tracking-wide uppercase">Parágrafo 3</p>
          <h2 className="text-navy mt-1 font-serif text-2xl font-semibold">Desenvolvimento 2</h2>
          <p className="text-slate mt-1 text-sm">
            Retoma a 2ª problemática, com citação filosófica, sociológica ou literária.
          </p>
          <ListaElementos itens={D2} />
        </article>

        <article className="card p-6">
          <p className="text-slate text-xs font-semibold tracking-wide uppercase">Parágrafo 4</p>
          <h2 className="text-navy mt-1 font-serif text-2xl font-semibold">Conclusão</h2>
          <p className="text-slate mt-1 text-sm">
            Proposta de intervenção completa: os 7 elementos, nesta ordem.
          </p>
          <ListaElementos itens={CONCL} />
        </article>
      </section>

      {/* Camada 2: exemplos destacados */}
      <section className="mt-14" aria-labelledby="exemplos-titulo">
        <div className="max-w-2xl">
          <h2 id="exemplos-titulo" className="text-navy font-serif text-3xl font-semibold">
            Redações-modelo com cada parte destacada
          </h2>
          <p className="text-slate mt-3">
            Veja onde está cada elemento em um texto real. Toque em um item da legenda para realçar
            só aquela parte.
          </p>
        </div>
        <div className="mt-6">
          <ExemploDestacado exemplos={EXEMPLOS} />
        </div>
        <p className="text-slate mt-3 text-xs">Fonte dos exemplos: {FONTE_EXEMPLOS}.</p>
      </section>

      <div className="card bg-azul-claro mt-12 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-navy font-semibold">
            Agora teste a sua redação contra essa estrutura.
          </p>
          <p className="text-slate text-sm">
            O corretor aponta qual elemento falta e explica o motivo.
          </p>
        </div>
        <Botao href="/corrigir">Corrigir redação grátis</Botao>
      </div>
    </div>
  );
}
