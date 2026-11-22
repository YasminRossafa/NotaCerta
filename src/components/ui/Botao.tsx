import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variante = "azul" | "navy" | "secundario" | "fantasma" | "perigo";
type Tamanho = "sm" | "md" | "lg";

/**
 * Botões em pílula, com a sombra colorida e o leve salto do layout de referência.
 * `azul` é a ação principal; `navy` é a ação de apoio forte (ex.: Plano Fundador).
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight select-none " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-200 " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98] " +
  "motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const variantes: Record<Variante, string> = {
  azul: "bg-azul-acao text-white shadow-[0_10px_24px_-6px_var(--color-azul-acao)] hover:shadow-[0_16px_32px_-8px_var(--color-azul-acao)]",
  navy: "bg-navy-fixo text-white shadow-[0_6px_16px_-4px_rgb(11_18_32/.5)] hover:shadow-[0_12px_24px_-6px_rgb(11_18_32/.55)] dark:bg-superficie-2 dark:ring-1 dark:ring-white/10",
  secundario:
    "border border-borda bg-superficie text-navy hover:border-azul/50 hover:shadow-[var(--shadow-1)]",
  fantasma: "bg-transparent text-azul hover:bg-azul-claro",
  perigo: "bg-vermelho text-white hover:brightness-95",
};

const tamanhos: Record<Tamanho, string> = {
  sm: "min-h-[44px] px-4 text-sm",
  md: "min-h-[48px] px-5 text-[15px]",
  lg: "min-h-[52px] px-6 text-base",
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
  const { variante = "azul", tamanho = "md", cheio, className, children } = props;
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
