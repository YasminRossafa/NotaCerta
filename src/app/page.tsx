import type { Metadata } from "next";
import Link from "next/link";
import { FormularioCorrigir } from "@/components/corrigir/FormularioCorrigir";
import { DemoCorrecao } from "@/components/home/DemoCorrecao";
import { PalcoFlutuante } from "@/components/home/PalcoFlutuante";
import { Revelar } from "@/components/motion/Revelar";
import { Botao } from "@/components/ui/Botao";
import { IconeCheck } from "@/components/ui/Icones";
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
  { n: "1", titulo: "Envie", texto: "Cole o texto ou fotografe a folha." },
  { n: "2", titulo: "Receba", texto: "Nota por competência e apontamentos explicados." },
  { n: "3", titulo: "Reescreva", texto: "Veja cada parágrafo ajustado ao modelo." },
];

const PLANO_GRATIS = ["2 correções por mês", "Nota e apontamentos", "1 reescrita"];
const PLANO_FUNDADOR = ["Correções ilimitadas", "Todas as reescritas", "Repertórios e evolução"];

export default function PaginaInicial() {
  return (
    <>
      {/* ---------------------------------------------------------------
          Herói: a ferramenta real é a página (spec §18.1)
          --------------------------------------------------------------- */}
      <section className="papel-pautado px-5 pt-10 pb-20 lg:pt-16">
        <div className="mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <h1 className="text-navy text-[clamp(38px,5.4vw,64px)]">
              Sua redação corrigida <span className="marca">do jeito certo</span>
            </h1>
            <p className="text-slate mt-4 max-w-[46ch] text-lg">
              Cole o texto ou envie uma foto. Receba nota por competência e a reescrita de cada
              parágrafo.
            </p>

            {/* O cartão da ferramenta: o form de verdade, ligado à API e aos limites. */}
            <div className="bg-superficie border-borda mt-7 rounded-[20px] border p-4 shadow-[var(--shadow-2)] focus-within:shadow-[var(--shadow-3)] sm:p-[18px] dark:shadow-[var(--nc-brilho-tool)]">
              <FormularioCorrigir />
            </div>

            <p className="text-slate mt-4 text-sm">
              Quer ver antes?{" "}
              <Link href="/resultado?exemplo=1" className="text-azul font-semibold underline">
                Veja uma correção de exemplo
              </Link>
              .
            </p>
          </div>

          <PalcoFlutuante />
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Exemplo interativo — a seção navy
          --------------------------------------------------------------- */}
      <section
        className="secao-escura brilho-canto px-5 py-20 lg:py-[110px]"
        aria-labelledby="exemplo-titulo"
        id="exemplo"
      >
        <div className="relative mx-auto w-full max-w-[1120px]">
          <Revelar>
            <h2
              id="exemplo-titulo"
              className="max-w-[18ch] text-[clamp(30px,4vw,46px)] text-white"
            >
              Toque no texto e veja a correção
            </h2>
          </Revelar>
          <Revelar atraso={90} className="mt-9">
            <DemoCorrecao />
          </Revelar>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Três passos
          --------------------------------------------------------------- */}
      <section className="px-5 pt-20 pb-10 lg:pt-[100px]" aria-labelledby="passos-titulo">
        <div className="mx-auto w-full max-w-[1120px]">
          <Revelar>
            <h2
              id="passos-titulo"
              className="text-navy max-w-[22ch] text-[clamp(30px,4vw,46px)]"
            >
              Três passos, um minuto
            </h2>
          </Revelar>
          <ul className="mt-9 grid gap-5 sm:grid-cols-3">
            {PASSOS.map((p, i) => (
              <Revelar
                as="li"
                key={p.n}
                atraso={i * 90}
                className="bg-superficie border-borda rounded-[20px] border p-6 shadow-[var(--shadow-1)] transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:rotate-[-0.6deg] hover:shadow-[var(--shadow-2)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                <span className="text-azul block text-[54px] leading-none font-extrabold tracking-[-0.05em]">
                  {p.n}
                </span>
                <h3 className="text-navy mt-3 text-xl">{p.titulo}</h3>
                <p className="text-slate mt-1.5 text-[15px]">{p.texto}</p>
              </Revelar>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          Planos (curtos) — o Fundador domina
          --------------------------------------------------------------- */}
      <section className="px-5 pt-[70px] pb-[110px]" aria-labelledby="planos-titulo">
        <div className="mx-auto w-full max-w-[1120px]">
          <Revelar>
            <h2 id="planos-titulo" className="text-navy max-w-[20ch] text-[clamp(30px,4vw,46px)]">
              Comece grátis
            </h2>
          </Revelar>

          <div className="mt-8 grid max-w-[860px] gap-6 sm:grid-cols-2">
            <Revelar className="bg-superficie border-borda card-elevavel rounded-3xl border p-7 shadow-[var(--shadow-1)]">
              <h3 className="text-navy text-[22px]">Grátis</h3>
              <p className="text-navy mt-1.5 text-[34px] font-extrabold tracking-[-0.04em]">
                R$ 0
              </p>
              <ul className="text-slate mt-4 grid gap-2 text-[15px]">
                {PLANO_GRATIS.map((t) => (
                  <ItemPlano key={t}>{t}</ItemPlano>
                ))}
              </ul>
              <Botao href="/#conteudo" variante="navy" className="mt-6">
                Corrigir agora
              </Botao>
            </Revelar>

            <Revelar
              atraso={90}
              className="bg-navy-fixo sobre-navy rounded-3xl p-7 shadow-[var(--shadow-3)] transition-transform duration-300 sm:-translate-y-2.5 sm:hover:-translate-y-4 motion-reduce:transform-none dark:shadow-[var(--nc-brilho-tool)] dark:ring-1 dark:ring-white/10"
            >
              <h3 className="text-[22px] text-white">Plano Fundador</h3>
              <p className="mt-1.5 text-[34px] font-extrabold tracking-[-0.04em] text-white">
                Em breve
              </p>
              <ul className="mt-4 grid gap-2 text-[15px] text-[#C9D4F2]">
                {PLANO_FUNDADOR.map((t) => (
                  <ItemPlano key={t} escuro>
                    {t}
                  </ItemPlano>
                ))}
              </ul>
              <Botao href="/precos" className="mt-6">
                Quero acesso
              </Botao>
            </Revelar>
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

function ItemPlano({ children, escuro }: { children: React.ReactNode; escuro?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <IconeCheck
        width={16}
        height={16}
        strokeWidth={3}
        className={escuro ? "mt-0.5 shrink-0 text-[#4ADE80]" : "text-verde mt-0.5 shrink-0"}
      />
      {children}
    </li>
  );
}
