"use client";

import { useState } from "react";
import { ModalUpgrade } from "@/components/freemium/ModalUpgrade";
import { Botao } from "@/components/ui/Botao";

/** CTA do Plano Fundador na página de preços: abre o ModalUpgrade (stub, sem cobrança). */
export function BotaoFundador({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <Botao tamanho="lg" cheio onClick={() => setAberto(true)}>
        {children}
      </Botao>
      <ModalUpgrade
        aberto={aberto}
        motivo="recurso"
        recurso="O Plano Fundador"
        aoFechar={() => setAberto(false)}
      />
    </>
  );
}
