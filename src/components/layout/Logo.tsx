"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useTema } from "@/lib/tema";

type Variante = "colorida" | "escura";

/**
 * Logo do projeto (arquivos em /public). Os dois PNGs têm fundo transparente e
 * já vêm recortados na arte, sem folga — por isso `altura` é a altura real do
 * desenho, e não de uma moldura. As duas variantes compartilham a mesma caixa
 * (797×222), então a logo não muda de tamanho ao alternar o tema.
 */
const ARQUIVO: Record<Variante, string> = {
  colorida: "/notacerta-logo-clara.png",
  escura: "/notacerta-logo-escura.png",
};

const LARGURA_ARQUIVO = 797;
const ALTURA_ARQUIVO = 222;

export function Logo({
  className,
  variante,
  altura = 32,
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
      <Image
        src={ARQUIVO[efetiva]}
        alt="NotaCerta"
        width={LARGURA_ARQUIVO}
        height={ALTURA_ARQUIVO}
        priority
        sizes="240px"
        style={{ height: altura, width: "auto" }}
      />
    </Link>
  );
}
