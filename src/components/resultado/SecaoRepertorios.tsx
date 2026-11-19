import Link from "next/link";
import { Bloqueado } from "@/components/freemium/Bloqueado";
import { CartaoRepertorio } from "@/components/repertorios/CartaoRepertorio";
import { IconeLivro } from "@/components/ui/Icones";
import type { Gating } from "@/lib/gating";
import { repertorioPorId } from "@/lib/repertorios";
import type { Correcao } from "@/lib/schema";

/** Seção "Repertórios" (spec §11.4): cartões do acervo curado, com o gating do plano grátis. */
export function SecaoRepertorios({
  correcao,
  gating,
  aoPedirUpgrade,
}: {
  correcao: Correcao;
  gating: Gating;
  aoPedirUpgrade: (recurso: string) => void;
}) {
  const repertorios = correcao.repertorioSugestoes
    .map((s) => ({ item: repertorioPorId(s.id), porqueCombina: s.porqueCombina }))
    .filter((r): r is { item: NonNullable<typeof r.item>; porqueCombina: string } =>
      Boolean(r.item),
    );

  return (
    <section aria-labelledby="repertorio-titulo" className="space-y-4">
      <div>
        <h2
          id="repertorio-titulo"
          className="text-navy flex items-center gap-2 text-2xl font-semibold"
        >
          <IconeLivro className="text-azul" />
          Repertório para este tema
        </h2>
        <p className="text-slate mt-1 text-sm">
          Do nosso acervo curado, nunca inventado. Cada um diz por que combina com o tema.
        </p>
      </div>
      {repertorios.length === 0 ? (
        <div className="card text-slate p-5 text-sm">
          Não encontramos um repertório do acervo para este tema.{" "}
          <Link href="/repertorios" className="text-azul font-semibold underline">
            Explore o acervo completo.
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 print:block print:space-y-4">
          {repertorios.map((r, i) => (
            <li key={r.item.id}>
              {gating.repertorioLiberado(i) ? (
                <CartaoRepertorio item={r.item} porqueCombina={r.porqueCombina} linkAcervo />
              ) : (
                <Bloqueado
                  rotulo="Repertório completo por tema é do Plano Fundador."
                  aoPedirUpgrade={() => aoPedirUpgrade("Repertório completo por tema")}
                  className="h-full"
                >
                  <CartaoRepertorio item={r.item} porqueCombina={r.porqueCombina} />
                </Bloqueado>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
