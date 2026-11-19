"use client";

import { useFundador } from "@/lib/fundador-context";

/**
 * Nota de "modo demonstração" no rodapé quando o Plano Fundador está ativo (spec §18.4):
 * lembra que o acesso é só uma demo local, sem conta nem cobrança reais.
 */
export function AvisoFundadorRodape({ className }: { className?: string }) {
  const { fundador } = useFundador();
  if (!fundador) return null;

  return (
    <p className={className ?? "mt-2 text-xs text-white/70"}>
      <strong className="font-semibold text-white">Modo demonstração:</strong> o Plano Fundador
      deste navegador é um acesso de teste por e-mail, sem conta nem cobrança reais.
    </p>
  );
}
