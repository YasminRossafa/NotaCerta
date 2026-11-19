import type { Metadata } from "next";
import Link from "next/link";
import { FormularioCorrigir } from "@/components/corrigir/FormularioCorrigir";
import { DemoCorrecao } from "@/components/home/DemoCorrecao";
import { Revelar } from "@/components/motion/Revelar";
import { Botao } from "@/components/ui/Botao";
import { AvisoNotaEstimada } from "@/components/ui/Aviso";
import { IconeChevron } from "@/components/ui/Icones";
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

const PASSOS = [
  {
    titulo: "Envie a redação",
    texto: "Cole o texto ou tire uma foto da folha. Diga o tema — ou deixe que a gente detecte.",
  },
  {
    titulo: "O método roda inteiro",
    texto:
      "Introdução, D1, D2 e conclusão, competência por competência, do jeito que a professora corrige.",
  },
  {
    titulo: "Você entende o porquê",
    texto:
      "Nota estimada, cada apontamento com o motivo, a reescrita que ensina e repertório para o tema.",
  },
];

const FAQ = [
  {
    p: "Preciso me cadastrar para corrigir?",
    r: "Não. A primeira correção não exige cadastro. O e-mail só é pedido depois, se você quiser mais correções.",
  },
  {
    p: "Minha redação fica guardada em algum lugar?",
    r: "Não. O texto ou a foto é usado só para gerar a correção e não é salvo em banco de dados.",
  },
  {
    p: "A nota é a nota oficial do ENEM?",
    r: "Não. É uma nota estimada por inteligência artificial seguindo o método da professora. O NotaCerta não tem vínculo com o INEP ou com o MEC.",
  },
  {
    p: "Quantas correções grátis eu tenho?",
    r: "Duas por mês, neste aparelho. O contador reseta no início de cada mês civil.",
  },
  {
    p: "Funciona com redação manuscrita?",
    r: "Sim. Você pode enviar uma foto da folha ou colar o texto digitado — os dois funcionam.",
  },
];

export default function PaginaInicial() {
  return (
    <>
      {/* ---------------------------------------------------------------
          Herói: a ferramenta é a página (spec §18.1)
          --------------------------------------------------------------- */}
      <section className="container-nc py-8 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12">
          <div className="max-w-xl lg:pt-4">
            <h1 className="text-navy text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.035em] sm:text-6xl">
              Corretor de redação ENEM com <span className="marca">método,</span> não com achismo.
            </h1>
            <p className="text-slate mt-6 text-lg leading-relaxed sm:text-xl">
              Envie sua redação e receba nota estimada por competência, cada erro explicado{" "}
              <span className="text-navy font-semibold">com o motivo</span>, a reescrita que ensina
              e repertório curado para o seu tema.
            </p>
            <p className="text-slate mt-5 text-sm">
              Quer ver antes?{" "}
              <Link href="/resultado?exemplo=1" className="text-azul sublinhado font-bold">
                Veja uma correção de exemplo
              </Link>
              .
            </p>
            <AvisoNotaEstimada className="mt-7 max-w-md" />
          </div>

          {/* O cartão grande: é aqui que o aluno age. */}
          <div className="card shadow-alto p-5 sm:p-7">
            <FormularioCorrigir />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Demo interativa — seção escura, o contraponto ao claro
          --------------------------------------------------------------- */}
      <section className="secao-escura" aria-labelledby="demo-titulo">
        <div className="container-nc py-14 md:py-20">
          <Revelar>
            <div className="max-w-2xl">
              <h2
                id="demo-titulo"
                className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Todo corretor diz o que está errado.
                <br />
                <span className="marca-forte">Este explica por quê.</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/75">
                Abaixo está um parágrafo de verdade, corrigido pelo método. Cada trecho marcado tem
                um motivo atrás — é o que faz você não repetir o erro na próxima.
              </p>
            </div>
          </Revelar>
          <Revelar atraso={0.08} className="mt-8">
            <DemoCorrecao />
          </Revelar>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          3 passos
          --------------------------------------------------------------- */}
      <section className="container-nc py-14 md:py-20" aria-labelledby="passos-titulo">
        <Revelar>
          <h2
            id="passos-titulo"
            className="text-navy text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Como funciona
          </h2>
        </Revelar>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {PASSOS.map((passo, i) => (
            <Revelar as="li" key={passo.titulo} atraso={i * 0.08}>
              {/* Número grande, sem ícone-em-círculo (spec §18.5). */}
              <p className="text-ambar text-5xl leading-none font-extrabold tabular-nums">
                {i + 1}
              </p>
              <h3 className="text-navy mt-3 text-xl font-bold">{passo.titulo}</h3>
              <p className="text-slate mt-2 leading-relaxed">{passo.texto}</p>
            </Revelar>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------------
          Planos (teaser) + FAQ
          --------------------------------------------------------------- */}
      <section className="container-nc pb-14 md:pb-20" aria-labelledby="planos-titulo">
        <Revelar>
          <div className="card card-elevavel border-ambar/40 bg-ambar-claro/40 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 id="planos-titulo" className="text-navy text-xl font-bold tracking-tight">
                Grátis: 2 correções completas por mês.
              </h2>
              <p className="text-slate mt-1.5">
                Quer mais volume, todas as reescritas e histórico? Conheça o{" "}
                <Link href="/precos" className="text-azul sublinhado font-bold">
                  Plano Fundador
                </Link>
                .
              </p>
            </div>
            <Botao href="/precos" variante="secundario" className="shrink-0">
              Ver planos
            </Botao>
          </div>
        </Revelar>
      </section>

      <section
        className="bg-superficie-2 border-borda/70 border-y"
        aria-labelledby="faq-titulo"
      >
        <div className="container-nc py-14 md:py-20">
          <Revelar>
            <h2
              id="faq-titulo"
              className="text-navy text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Perguntas frequentes
            </h2>
          </Revelar>
          <div className="divide-borda mt-8 max-w-3xl divide-y">
            {FAQ.map((item, i) => (
              <Revelar key={item.p} atraso={i * 0.04}>
                <details className="group py-4">
                  <summary className="text-navy flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                    {item.p}
                    <IconeChevron
                      className="text-slate group-hover:text-azul shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                      width={20}
                      height={20}
                    />
                  </summary>
                  <p className="text-slate mt-2 leading-relaxed">{item.r}</p>
                </details>
              </Revelar>
            ))}
          </div>
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
