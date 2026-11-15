import type { Metadata } from "next";
import { BotaoFundador } from "@/components/freemium/BotaoFundador";
import { Botao } from "@/components/ui/Botao";
import { AvisoNotaEstimada } from "@/components/ui/Aviso";
import { IconeCheck, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Planos: grátis e Plano Fundador",
  description:
    "Corrija 1 redação por dia de graça, com nota estimada, apontamentos com motivo e resumo do professor. O Plano Fundador libera correções ilimitadas, todas as reescritas, repertório completo e histórico.",
  alternates: { canonical: "/precos" },
};

const LINHAS: { recurso: string; gratis: boolean | string; fundador: boolean | string }[] = [
  { recurso: "Correções por dia", gratis: "1", fundador: "Ilimitadas" },
  { recurso: "Nota estimada + 5 competências", gratis: true, fundador: true },
  { recurso: "Apontamentos de todos os parágrafos, com motivo", gratis: true, fundador: true },
  { recurso: "Checklist do modelo por parágrafo", gratis: true, fundador: true },
  { recurso: "Resumo do professor", gratis: true, fundador: true },
  { recurso: "Reescrita que ensina", gratis: "Só o parágrafo mais crítico", fundador: "Todos os parágrafos" },
  { recurso: "Repertório curado para o tema", gratis: "1 sugestão", fundador: "Completo (2–3 por tema)" },
  { recurso: "Histórico e progresso", gratis: false, fundador: true },
  { recurso: "Exportar em PDF", gratis: false, fundador: true },
];

function Celula({ valor }: { valor: boolean | string }) {
  if (typeof valor === "string") return <span className="text-sm text-navy">{valor}</span>;
  return valor ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-verde-claro text-verde" aria-label="Incluído" role="img">
      <IconeCheck width={14} height={14} />
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cinza-fundo text-slate" aria-label="Não incluído" role="img">
      <IconeX width={14} height={14} />
    </span>
  );
}

export default function PaginaPrecos() {
  return (
    <div className="container-nc py-10 md:py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-azul uppercase">Planos</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-navy sm:text-4xl">
          O grátis entrega valor de verdade. O Fundador tira o limite.
        </h1>
        <p className="mt-3 text-slate">
          Sem cadastro para começar. Quando quiser mais volume e todas as reescritas, entre na
          lista do Plano Fundador. Ainda não há cobrança: as primeiras vagas abrem com preço de
          fundador.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
        {/* Grátis */}
        <section className="card flex flex-col p-6 sm:p-7" aria-labelledby="plano-gratis">
          <h2 id="plano-gratis" className="font-serif text-2xl font-semibold text-navy">
            Grátis
          </h2>
          <p className="mt-1 text-sm text-slate">Para conhecer o método e corrigir todo dia.</p>
          <p className="mt-5 font-serif text-4xl font-semibold text-navy">
            R$ 0<span className="text-base font-normal text-slate"> / sempre</span>
          </p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-navy">
            {[
              "1 correção completa por dia",
              "Nota estimada e 5 competências",
              "Apontamentos com motivo em todos os parágrafos",
              "1 reescrita (parágrafo mais crítico)",
              "Resumo do professor",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde-claro text-verde">
                  <IconeCheck width={13} height={13} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Botao href="/corrigir" variante="secundario" tamanho="lg" cheio className="mt-7">
            Corrigir redação grátis
          </Botao>
        </section>

        {/* Fundador */}
        <section
          className="card relative flex flex-col border-azul p-6 ring-2 ring-azul/30 sm:p-7"
          aria-labelledby="plano-fundador"
        >
          <span className="absolute -top-3 left-6 rounded-full bg-azul px-3 py-1 text-xs font-semibold text-white">
            Vagas limitadas
          </span>
          <h2 id="plano-fundador" className="font-serif text-2xl font-semibold text-navy">
            Plano Fundador
          </h2>
          <p className="mt-1 text-sm text-slate">Para quem treina várias redações por semana.</p>
          <p className="mt-5 font-serif text-4xl font-semibold text-navy">
            Em breve
            <span className="block text-base font-normal text-slate">preço de fundador para a lista</span>
          </p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-navy">
            {[
              "Correções ilimitadas",
              "Todas as reescritas, parágrafo por parágrafo",
              "Repertório completo para cada tema",
              "Histórico e progresso entre correções",
              "Exportar a correção em PDF",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-azul-claro text-azul">
                  <IconeCheck width={13} height={13} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <BotaoFundador>Entrar na lista do Fundador</BotaoFundador>
          </div>
        </section>
      </div>

      {/* Comparativo */}
      <section className="mx-auto mt-12 max-w-4xl" aria-labelledby="comparativo">
        <h2 id="comparativo" className="font-serif text-2xl font-semibold text-navy">
          Comparativo
        </h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-cinza-fundo text-xs font-semibold tracking-wide text-slate uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">Recurso</th>
                <th scope="col" className="px-4 py-3">Grátis</th>
                <th scope="col" className="px-4 py-3">Fundador</th>
              </tr>
            </thead>
            <tbody>
              {LINHAS.map((l, i) => (
                <tr key={l.recurso} className={cn(i % 2 === 1 && "bg-cinza-fundo/40")}>
                  <th scope="row" className="px-4 py-3 font-medium text-navy">{l.recurso}</th>
                  <td className="px-4 py-3"><Celula valor={l.gratis} /></td>
                  <td className="px-4 py-3"><Celula valor={l.fundador} /></td>
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
