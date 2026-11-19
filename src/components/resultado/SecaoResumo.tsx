import { AvisoNotaEstimada } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { IconeSeta } from "@/components/ui/Icones";

/** Seção "Resumo do professor" (spec §11.5/§11.6): texto final + CTA de corrigir outra/upgrade. */
export function SecaoResumo({
  texto,
  fundador,
  aoPedirUpgrade,
}: {
  texto: string;
  fundador: boolean;
  aoPedirUpgrade: () => void;
}) {
  return (
    <div className="space-y-6">
      <section className="card border-l-azul border-l-4 p-5 sm:p-6" aria-labelledby="resumo-titulo">
        <h2 id="resumo-titulo" className="text-navy text-lg font-semibold">
          Resumo do professor
        </h2>
        <p className="text-navy mt-2 text-[15.5px] leading-relaxed">{texto}</p>
      </section>

      <section className="border-borda flex flex-col items-start gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
        {fundador ? (
          <p className="text-navy font-semibold">
            Você já é Fundador — correções ilimitadas e sem bloqueios.
          </p>
        ) : (
          <>
            <div>
              <p className="text-navy font-semibold">Quer corrigir outra redação?</p>
              <p className="text-slate text-sm">
                O plano grátis libera 2 por mês. Para corrigir sem limite, conheça o Plano Fundador.
              </p>
            </div>
            <Botao onClick={aoPedirUpgrade} className="shrink-0 whitespace-nowrap">
              Plano Fundador
            </Botao>
          </>
        )}
        <Botao href="/" variante="secundario" className="shrink-0 whitespace-nowrap">
          Corrigir outra redação
          <IconeSeta />
        </Botao>
      </section>

      <AvisoNotaEstimada className="print:hidden" />
    </div>
  );
}
