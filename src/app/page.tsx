import type { Metadata } from "next";
import Link from "next/link";
import { Botao } from "@/components/ui/Botao";
import { AvisoNotaEstimada } from "@/components/ui/Aviso";
import {
  IconeAlvo,
  IconeCaneta,
  IconeCheck,
  IconeLampada,
  IconeLivro,
  IconeSeta,
  IconeX,
} from "@/components/ui/Icones";
import { AnelDeNota } from "@/components/resultado/AnelDeNota";
import { BarraCompetencia } from "@/components/resultado/BarraCompetencia";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corretor de redação ENEM gratuito com método | NotaCerta",
  description:
    "Corrija sua redação do ENEM grátis e receba nota estimada por competência, erros explicados com o motivo, reescrita que ensina e repertório curado por tema.",
  alternates: { canonical: "/" },
  keywords: [
    "corretor de redação ENEM grátis",
    "correção de redação ENEM",
    "nota redação ENEM",
    "repertório sociocultural",
    "estrutura redação ENEM",
  ],
};

const diferenciais = [
  {
    icone: IconeAlvo,
    titulo: "Erro + motivo, não só a nota",
    texto:
      "Cada apontamento diz o trecho, o problema e por que é um problema. É assim que se aprende a não repetir.",
  },
  {
    icone: IconeCaneta,
    titulo: "Reescrita que ensina",
    texto:
      "Mostramos como o parágrafo ficaria melhor seguindo o método, sem reescrever a redação inteira por você.",
  },
  {
    icone: IconeLivro,
    titulo: "Repertório curado por tema",
    texto:
      "Sugestões vindas de um acervo revisado por professora, com como usar. Nada de citação inventada.",
  },
  {
    icone: IconeLampada,
    titulo: "Calibrado como corretor humano",
    texto:
      "Notas por competência em múltiplos de 40, nem infladas nem punitivas, ancoradas em correções reais.",
  },
];

const passos = [
  {
    n: "1",
    titulo: "Cole o texto ou tire uma foto",
    texto:
      "Funciona com redação digitada ou manuscrita. Informe o tema, ou deixe que a gente detecte.",
  },
  {
    n: "2",
    titulo: "Analisamos competência por competência",
    texto:
      "Introdução, D1, D2 e conclusão são checados contra o método: conectivos, motivo, repertório, proposta.",
  },
  {
    n: "3",
    titulo: "Receba o feedback completo",
    texto:
      "Nota estimada, apontamentos com motivo, reescrita, repertório para o tema e o resumo do professor.",
  },
];

export default function PaginaInicial() {
  return (
    <>
      {/* HERO */}
      <section className="from-azul-claro relative overflow-hidden bg-gradient-to-b to-white">
        <div className="container-nc grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="border-borda text-azul-escuro inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold">
              <span className="bg-verde h-2 w-2 rounded-full" aria-hidden="true" />
              Grátis, sem cadastro, 2 correções por mês
            </p>
            <h1 className="text-navy mt-5 text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Corretor de redação ENEM com <span className="text-azul">método</span>, não com
              achismo.
            </h1>
            <p className="text-slate mt-5 text-lg leading-relaxed">
              Envie sua redação e receba nota estimada por competência, cada erro explicado com o
              motivo, a reescrita que ensina e repertório curado para o seu tema.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Botao href="/corrigir" tamanho="lg">
                Corrigir redação grátis
                <IconeSeta />
              </Botao>
              <Botao href="/estrutura" variante="secundario" tamanho="lg">
                Ver a estrutura do método
              </Botao>
            </div>
            <p className="text-slate mt-4 text-sm">
              Quer ver antes?{" "}
              <Link href="/resultado?exemplo=1" className="text-azul font-semibold underline">
                Veja uma correção de exemplo
              </Link>
              .
            </p>
            <AvisoNotaEstimada className="mt-6 max-w-md" />
          </div>

          <PreviaResultado />
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="container-nc py-14 md:py-20" aria-labelledby="diferenciais">
        <div className="max-w-2xl">
          <p className="text-azul text-sm font-semibold tracking-wide uppercase">
            Por que é diferente
          </p>
          <h2
            id="diferenciais"
            className="text-navy mt-2 text-3xl font-semibold sm:text-4xl"
          >
            Corretores de IA te dão uma nota. O NotaCerta te ensina a subir ela.
          </h2>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((d) => (
            <li key={d.titulo} className="card p-6">
              <span className="bg-azul-claro text-azul flex h-11 w-11 items-center justify-center rounded-xl">
                <d.icone width={24} height={24} />
              </span>
              <h3 className="text-navy mt-4 text-lg font-semibold">{d.titulo}</h3>
              <p className="text-slate mt-2 text-sm leading-relaxed">{d.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-cinza-fundo" aria-labelledby="como-funciona">
        <div className="container-nc py-14 md:py-20">
          <div className="max-w-2xl">
            <p className="text-azul text-sm font-semibold tracking-wide uppercase">Como funciona</p>
            <h2
              id="como-funciona"
              className="text-navy mt-2 text-3xl font-semibold sm:text-4xl"
            >
              Três passos, menos de dois minutos.
            </h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {passos.map((p) => (
              <li key={p.n} className="card relative p-6 pt-8">
                <span className="bg-azul absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-white shadow">
                  {p.n}
                </span>
                <h3 className="text-navy text-lg font-semibold">{p.titulo}</h3>
                <p className="text-slate mt-2 text-sm leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* O MÉTODO em resumo */}
      <section className="container-nc py-14 md:py-20" aria-labelledby="metodo">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-azul text-sm font-semibold tracking-wide uppercase">O método</p>
            <h2
              id="metodo"
              className="text-navy mt-2 text-3xl font-semibold sm:text-4xl"
            >
              Uma estrutura clara para cada parágrafo.
            </h2>
            <p className="text-slate mt-4">
              O NotaCerta corrige seguindo o método da professora, usado em cursinho popular:
              introdução em três frases, desenvolvimentos com conectivo, problemática, motivo
              explícito, citação e argumento, e uma conclusão com os sete elementos da proposta de
              intervenção.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Introdução: repertório → tema + Brasil → duas problemáticas",
                "D1 e D2: conectivo → problemática → motivo (porque/pois) → citação → argumento",
                "Conclusão: conectivo + agente específico + ação + modo + finalidade + detalhamento + retomada",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="bg-verde-claro text-verde mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                    <IconeCheck width={14} height={14} />
                  </span>
                  <span className="text-navy">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Botao href="/estrutura" variante="secundario">
                Estudar a estrutura
              </Botao>
              <Botao href="/repertorios" variante="fantasma">
                Explorar repertórios
              </Botao>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <p className="text-slate text-sm font-semibold">Exemplo de apontamento</p>
            <blockquote className="bg-cinza-fundo text-navy mt-3 rounded-xl p-4 text-sm leading-relaxed">
              “Em segundo lugar, observa-se que{" "}
              <mark className="nc-destaque">o governo deve agir</mark> para resolver a questão.”
            </blockquote>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-vermelho font-semibold">Problema</dt>
                <dd className="text-navy">Agente genérico na proposta de intervenção.</dd>
              </div>
              <div>
                <dt className="text-azul-escuro font-semibold">Motivo</dt>
                <dd className="text-navy">
                  A Competência 5 exige um agente específico. “O governo” não diz quem executa a
                  ação: um órgão real (MEC, Ministério da Saúde, Congresso Nacional) torna a
                  proposta concreta e avaliável.
                </dd>
              </div>
              <div>
                <dt className="text-verde font-semibold">Como ficaria melhor</dt>
                <dd className="text-navy">
                  “Em segundo lugar, observa-se que o Ministério da Educação deve ampliar a oferta
                  de intérpretes de Libras…”
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* GRÁTIS vs PAGO (prova social leve + CTA) */}
      <section className="bg-navy text-white" aria-labelledby="cta-final">
        <div className="container-nc grid gap-8 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-20">
          <div>
            <h2 id="cta-final" className="text-3xl font-semibold sm:text-4xl">
              Comece agora. A primeira correção não pede cadastro.
            </h2>
            <p className="mt-4 text-white/80">
              Duas correções completas por mês, de graça. Quando quiser mais volume, todas as
              reescritas e o histórico, existe o Plano Fundador.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Botao
                href="/corrigir"
                tamanho="lg"
                className="text-azul-escuro hover:bg-azul-claro bg-white"
              >
                Corrigir redação grátis
              </Botao>
              <Link
                href="/precos"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl px-6 font-semibold text-white/90 hover:bg-white/10"
              >
                Ver planos
              </Link>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-white/85">
            {[
              ["Nota estimada + 5 competências", true],
              ["Apontamentos de todos os parágrafos, com motivo", true],
              ["Reescrita do parágrafo mais crítico", true],
              ["Todas as reescritas e repertório completo", false],
            ].map(([t, ok]) => (
              <li key={String(t)} className="flex items-center gap-3">
                <span
                  className={
                    ok
                      ? "bg-verde/20 flex h-6 w-6 items-center justify-center rounded-full text-green-300"
                      : "flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60"
                  }
                >
                  {ok ? <IconeCheck width={14} height={14} /> : <IconeX width={14} height={14} />}
                </span>
                <span>
                  {t}
                  {!ok && <span className="ml-2 text-xs text-white/60">Plano Fundador</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: SITE.nome,
            url: SITE.url,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description: SITE.descricao,
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
            inLanguage: "pt-BR",
          }),
        }}
      />
    </>
  );
}

/** Prévia estática da tela de resultado (reaproveita os componentes reais). */
function PreviaResultado() {
  return (
    <div className="card mx-auto w-full max-w-md p-5 sm:p-6" aria-label="Prévia de uma correção">
      <div className="flex items-center gap-4">
        <AnelDeNota nota={840} tamanho="md" />
        <div>
          <p className="text-slate text-xs font-semibold tracking-wide uppercase">Nota estimada</p>
          <p className="text-navy text-xl leading-tight font-semibold">
            Desafios para a formação educacional de surdos no Brasil
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        <BarraCompetencia codigo="c1" nota={160} compacta />
        <BarraCompetencia codigo="c2" nota={200} compacta />
        <BarraCompetencia codigo="c3" nota={160} compacta />
        <BarraCompetencia codigo="c4" nota={200} compacta />
        <BarraCompetencia codigo="c5" nota={120} compacta />
      </div>
      <p className="bg-azul-claro text-azul-escuro mt-5 rounded-xl px-3 py-2 text-xs">
        <strong>Professor:</strong> Boa estrutura e tema bem retomado. Falta o motivo explícito no
        D2 e a proposta precisa de um detalhamento mais completo.
      </p>
    </div>
  );
}
