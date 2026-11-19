"use client";

import { useState } from "react";
import { EntrarFundadorForm } from "@/components/freemium/EntrarFundador";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { useFundador } from "@/lib/fundador-context";

/**
 * Entrada/saída do Plano Fundador no cabeçalho (spec §18.4, demo): "Entrar" abre o e-mail de
 * fundador num modal; já ativo, mostra o badge "Fundador" + "Sair". O wrapper que controla
 * visibilidade (ex.: `hidden md:flex`) fica em quem usa este componente.
 */
export function ControleFundador({ className }: { className?: string }) {
  const { fundador, carregando, sair } = useFundador();
  const [aberto, setAberto] = useState(false);

  if (carregando) return null;

  if (fundador) {
    return (
      <div className={cn(className ?? "flex", "items-center gap-2")}>
        <span className="bg-azul-claro text-azul-escuro rounded-full px-3 py-1 text-xs font-semibold">
          Fundador
        </span>
        <button
          type="button"
          onClick={() => void sair()}
          className="text-slate hover:text-navy min-h-[36px] text-sm font-medium underline-offset-2 hover:underline"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className={cn(
          "text-slate hover:text-navy min-h-[44px] px-1 text-sm font-medium",
          className,
        )}
      >
        Entrar
      </button>
      <Modal
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        titulo="Já tenho acesso ao Plano Fundador"
      >
        <p className="text-slate mb-4 text-sm">
          Digite o e-mail cadastrado como fundador para destravar o plano neste navegador.
        </p>
        <EntrarFundadorForm />
      </Modal>
    </>
  );
}
