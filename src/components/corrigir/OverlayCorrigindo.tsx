"use client";

import { useEffect, useState } from "react";

/**
 * Overlay exibido enquanto a correção real roda na API. As mensagens giram para
 * dar conta do tempo de espera (a API não transmite progresso); o overlay sai
 * sozinho quando a chamada termina e a navegação para /resultado acontece.
 */
const MENSAGENS = [
  "Lendo sua introdução...",
  "Conferindo a estrutura...",
  "Analisando as competências...",
  "Montando a reescrita...",
];

/** A última mensagem fica até a resposta chegar — a correção leva cerca de um minuto. */
const MS_POR_MENSAGEM = 6000;

export function OverlayCorrigindo({ comImagem }: { comImagem?: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(
      () => setI((v) => Math.min(v + 1, MENSAGENS.length - 1)),
      MS_POR_MENSAGEM,
    );
    return () => window.clearInterval(t);
  }, []);

  // Trava a rolagem do fundo enquanto o overlay está aberto.
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[99] grid place-items-center bg-[rgb(11_18_32/.72)] p-5 backdrop-blur-lg"
    >
      <div className="bg-superficie min-w-[300px] max-w-sm rounded-3xl px-8 py-9 text-center shadow-[var(--shadow-3)]">
        <div className="border-azul-claro border-t-azul mx-auto mb-5 h-[54px] w-[54px] animate-spin rounded-full border-[6px] motion-reduce:animate-none" />
        <b className="text-navy block text-lg">{MENSAGENS[i]}</b>
        <p className="text-slate mt-2 text-sm leading-relaxed">
          {comImagem ? "Transcrevendo a foto e corrigindo" : "Corrigindo"} pelo método, competência
          por competência. Leva cerca de um minuto.
        </p>
      </div>
    </div>
  );
}
