import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variante = "primario" | "destaque" | "secundario" | "fantasma" | "perigo";
type Tamanho = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight select-none disabled:cursor-not-allowed disabled:opacity-60 transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:translate-y-px motion-reduce:active:translate-y-0";

const variantes: Record<Variante, string> = {
  primario:
    "bg-azul text-white shadow-sm hover:bg-azul-escuro hover:shadow-md dark:hover:bg-azul dark:hover:brightness-110",
  /** Ação-chave da página: o âmbar da caneta. Texto navy fixo para contraste nos dois temas. */
  destaque:
    "bg-ambar text-navy-fixo shadow-sm hover:brightness-105 hover:shadow-[0_10px_28px_-12px_var(--color-ambar)]",
  secundario:
    "border border-borda bg-superficie text-azul-escuro hover:border-azul/60 hover:bg-azul-claro active:bg-azul-claro",
  fantasma: "bg-transparent text-azul-escuro hover:bg-azul-claro",
  perigo: "bg-vermelho text-white hover:brightness-95",
};

const tamanhos: Record<Tamanho, string> = {
  sm: "min-h-[44px] px-3.5 text-sm",
  md: "min-h-[44px] px-5 text-base",
  lg: "min-h-[54px] px-7 text-lg",
};

type Comum = {
  variante?: Variante;
  tamanho?: Tamanho;
  cheio?: boolean;
  className?: string;
  children: ReactNode;
};

type PropsBotao = Comum &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };
type PropsLink = Comum & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Botao(props: PropsBotao | PropsLink) {
  const { variante = "primario", tamanho = "md", cheio, className, children } = props;
  const classes = cn(base, variantes[variante], tamanhos[tamanho], cheio && "w-full", className);

  if ("href" in props && typeof props.href === "string") {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const rest = { ...(props as PropsBotao) };
  delete rest.variante;
  delete rest.tamanho;
  delete rest.cheio;
  delete rest.className;
  delete (rest as { children?: ReactNode }).children;
  delete rest.href;

  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}
