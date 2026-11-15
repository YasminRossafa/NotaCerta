import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variante = "colorida" | "escura";

const ARQUIVO: Record<Variante, string> = {
  colorida: "/notacerta-logo-clara.png",
  escura: "/notacerta-logo-escura.png",
};

export function Logo({
  className,
  variante = "colorida",
  altura = 32,
}: {
  className?: string;
  variante?: Variante;
  altura?: number;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="NotaCerta — página inicial"
    >
      <Image
        src={ARQUIVO[variante]}
        alt="NotaCerta"
        width={900}
        height={320}
        priority
        style={{ height: altura, width: "auto" }}
      />
    </Link>
  );
}
