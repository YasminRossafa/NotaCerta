import type { Metadata } from "next";
import { ResultadoView } from "@/components/resultado/ResultadoView";

export const metadata: Metadata = {
  title: "Resultado da correção",
  robots: { index: false, follow: false },
};

export default function PaginaResultado() {
  return <ResultadoView />;
}
