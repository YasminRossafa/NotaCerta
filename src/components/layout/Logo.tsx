"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useTema } from "@/lib/tema";

type Variante = "colorida" | "escura";

const ARQUIVO: Record<Variante, string> = {
  colorida: "/notacerta-logo-clara.png",
  escura: "/notacerta-logo-escura.png",
};

export function Logo({
  className,
  variante,
  altura = 32,
}: {
  className?: string;
  /** Sem valor, segue o tema: a logo escura é a que foi feita para fundo escuro. */
  variante?: Variante;
  altura?: number;
}) {
  const tema = useTema();
  const efetiva: Variante = variante ?? (tema === "escuro" ? "escura" : "colorida");

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="NotaCerta — página inicial"
    >
      <Image
        src={ARQUIVO[efetiva]}
        alt="NotaCerta"
        width={900}
        height={320}
        priority
        style={{ height: altura, width: "auto" }}
      />
    </Link>
  );
}
