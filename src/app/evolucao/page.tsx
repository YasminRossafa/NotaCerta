import type { Metadata } from "next";
import { PaginaEvolucao } from "@/components/evolucao/PaginaEvolucao";

export const metadata: Metadata = {
  title: "Minha evolução",
  description:
    "Acompanhe a evolução da sua nota, compare suas competências entre a primeira e a última correção e veja o que mais se repete nos apontamentos. Recurso do Plano Fundador, salvo só neste navegador.",
  alternates: { canonical: "/evolucao" },
  robots: { index: false, follow: true }, // tela pessoal, não é conteúdo de SEO
};

export default function PaginaEvolucaoRoute() {
  return <PaginaEvolucao />;
}
