import type { Metadata } from "next";
import { FormularioCorrigir } from "@/components/corrigir/FormularioCorrigir";
import { AvisoNotaEstimada } from "@/components/ui/Aviso";
import { IconeCheck } from "@/components/ui/Icones";

export const metadata: Metadata = {
  title: "Corrigir redação ENEM grátis",
  description:
    "Cole o texto ou envie a foto da sua redação do ENEM e receba nota estimada por competência, erros com o motivo, reescrita e repertório para o tema. Sem cadastro.",
  alternates: { canonical: "/corrigir" },
};

const DICAS = [
  "Envie a redação completa: introdução, dois desenvolvimentos e conclusão.",
  "Informe o tema exatamente como veio na proposta. Se não souber, marque “detectar”.",
  "Na foto, enquadre a folha inteira, com boa luz e sem sombra sobre o texto.",
  "A correção segue o método: conectivos fixos, motivo explícito, repertório em cada desenvolvimento e proposta com 7 elementos.",
];

export default function PaginaCorrigir() {
  return (
    <div className="container-nc py-8 md:py-12">
      <header className="max-w-2xl">
        <h1 className="text-navy text-3xl font-semibold sm:text-4xl">
          Corrigir redação
        </h1>
        <p className="text-slate mt-2">
          Cole o texto ou envie a foto. Em cerca de um minuto você recebe nota estimada,
          apontamentos com o motivo, reescrita e repertório para o tema.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="card p-5 sm:p-7" aria-label="Formulário de correção">
          <FormularioCorrigir />
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <p className="text-navy font-semibold">Para a correção ficar boa</p>
            <ul className="text-slate mt-3 space-y-2.5 text-sm">
              {DICAS.map((d) => (
                <li key={d} className="flex gap-2.5">
                  <span className="bg-verde-claro text-verde mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                    <IconeCheck width={13} height={13} />
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-cinza-fundo p-5">
            <p className="text-navy font-semibold">Privacidade</p>
            <p className="text-slate mt-1 text-sm">
              Sua redação é enviada ao corretor só para gerar o feedback e não fica armazenada. Sem
              cadastro para a primeira correção.
            </p>
            <AvisoNotaEstimada className="mt-3" />
          </div>
        </aside>
      </div>
    </div>
  );
}
