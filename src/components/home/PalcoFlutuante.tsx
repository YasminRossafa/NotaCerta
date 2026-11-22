"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decoração do herói: folhas de papel soltas que reagem ao mouse (parallax por
 * profundidade), com o anel de nota contando até 920 e um bilhete da professora.
 *
 * É puramente ilustrativo — `aria-hidden` no palco inteiro — e por isso usa
 * valores de exemplo, nunca dados de uma correção real. Sem mouse fino
 * (celular/tablet) ou com `prefers-reduced-motion`, fica parado.
 */

const NOTA_EXEMPLO = 920;
const CIRC = 289; // 2π·46, o raio do anel

export function PalcoFlutuante() {
  const palcoRef = useRef<HTMLDivElement>(null);
  const [nota, setNota] = useState(0);
  const [animar, setAnimar] = useState(false);

  // Parallax: move cada folha conforme a profundidade declarada em data-depth.
  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;
    const fino = window.matchMedia("(pointer: fine)");
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fino.matches || reduzido.matches) return;

    const folhas = Array.from(palco.querySelectorAll<HTMLElement>("[data-depth]"));
    let frame = 0;

    const mover = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = palco.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        for (const f of folhas) {
          const d = Number(f.dataset.depth ?? 0);
          f.style.translate = `${-x * d}px ${-y * d}px`;
        }
      });
    };
    const soltar = () => {
      cancelAnimationFrame(frame);
      for (const f of folhas) f.style.translate = "0 0";
    };

    // O movimento acompanha o herói inteiro, não só o palco.
    const alvo = palco.closest("section") ?? palco;
    alvo.addEventListener("mousemove", mover as EventListener);
    alvo.addEventListener("mouseleave", soltar);
    return () => {
      cancelAnimationFrame(frame);
      alvo.removeEventListener("mousemove", mover as EventListener);
      alvo.removeEventListener("mouseleave", soltar);
    };
  }, []);

  // Contagem da nota de exemplo, logo depois de carregar.
  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const inicio = window.setTimeout(
      () => {
        setAnimar(true);
        if (reduzido) {
          setNota(NOTA_EXEMPLO);
          return;
        }
        const t0 = performance.now();
        const passo = (agora: number) => {
          const p = Math.min((agora - t0) / 1600, 1);
          setNota(Math.round(NOTA_EXEMPLO * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(passo);
        };
        frame = requestAnimationFrame(passo);
      },
      reduzido ? 0 : 600,
    );
    return () => {
      window.clearTimeout(inicio);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={palcoRef}
      aria-hidden="true"
      className="relative hidden h-[540px] select-none lg:block"
    >
      {/* folha de trás */}
      <div
        data-depth="10"
        className="absolute top-[30px] right-5 left-[30px] h-[230px] rotate-[5deg] rounded-[20px] bg-[#E7EEFF] shadow-[var(--shadow-1)] transition-[translate] duration-150 ease-out dark:bg-[#1b2b4d]"
      />

      {/* folha principal, com o parágrafo marcado a caneta */}
      <div
        data-depth="22"
        className="bg-superficie absolute top-2.5 right-10 left-0 h-[230px] -rotate-[2.5deg] rounded-[20px] px-[22px] py-6 shadow-[var(--shadow-2)] transition-[translate] duration-150 ease-out"
      >
        <p className="text-slate text-xs font-extrabold tracking-[0.08em] uppercase">
          Desenvolvimento 1
        </p>
        <p className="text-navy mt-3 text-[15px] leading-[1.9]">
          Em primeiro lugar, destaca-se a <span className="marca-fixa">concentração das salas</span>{" "}
          nos grandes centros, uma vez que os investimentos se{" "}
          <span className="marca-erro">dirigem as regiões</span> de maior consumo. Dessa forma, a
          população fica privada do acesso à cultura.
        </p>
      </div>

      {/* anel de nota */}
      <div
        data-depth="40"
        className="bg-superficie nc-boiar absolute top-[215px] right-0 w-[150px] rotate-[3deg] rounded-[20px] p-4 text-center shadow-[var(--shadow-2)] transition-[translate] duration-150 ease-out [animation-delay:-2s]"
      >
        <div className="relative mx-auto h-[110px] w-[110px]">
          <svg width="110" height="110" className="-rotate-90">
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              strokeWidth="10"
              stroke="var(--nc-eixo)"
            />
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="var(--color-azul)"
              strokeDasharray={CIRC}
              strokeDashoffset={animar ? CIRC * (1 - NOTA_EXEMPLO / 1000) : CIRC}
              style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)" }}
            />
          </svg>
          <b className="text-navy absolute inset-0 grid place-items-center text-[30px] font-extrabold tracking-[-0.04em] tabular-nums">
            {nota}
          </b>
        </div>
        <small className="text-slate mt-1.5 block text-xs font-bold">NOTA ESTIMADA</small>
      </div>

      {/* bilhete de correção */}
      <div
        data-depth="55"
        className="bg-superficie border-l-vermelho nc-boiar absolute bottom-[90px] -left-5 w-[240px] -rotate-[3deg] rounded-[20px] border-l-[5px] px-4 py-3.5 shadow-[var(--shadow-2)] transition-[translate] duration-150 ease-out [animation-delay:-4s]"
      >
        <b className="text-vermelho-texto text-xs tracking-[0.04em]">C1 · CRASE</b>
        <span className="text-navy mt-0.5 block text-[13px] leading-snug">
          “dirigem às regiões”: o verbo pede a preposição “a” + artigo.
        </span>
      </div>

      {/* selo de estrutura aprovada */}
      <div
        data-depth="30"
        className="bg-superficie nc-boiar absolute right-1.5 bottom-0 flex rotate-[2deg] items-center gap-2.5 rounded-full px-4 py-3 text-sm font-bold shadow-[var(--shadow-2)] transition-[translate] duration-150 ease-out [animation-delay:-1s]"
      >
        <svg
          viewBox="0 0 24 24"
          className="bg-verde h-[26px] w-[26px] rounded-full p-[5px]"
          fill="none"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            strokeDasharray="30"
            strokeDashoffset={animar ? 0 : 30}
            style={{ transition: "stroke-dashoffset 1.2s ease 0.3s" }}
          />
        </svg>
        <span className="text-navy">Estrutura dentro do modelo</span>
      </div>
    </div>
  );
}
