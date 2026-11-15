import type { Metadata } from "next";
import { ExploradorRepertorios } from "@/components/repertorios/ExploradorRepertorios";
import { Botao } from "@/components/ui/Botao";
import { FONTE_ACERVO, REPERTORIOS, temasDoAcervo } from "@/lib/repertorios";

export const metadata: Metadata = {
  title: "Repertórios socioculturais para redação ENEM por tema",
  description:
    "Acervo curado de repertórios para a redação do ENEM: filmes, livros, filosofia, sociologia, fatos históricos e fontes de dados, com resumo, como usar e onde encaixar (introdução, D1, D2).",
  alternates: { canonical: "/repertorios" },
};

export default function PaginaRepertorios() {
  const temas = temasDoAcervo();
  return (
    <div className="container-nc py-10 md:py-14">
      <header className="max-w-2xl">
        <p className="text-azul text-sm font-semibold tracking-wide uppercase">Acervo curado</p>
        <h1 className="text-navy mt-2 font-serif text-3xl font-semibold sm:text-4xl">
          Repertórios socioculturais por tema
        </h1>
        <p className="text-slate mt-3">
          Cada item traz o que é, como usar e onde encaixa no método: na introdução
          (contextualização), no D1 (dados, ciência, fatos) ou no D2 (filosofia, sociologia,
          literatura). É o mesmo acervo que o corretor usa para sugerir repertório na sua correção,
          por isso nunca aparece citação inventada.
        </p>
        <p className="text-slate mt-2 text-xs">Fonte: {FONTE_ACERVO}.</p>
      </header>

      <div className="mt-8">
        <ExploradorRepertorios itens={REPERTORIOS} temas={temas} />
      </div>

      <div className="card bg-azul-claro mt-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-navy font-semibold">
            Quer saber qual repertório combina com o seu tema?
          </p>
          <p className="text-slate text-sm">
            Corrija sua redação e receba 2 a 3 sugestões deste acervo, com o motivo de cada uma.
          </p>
        </div>
        <Botao href="/corrigir">Corrigir redação grátis</Botao>
      </div>
    </div>
  );
}
