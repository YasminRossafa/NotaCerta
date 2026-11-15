"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CartaoRepertorio } from "@/components/repertorios/CartaoRepertorio";
import { IconeLupa, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import {
  CATEGORIAS,
  ROTULO_CATEGORIA,
  filtrarRepertorios,
  type Categoria,
  type Repertorio,
} from "@/lib/repertorios";

export function ExploradorRepertorios({
  itens,
  temas,
}: {
  itens: Repertorio[];
  temas: { tema: string; total: number }[];
}) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [tema, setTema] = useState("");
  const buscaDeferida = useDeferredValue(busca);

  const resultado = useMemo(
    () => filtrarRepertorios(itens, { busca: buscaDeferida, categoria, tema }),
    [itens, buscaDeferida, categoria, tema],
  );

  const temFiltro = busca || categoria || tema;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Filtros */}
      <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start" aria-label="Filtros">
        <div className="relative">
          <label htmlFor="busca-repertorio" className="sr-only">
            Buscar repertório
          </label>
          <IconeLupa className="text-slate pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2" />
          <input
            id="busca-repertorio"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por título, autor, tema…"
            className="border-borda text-navy placeholder:text-slate/70 focus:border-azul min-h-[44px] w-full rounded-xl border bg-white pr-3.5 pl-11 text-base focus:outline-none"
          />
        </div>

        <fieldset>
          <legend className="text-navy mb-2 text-sm font-semibold">Categoria</legend>
          <div className="flex flex-wrap gap-1.5">
            <Chip ativo={categoria === ""} onClick={() => setCategoria("")}>
              Todas
            </Chip>
            {CATEGORIAS.map((c) => (
              <Chip key={c} ativo={categoria === c} onClick={() => setCategoria(c)}>
                {ROTULO_CATEGORIA[c]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="tema-repertorio" className="text-navy mb-2 block text-sm font-semibold">
            Tema
          </label>
          <select
            id="tema-repertorio"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="border-borda text-navy focus:border-azul min-h-[44px] w-full rounded-xl border bg-white px-3 text-base focus:outline-none"
          >
            <option value="">Todos os temas</option>
            {temas.map((t) => (
              <option key={t.tema} value={t.tema}>
                {t.tema} ({t.total})
              </option>
            ))}
          </select>
        </div>

        {temFiltro && (
          <button
            type="button"
            onClick={() => {
              setBusca("");
              setCategoria("");
              setTema("");
            }}
            className="text-azul hover:text-azul-escuro inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold"
          >
            <IconeX width={16} height={16} />
            Limpar filtros
          </button>
        )}
      </aside>

      {/* Resultados */}
      <div>
        <p className="text-slate mb-4 text-sm" aria-live="polite">
          {resultado.length === itens.length
            ? `${itens.length} repertórios no acervo`
            : `${resultado.length} de ${itens.length} repertórios`}
        </p>
        {resultado.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-navy font-semibold">Nenhum repertório encontrado.</p>
            <p className="text-slate mt-1 text-sm">
              Tente outra palavra ou limpe os filtros. O acervo cresce com o tempo.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {resultado.map((r) => (
              <li key={r.id} className="scroll-mt-24" id={r.id}>
                <CartaoRepertorio item={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={cn(
        "min-h-[36px] rounded-full border px-3 text-sm font-medium transition-colors",
        ativo
          ? "border-azul bg-azul text-white"
          : "border-borda text-navy hover:bg-azul-claro bg-white",
      )}
    >
      {children}
    </button>
  );
}
