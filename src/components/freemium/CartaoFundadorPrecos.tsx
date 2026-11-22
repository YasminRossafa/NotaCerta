"use client";

import { BotaoFundador } from "@/components/freemium/BotaoFundador";
import { EntrarFundadorForm } from "@/components/freemium/EntrarFundador";
import { useFundador } from "@/lib/fundador-context";

/**
 * Bloco de ação do card "Plano Fundador" em /precos (spec §18.4): CTA da lista de espera +,
 * logo abaixo, "Já tenho acesso" para quem já tem e-mail de fundador. Se já ativo neste
 * navegador, mostra apenas a confirmação (sem repetir o CTA de lista de espera).
 */
export function CartaoFundadorPrecos() {
  const { fundador, carregando } = useFundador();

  if (carregando) return null;

  if (fundador) {
    return (
      <div className="border-verde/40 bg-verde-claro text-verde-texto rounded-xl border px-4 py-3 text-sm">
        <p className="font-semibold">Plano Fundador ativado neste navegador.</p>
        <p className="mt-1">Correções ilimitadas e repertório completo já estão liberados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BotaoFundador>Entrar na lista do Fundador</BotaoFundador>
      <div className="border-borda border-t pt-5">
        <EntrarFundadorForm rotuloBotao="Entrar" compacto />
      </div>
    </div>
  );
}
