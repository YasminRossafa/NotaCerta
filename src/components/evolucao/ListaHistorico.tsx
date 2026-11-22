"use client";

import { useRouter } from "next/navigation";
import { IconeSeta } from "@/components/ui/Icones";
import { formatarDataCompleta } from "@/lib/evolucao-analise";
import type { EntradaHistorico } from "@/lib/historico";
import { salvarResultado } from "@/lib/resultado-store";

/**
 * Lista de correções passadas (spec "Minha evolução"): data, tema e nota; clicar reabre o
 * resultado salvo em /resultado (mesmo mecanismo que a tela de resultado já usa).
 */
export function ListaHistorico({ entradas }: { entradas: EntradaHistorico[] }) {
  const router = useRouter();

  function abrir(entrada: EntradaHistorico) {
    salvarResultado({ correcao: entrada.resultado, origem: "texto" });
    router.push("/resultado");
  }

  if (entradas.length === 0) {
    return <p className="text-slate text-sm">Nenhuma correção no histórico ainda.</p>;
  }

  return (
    <ul className="divide-borda/60 divide-y">
      {entradas.map((e) => (
        <li key={e.id}>
          <button
            type="button"
            onClick={() => abrir(e)}
            className="hover:bg-cinza-fundo flex min-h-[56px] w-full items-center justify-between gap-4 py-3 text-left transition-colors print:hidden"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-navy truncate font-medium">{e.tema}</p>
                {e.demo && (
                  <span className="bg-ambar-claro shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-ambar-texto">
                    exemplo
                  </span>
                )}
              </div>
              <p className="text-slate text-xs">{formatarDataCompleta(e.criadoEm)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-navy font-semibold tabular-nums">
                {e.notaTotal ?? "—"}
                <span className="text-slate text-xs font-normal"> /1000</span>
              </span>
              <IconeSeta width={16} height={16} className="text-slate" />
            </div>
          </button>

          {/* Versão estática para impressão (o botão não faz sentido no papel). */}
          <div className="hidden items-center justify-between py-2 text-sm print:flex">
            <span>
              {e.tema} {e.demo && "(exemplo)"}
            </span>
            <span>
              {formatarDataCompleta(e.criadoEm)} · {e.notaTotal ?? "—"}/1000
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
