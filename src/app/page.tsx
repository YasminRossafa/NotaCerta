import type { Metadata } from "next";
import Link from "next/link";
import { FormularioCorrigir } from "@/components/corrigir/FormularioCorrigir";
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
  "Cole o texto ou tire uma foto da redação, e informe o tema (ou deixe que a gente detecte).",
  "Analisamos introdução, D1, D2 e conclusão competência por competência, seguindo o método.",
  "Você recebe nota estimada, apontamentos com motivo, reescrita e repertório para o tema.",
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
      <section className="container-nc py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
          <div className="max-w-lg lg:pt-2">
            <h1 className="text-navy text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
              Corretor de redação ENEM com <span className="text-azul">método</span>, não com
              achismo.
            </h1>
            <p className="text-slate mt-5 text-lg leading-relaxed">
              Envie sua redação e receba nota estimada por competência, cada erro explicado com o
              motivo, a reescrita que ensina e repertório curado para o seu tema.
            </p>
            <p className="text-slate mt-4 text-sm">
              Quer ver antes?{" "}
              <Link href="/resultado?exemplo=1" className="text-azul font-semibold underline">
                Veja uma correção de exemplo
              </Link>
              .
            </p>
            <AvisoNotaEstimada className="mt-6" />
          </div>

          <div className="card p-5 sm:p-7">
            <FormularioCorrigir />
          </div>
        </div>
      </section>

      {/* 3 passos */}
      <section className="bg-cinza-fundo" aria-labelledby="passos-titulo">
        <div className="container-nc py-12 md:py-16">
          <h2 id="passos-titulo" className="text-navy text-2xl font-semibold sm:text-3xl">
            Como funciona
          </h2>
          <ol className="mt-6 space-y-3">
            {PASSOS.map((texto, i) => (
              <li key={texto} className="flex items-start gap-3 text-sm sm:text-base">
                <span className="bg-azul flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-navy pt-0.5">{texto}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Planos (teaser) */}
      <section className="container-nc py-12 md:py-16" aria-labelledby="planos-titulo">
        <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h2 id="planos-titulo" className="text-navy text-lg font-semibold">
              Grátis: 2 correções completas por mês.
            </h2>
            <p className="text-slate mt-1 text-sm">
              Quer mais volume, todas as reescritas e histórico? Conheça o{" "}
              <Link href="/precos" className="text-azul font-semibold underline">
                Plano Fundador
              </Link>
              .
            </p>
          </div>
          <Botao href="/precos" variante="secundario">
            Ver planos
          </Botao>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-nc pb-14 md:pb-20" aria-labelledby="faq-titulo">
        <h2 id="faq-titulo" className="text-navy text-2xl font-semibold sm:text-3xl">
          Perguntas frequentes
        </h2>
        <div className="divide-borda mt-6 max-w-2xl divide-y">
          {FAQ.map((item) => (
            <details key={item.p} className="group py-4">
              <summary className="text-navy flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {item.p}
                <IconeChevron
                  className="text-slate shrink-0 transition-transform group-open:rotate-180"
                  width={18}
                  height={18}
                />
              </summary>
              <p className="text-slate mt-2 text-sm leading-relaxed">{item.r}</p>
            </details>
          ))}
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
