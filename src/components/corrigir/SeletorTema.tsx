"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Campo } from "@/components/ui/Campo";
import { IconeCheck, IconeLupa } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { TEMAS_ENEM } from "@/lib/temas";

/** Quantos temas aparecem como chip antes de "ver todos". */
const CHIPS_VISIVEIS = 6;

type Props = {
  tema: string;
  detectar: boolean;
  aoMudarTema: (v: string) => void;
  aoMudarDetectar: (v: boolean) => void;
  erro?: string;
};

/**
 * Escolha do tema em chips selecionáveis (spec §18.1): os temas recentes do ENEM a um
 * toque, mais "outro tema" (campo livre com as sugestões oficiais) e "não sei — detectar
 * pelo texto". O valor enviado continua sendo o tema completo.
 */
export function SeletorTema({ tema, detectar, aoMudarTema, aoMudarDetectar, erro }: Props) {
  const listaId = useId();
  const [todos, setTodos] = useState(false);
  // "Outro tema" abre o campo livre; também já abre se vier um rascunho com tema digitado.
  const [livre, setLivre] = useState(
    () => tema.length > 0 && !TEMAS_ENEM.some((t) => t.tema === tema),
  );

  const visiveis = todos ? TEMAS_ENEM : TEMAS_ENEM.slice(0, CHIPS_VISIVEIS);

  function escolher(valor: string) {
    setLivre(false);
    aoMudarDetectar(false);
    aoMudarTema(valor);
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-navy mb-2 text-sm font-semibold">Tema da redação</legend>

      <div className="flex flex-wrap gap-2">
        {visiveis.map((t) => (
          <Chip
            key={t.tema}
            ativo={!detectar && !livre && tema === t.tema}
            onClick={() => escolher(t.tema)}
            titulo={`ENEM ${t.ano} — ${t.tema}`}
          >
            {t.curto}
            <span className="text-[11px] font-medium opacity-70">{t.ano}</span>
          </Chip>
        ))}

        {!todos && (
          <Chip ativo={false} onClick={() => setTodos(true)} variante="discreto">
            + {TEMAS_ENEM.length - CHIPS_VISIVEIS} temas
          </Chip>
        )}

        <Chip
          ativo={livre && !detectar}
          onClick={() => {
            setLivre(true);
            aoMudarDetectar(false);
          }}
          variante="discreto"
        >
          <IconeLupa width={14} height={14} />
          Outro tema
        </Chip>

        <Chip
          ativo={detectar}
          onClick={() => {
            setLivre(false);
            aoMudarDetectar(!detectar);
          }}
          variante="discreto"
        >
          Não sei — detectar pelo texto
        </Chip>
      </div>

      <AnimatePresence initial={false}>
        {livre && !detectar && (
          <AbrirSuave key="campo-livre">
            <Campo
              rotulo="Qual é o tema?"
              list={listaId}
              value={tema}
              onChange={(e) => aoMudarTema(e.target.value)}
              placeholder="Ex.: Desafios para a valorização da herança africana no Brasil"
              autoComplete="off"
              autoFocus
              ajuda="Escreva o tema como ele aparece na prova, ou escolha nas sugestões."
              erro={erro}
            />
            <datalist id={listaId}>
              {TEMAS_ENEM.map((t) => (
                <option key={t.tema} value={t.tema}>{`ENEM ${t.ano}`}</option>
              ))}
            </datalist>
          </AbrirSuave>
        )}

        {detectar && (
          <AbrirSuave key="aviso-detectar">
            <p className="text-slate text-sm">
              Vamos identificar o tema a partir do próprio texto da redação.
            </p>
          </AbrirSuave>
        )}

        {!livre && !detectar && tema && (
          <AbrirSuave key="tema-escolhido">
            <p className="text-slate text-sm leading-relaxed">
              Tema escolhido: <span className="text-navy font-medium">{tema}</span>
            </p>
          </AbrirSuave>
        )}
      </AnimatePresence>

      {erro && !livre && (
        <p role="alert" className="text-vermelho-texto text-sm font-medium">
          {erro}
        </p>
      )}
    </fieldset>
  );
}

function AbrirSuave({ children }: { children: React.ReactNode }) {
  const reduzido = useReducedMotion();
  return (
    <motion.div
      initial={reduzido ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={reduzido ? { opacity: 0 } : { height: 0, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="pt-1">{children}</div>
    </motion.div>
  );
}

function Chip({
  ativo,
  onClick,
  children,
  titulo,
  variante = "tema",
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
  titulo?: string;
  variante?: "tema" | "discreto";
}) {
  const reduzido = useReducedMotion();
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={ativo}
      title={titulo}
      onClick={onClick}
      whileTap={reduzido ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.14 }}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors",
        ativo
          ? "border-azul bg-azul text-white shadow-sm"
          : variante === "discreto"
            ? "border-borda text-slate hover:border-azul/60 hover:text-navy bg-transparent"
            : "border-borda bg-superficie text-navy hover:border-azul/60 hover:bg-azul-claro",
      )}
    >
      {ativo && <IconeCheck width={14} height={14} />}
      {children}
    </motion.button>
  );
}
