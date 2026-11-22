"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useTema } from "@/lib/tema";

type Variante = "colorida" | "escura";

/**
 * Logo do projeto (arquivos em /public). Os dois PNGs têm fundo chapado —
 * branco na versão clara, #022336 na escura — então a logo é apresentada como
 * um "chip" de cantos arredondados: a borda arredondada é intencional e o
 * retângulo do arquivo nunca aparece como emenda.
 */
const ARQUIVO: Record<Variante, string> = {
  colorida: "/notacerta-logo-clara.png",
  escura: "/notacerta-logo-escura.png",
};

export function Logo({
  className,
  variante,
  altura = 28,
}: {
  className?: string;
  /** Sem valor, segue o tema: a versão escura foi feita para fundo escuro. */
  variante?: Variante;
  altura?: number;
}) {
  const tema = useTema();
  const efetiva: Variante = variante ?? (tema === "escuro" ? "escura" : "colorida");

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="NotaCerta — página inicial"
    >
      <span
        className={cn(
          "inline-flex overflow-hidden rounded-[9px]",
          efetiva === "escura" ? "ring-1 ring-white/10" : "ring-1 ring-black/5",
        )}
      >
        <Image
          src={ARQUIVO[efetiva]}
          alt="NotaCerta"
          width={900}
          height={320}
          priority
          sizes="200px"
          style={{ height: altura, width: "auto" }}
        />
      </span>
    </Link>
  );
}
