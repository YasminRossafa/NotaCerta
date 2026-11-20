import type { Metadata } from "next";
import { CartaoFundadorPrecos } from "@/components/freemium/CartaoFundadorPrecos";
import { Botao } from "@/components/ui/Botao";
import { AvisoNotaEstimada } from "@/components/ui/Aviso";
import { IconeCheck, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Planos: grátis e Plano Fundador",
  description:
    "Corrija 2 redações por mês de graça, com nota estimada, apontamentos com motivo e resumo do professor. O Plano Fundador libera correções ilimitadas, todas as reescritas, repertório completo e histórico.",
  alternates: { canonical: "/precos" },
};

const LINHAS: { recurso: string; gratis: boolean | string; fundador: boolean | string }[] = [
  { recurso: "Correções por mês", gratis: "2", fundador: "Ilimitadas" },
  { recurso: "Nota estimada + 5 competências", gratis: true, fundador: true },
  { recurso: "Apontamentos de todos os parágrafos, com motivo", gratis: true, fundador: true },
  { recurso: "Checklist do modelo por parágrafo", gratis: true, fundador: true },
  { recurso: "Resumo do professor", gratis: true, fundador: true },
  {
    recurso: "Reescrita que ensina",
    gratis: "Só o parágrafo mais crítico",
    fundador: "Todos os parágrafos",
  },
  {
    recurso: "Repertório curado para o tema",
    gratis: "1 sugestão",
    fundador: "Completo (4–5 por tema)",
  },
  { recurso: "Histórico e progresso", gratis: false, fundador: true },
  { recurso: "Exportar em PDF", gratis: false, fundador: true },
];

function Celula({ valor }: { valor: boolean | string }) {
  if (typeof valor === "string") return <span className="text-navy text-sm">{valor}</span>;
  return valor ? (
    <span
      className="bg-verde-claro text-verde inline-flex h-6 w-6 items-center justify-center rounded-full"
      aria-label="Incluído"
      role="img"
    >
      <IconeCheck width={14} height={14} />
    </span>
  ) : (
    <span
      className="bg-cinza-fundo text-slate inline-flex h-6 w-6 items-center justify-center rounded-full"
      aria-label="Não incluído"
      role="img"
    >
      <IconeX width={14} height={14} />
    </span>
  );
}

export default function PaginaPrecos() {
  return (
    <div className="container-nc py-10 md:py-14">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-navy text-3xl font-semibold sm:text-4xl">
          O grátis entrega valor de verdade. O Fundador tira o limite.
        </h1>
        <p className="text-slate mt-3">
          Sem cadastro para começar. Quando quiser mais volume e todas as reescritas, entre na lista
          do Plano Fundador. Ainda não há cobrança: as primeiras vagas abrem com preço de fundador.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
        {/* Grátis */}
        <section className="card card-elevavel flex flex-col p-6 sm:p-7" aria-labelledby="plano-gratis">
          <h2 id="plano-gratis" className="text-navy text-2xl font-semibold">
            Grátis
          </h2>
          <p className="text-slate mt-1 text-sm">Para conhecer o método e corrigir todo mês.</p>
          <p className="text-navy mt-5 text-4xl font-semibold">
            R$ 0<span className="text-slate text-base font-normal tracking-normal"> / sempre</span>
          </p>
          <ul className="text-navy mt-6 flex-1 space-y-2.5 text-sm">
            {[
              "2 correções completas por mês",
              "Nota estimada e 5 competências",
              "Apontamentos com motivo em todos os parágrafos",
              "1 reescrita (parágrafo mais crítico)",
              "Resumo do professor",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="bg-verde-claro text-verde-texto mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                  <IconeCheck width={13} height={13} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Botao href="/" variante="secundario" tamanho="lg" cheio className="mt-7">
            Corrigir redação grátis
          </Botao>
        </section>

        {/* Fundador */}
        <section
          className="bg-navy-fixo sobre-navy relative flex flex-col rounded-[20px] p-6 shadow-[var(--shadow-3)] transition-transform duration-300 sm:-translate-y-3 sm:p-7 sm:hover:-translate-y-5 motion-reduce:transform-none dark:shadow-[var(--nc-brilho-tool)] dark:ring-1 dark:ring-white/10"
          aria-labelledby="plano-fundador"
        >
          <span className="bg-ambar text-navy-fixo absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-extrabold shadow-[0_8px_16px_-6px_var(--color-ambar)]">
            Vagas limitadas
          </span>
          <h2 id="plano-fundador" className="text-2xl text-white">
            Plano Fundador
          </h2>
          <p className="mt-1 text-sm text-[#C9D4F2]">
            Para quem treina várias redações por semana.
          </p>
          <p className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-white">
            Em breve
            <span className="mt-1 block text-base font-normal tracking-normal text-[#C9D4F2]">
              preço de fundador para a lista
            </span>
          </p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[#C9D4F2]">
            {[
              "Correções ilimitadas",
              "Todas as reescritas, parágrafo por parágrafo",
              "Repertório completo para cada tema",
              "Histórico e progresso entre correções",
              "Exportar a correção em PDF",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#4ADE80]">
                  <IconeCheck width={13} height={13} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <CartaoFundadorPrecos />
          </div>
        </section>
      </div>

      {/* Comparativo */}
      <section className="mx-auto mt-12 max-w-4xl" aria-labelledby="comparativo">
        <h2 id="comparativo" className="text-navy text-2xl font-semibold">
          Comparativo
        </h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-cinza-fundo text-slate text-xs font-semibold tracking-wide uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Recurso
                </th>
                <th scope="col" className="px-4 py-3">
                  Grátis
                </th>
                <th scope="col" className="px-4 py-3">
                  Fundador
                </th>
              </tr>
            </thead>
            <tbody>
              {LINHAS.map((l, i) => (
                <tr key={l.recurso} className={cn(i % 2 === 1 && "bg-cinza-fundo/40")}>
                  <th scope="row" className="text-navy px-4 py-3 font-medium">
                    {l.recurso}
                  </th>
                  <td className="px-4 py-3">
                    <Celula valor={l.gratis} />
                  </td>
                  <td className="px-4 py-3">
                    <Celula valor={l.fundador} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AvisoNotaEstimada className="mt-4" />
      </section>
    </div>
  );
}
