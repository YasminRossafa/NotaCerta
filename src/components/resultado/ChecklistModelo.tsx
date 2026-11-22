import { IconeCheck, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import type { Paragrafo } from "@/lib/schema";

/** Bloco "Checklist do modelo" (spec §11.3): itens do modelo do parágrafo com ✓/✗. */
export function ChecklistModelo({ itens }: { itens: Paragrafo["checklistModelo"] }) {
  const ok = itens.filter((i) => i.ok).length;

  return (
    <div>
      <p className="text-slate mb-2 flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
        Itens do modelo
        <span className="font-normal normal-case">
          {ok}/{itens.length}
        </span>
      </p>
      <ul className="space-y-1.5">
        {itens.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                item.ok ? "bg-verde text-white" : "bg-vermelho-claro text-vermelho",
              )}
              aria-label={item.ok ? "Atende" : "Não atende"}
              role="img"
            >
              {item.ok ? <IconeCheck width={13} height={13} /> : <IconeX width={13} height={13} />}
            </span>
            <span className={item.ok ? "text-slate" : "text-navy"}>
              {item.item}
              {!item.ok && item.observacao && (
                <span className="text-slate block text-xs">{item.observacao}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
