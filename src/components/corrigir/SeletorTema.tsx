"use client";

import { useId, useState } from "react";
import { Campo } from "@/components/ui/Campo";
import { cn } from "@/lib/cn";
import { TEMAS_ENEM } from "@/lib/temas";

/** Temas em destaque na ferramenta; o resto fica na lista de sugestões do campo livre. */
const DESTAQUES = ["2026", "2019", "2023", "2017"] as const;

const EM_DESTAQUE = DESTAQUES.map((ano) => TEMAS_ENEM.find((t) => t.ano === ano)).filter(
  (t): t is (typeof TEMAS_ENEM)[number] => Boolean(t),
);

type Props = {
  tema: string;
  detectar: boolean;
  aoMudarTema: (v: string) => void;
  aoMudarDetectar: (v: boolean) => void;
  erro?: string;
};

/**
 * Escolha do tema em chips (referência visual da home): os temas mais pedidos a um
 * toque, "outro tema" abrindo o campo livre com as sugestões oficiais do ENEM e
 * "não sei" delegando a detecção para a API. O valor enviado é sempre o tema completo.
 */
export function SeletorTema({ tema, detectar, aoMudarTema, aoMudarDetectar, erro }: Props) {
  const listaId = useId();
  const [livre, setLivre] = useState(
    () => tema.length > 0 && !TEMAS_ENEM.some((t) => t.tema === tema),
  );

  return (
    <fieldset>
      <legend className="sr-only">Tema da redação</legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Tema da redação">
        {EM_DESTAQUE.map((t) => (
          <Chip
            key={t.tema}
            ativo={!detectar && !livre && tema === t.tema}
            titulo={`ENEM ${t.ano} — ${t.tema}`}
            onClick={() => {
              setLivre(false);
              aoMudarDetectar(false);
              aoMudarTema(t.tema);
            }}
          >
            {t.curto}
          </Chip>
        ))}

        <Chip
          ativo={livre && !detectar}
          onClick={() => {
            setLivre(true);
            aoMudarDetectar(false);
          }}
        >
          Outro tema
        </Chip>

        <Chip
          ativo={detectar}
          onClick={() => {
            setLivre(false);
            aoMudarDetectar(!detectar);
          }}
        >
          Não sei o tema
        </Chip>
      </div>

      {livre && !detectar && (
        <div className="mt-3">
          <Campo
            rotulo="Qual é o tema?"
            list={listaId}
            value={tema}
            onChange={(e) => aoMudarTema(e.target.value)}
            placeholder="Ex.: Desafios para a valorização da herança africana no Brasil"
            autoComplete="off"
            erro={erro}
          />
          <datalist id={listaId}>
            {TEMAS_ENEM.map((t) => (
              <option key={t.tema} value={t.tema}>{`ENEM ${t.ano}`}</option>
            ))}
          </datalist>
        </div>
      )}

      {detectar && (
        <p className="text-slate mt-2.5 text-[13px]">
          Vamos identificar o tema a partir do próprio texto.
        </p>
      )}

      {erro && !livre && (
        <p role="alert" className="text-vermelho-texto mt-2.5 text-[13px] font-semibold">
          {erro}
        </p>
      )}
    </fieldset>
  );
}

function Chip({
  ativo,
  onClick,
  children,
  titulo,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
  titulo?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      title={titulo}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[44px] items-center rounded-full border-2 px-3.5 text-[13px] font-semibold",
        "transition-[transform,box-shadow,background-color,color] duration-200",
        "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        ativo
          ? "bg-azul-acao border-transparent text-white shadow-[0_8px_16px_-6px_var(--color-azul-acao)]"
          : "bg-cinza-fundo text-slate hover:text-navy border-transparent hover:shadow-[var(--shadow-1)]",
      )}
    >
      {children}
    </button>
  );
}
