import Link from "next/link";
import { IconeExterno } from "@/components/ui/Icones";
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
      className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", CORES_USO[uso])}
    >
      {ROTULO_USO[uso]}
    </span>
  );
}

/**
 * Cartão de um item do acervo. Na tela de resultado recebe `porqueCombina`
 * e um link "ver no acervo" (spec §11.4).
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
  return (
    <article id={id} className={cn("card flex h-full flex-col p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-slate text-xs font-semibold tracking-wide uppercase">
            {ROTULO_CATEGORIA[item.categoria]}
          </p>
          <h3 className="text-navy mt-1 text-xl leading-snug font-semibold">
            {item.titulo}
          </h3>
          {item.autor && <p className="text-slate text-sm">{item.autor}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          {item.uso.map((u) => (
            <TagUso key={u} uso={u} />
          ))}
        </div>
      </div>

      {porqueCombina && (
        <p className="border-ambar/40 bg-ambar-claro mt-3 rounded-lg border px-3 py-2 text-sm text-ambar-texto">
          <strong className="font-semibold">Por que combina com o tema:</strong> {porqueCombina}
        </p>
      )}

      <p className="text-navy mt-3 text-sm leading-relaxed">{item.resumo}</p>
      <p className="text-slate mt-2 text-sm leading-relaxed">
        <strong className="text-navy font-semibold">Como usar:</strong> {item.comoUsar}
      </p>

      {item.fonte && <p className="mt-2 text-xs text-ambar-texto">{item.fonte}</p>}

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
          className="text-azul hover:text-azul-escuro mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold"
        >
          Ver no acervo
          <IconeExterno width={16} height={16} />
        </Link>
      )}
    </article>
  );
}
