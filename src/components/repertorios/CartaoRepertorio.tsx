"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { IconeChevron, IconeExterno } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import {
  DESCRICAO_USO,
  ROTULO_CATEGORIA,
  ROTULO_USO,
  type Repertorio,
  type UsoRepertorio,
} from "@/lib/repertorios";

const CORES_USO: Record<UsoRepertorio, string> = {
  introducao: "bg-azul-claro text-azul-escuro",
  d1: "bg-verde-claro text-verde-texto",
  d2: "bg-roxo-claro text-roxo-texto",
};

export function TagUso({ uso }: { uso: UsoRepertorio }) {
  return (
    <span
      title={DESCRICAO_USO[uso]}
      className={cn("rounded-full px-2 py-0.5 text-xs font-bold", CORES_USO[uso])}
    >
      {ROTULO_USO[uso]}
    </span>
  );
}

/**
 * Cartão de um item do acervo. "Como usar" abre e fecha com a transição de
 * grid-template-rows (0fr → 1fr) — altura animada sem JS e sem altura fixa.
 * Na tela de resultado recebe `porqueCombina` e o link "ver no acervo" (spec §11.4).
 */
export function CartaoRepertorio({
  item,
  porqueCombina,
  linkAcervo,
  className,
  id,
}: {
  item: Repertorio;
  porqueCombina?: string;
  linkAcervo?: boolean;
  className?: string;
  id?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const painelId = useId();

  return (
    <article id={id} className={cn("card card-elevavel flex h-full flex-col p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-slate text-xs font-bold tracking-wide uppercase">
            {ROTULO_CATEGORIA[item.categoria]}
          </p>
          <h3 className="text-navy mt-1 text-xl leading-snug">{item.titulo}</h3>
          {item.autor && <p className="text-slate text-sm">{item.autor}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          {item.uso.map((u) => (
            <TagUso key={u} uso={u} />
          ))}
        </div>
      </div>

      {porqueCombina && (
        <p className="border-ambar/40 bg-ambar-claro text-ambar-texto mt-3 rounded-xl border px-3 py-2 text-sm">
          <strong className="font-bold">Por que combina com o tema:</strong> {porqueCombina}
        </p>
      )}

      <p className="text-navy mt-3 text-sm leading-relaxed">{item.resumo}</p>

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls={painelId}
        className="text-azul hover:text-azul-escuro mt-3 inline-flex min-h-[44px] items-center gap-1.5 self-start text-sm font-bold"
      >
        Como usar
        <IconeChevron
          width={16}
          height={16}
          className={cn("transition-transform duration-300", aberto && "rotate-180")}
        />
      </button>

      <div
        id={painelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="text-slate text-sm leading-relaxed">{item.comoUsar}</p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Temas">
        {item.temas.map((t) => (
          <li key={t} className="bg-cinza-fundo text-slate rounded-full px-2.5 py-0.5 text-xs">
            {t}
          </li>
        ))}
      </ul>

      {linkAcervo && (
        <Link
          href={`/repertorios#${item.id}`}
          className="text-azul hover:text-azul-escuro mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-3 text-sm font-bold"
        >
          Ver no acervo
          <IconeExterno width={16} height={16} />
        </Link>
      )}
    </article>
  );
}
