import type { CodigoCompetencia } from "@/lib/competencias";
import type { EntradaHistorico } from "@/lib/historico";

/** Formata uma data ISO como "12 de nov." (compacto, para eixos e listas). */
export function formatarDataCurta(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function formatarDataCompleta(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Entradas em ordem cronológica crescente (mais antiga primeiro) — a ordem que o gráfico usa. */
export function ordemCronologica(entradas: EntradaHistorico[]): EntradaHistorico[] {
  return [...entradas].sort(
    (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
  );
}

export type TendenciaNota = {
  primeira: EntradaHistorico;
  ultima: EntradaHistorico;
  variacao: number | null; // pontos, null se qualquer uma das notas for null
};

/** Compara a primeira e a última correção (por data) com nota estimada. */
export function calcularTendencia(entradas: EntradaHistorico[]): TendenciaNota | null {
  const comNota = ordemCronologica(entradas).filter((e) => e.notaTotal != null);
  if (comNota.length === 0) return null;
  const primeira = comNota[0];
  const ultima = comNota[comNota.length - 1];
  const variacao =
    primeira.notaTotal != null && ultima.notaTotal != null
      ? ultima.notaTotal - primeira.notaTotal
      : null;
  return { primeira, ultima, variacao };
}

/** Resumo em texto do gráfico de evolução, para leitores de tela e para a tabela (spec a11y). */
export function resumoTextoEvolucao(entradas: EntradaHistorico[]): string {
  const comNota = ordemCronologica(entradas).filter((e) => e.notaTotal != null);
  if (comNota.length === 0) return "Ainda não há correções com nota estimada para mostrar.";
  if (comNota.length === 1) {
    return `Uma correção: ${comNota[0].notaTotal} pontos em ${formatarDataCompleta(comNota[0].criadoEm)}.`;
  }
  const primeira = comNota[0];
  const ultima = comNota[comNota.length - 1];
  const variacao = (ultima.notaTotal ?? 0) - (primeira.notaTotal ?? 0);
  const direcao = variacao > 0 ? "subiu" : variacao < 0 ? "caiu" : "ficou estável em";
  const pontos = Math.abs(variacao);
  return (
    `Evolução da nota em ${comNota.length} correções: de ${primeira.notaTotal} pontos em ` +
    `${formatarDataCompleta(primeira.criadoEm)} para ${ultima.notaTotal} pontos em ` +
    `${formatarDataCompleta(ultima.criadoEm)}. A nota ${direcao}${variacao !== 0 ? ` ${pontos} pontos` : ""} no período.`
  );
}

/** Nota por competência da primeira e da última correção com nota, para o comparativo. */
export function compararPrimeiraEUltima(
  entradas: EntradaHistorico[],
): { codigo: CodigoCompetencia; primeira: number; ultima: number }[] | null {
  const tendencia = calcularTendencia(entradas);
  if (!tendencia) return null;
  const codigos: CodigoCompetencia[] = ["c1", "c2", "c3", "c4", "c5"];
  return codigos.map((c) => ({
    codigo: c,
    primeira: tendencia.primeira.competencias[c],
    ultima: tendencia.ultima.competencias[c],
  }));
}

/** Quantos apontamentos (de todas as correções) afetam cada competência, do maior para o menor. */
export function contarApontamentosPorCompetencia(
  entradas: EntradaHistorico[],
): { codigo: CodigoCompetencia; total: number }[] {
  const contagem: Record<CodigoCompetencia, number> = { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 };
  for (const e of entradas) {
    for (const p of e.resultado.paragrafos) {
      for (const a of p.apontamentos) contagem[a.competencia]++;
    }
  }
  return (Object.entries(contagem) as [CodigoCompetencia, number][])
    .map(([codigo, total]) => ({ codigo, total }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

const PALAVRAS_IGNORADAS = new Set([
  "para",
  "como",
  "mais",
  "deve",
  "pelo",
  "pela",
  "esse",
  "essa",
  "isso",
  "sobre",
  "entre",
  "pois",
  "uma",
  "um",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "no",
  "na",
  "nos",
  "nas",
  "que",
  "com",
  "sem",
  "ou",
  "ser",
  "ter",
  "foi",
  "são",
  "está",
  "não",
  "mas",
  "antes",
  "depois",
  "muito",
  "pouco",
  "demais",
]);

function normalizarPalavra(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Palavras-chave mais frequentes entre os `problema` de todos os apontamentos. */
export function palavrasFrequentesProblemas(
  entradas: EntradaHistorico[],
  limite = 8,
): { palavra: string; total: number }[] {
  const contagem = new Map<string, { original: string; total: number }>();
  for (const e of entradas) {
    for (const p of e.resultado.paragrafos) {
      for (const a of p.apontamentos) {
        const palavras = a.problema.split(/[^\p{L}]+/u).filter((w) => w.length >= 4);
        for (const palavra of palavras) {
          const chave = normalizarPalavra(palavra);
          if (PALAVRAS_IGNORADAS.has(chave)) continue;
          const atual = contagem.get(chave);
          if (atual) atual.total++;
          else contagem.set(chave, { original: palavra.toLowerCase(), total: 1 });
        }
      }
    }
  }
  return [...contagem.values()]
    .filter((v) => v.total >= 2)
    .sort((a, b) => b.total - a.total)
    .slice(0, limite)
    .map((v) => ({ palavra: v.original, total: v.total }));
}
