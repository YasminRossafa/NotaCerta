"use client";

import { useSyncExternalStore } from "react";

/**
 * Tema claro/escuro (spec §18.5). A escolha vive em localStorage; o tema efetivo é o
 * atributo `data-theme` do <html> — é ele que troca os valores dos tokens em globals.css
 * e liga o variante `dark:` do Tailwind.
 *
 * O documento é a fonte da verdade (um store externo), não o estado do React: o script
 * inline do layout já escreve `data-theme` antes da primeira pintura, então não há flash
 * nem divergência de hidratação.
 */

export type Tema = "claro" | "escuro";

export const CHAVE_TEMA = "nc:tema";

/**
 * Roda antes da primeira pintura (script inline no <head>). Mantido em string porque
 * precisa estar no HTML inicial, antes de qualquer JS de componente.
 */
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem("${CHAVE_TEMA}");if(t!=="claro"&&t!=="escuro"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"escuro":"claro"}document.documentElement.setAttribute("data-theme",t==="escuro"?"dark":"light")}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`;

const ouvintes = new Set<() => void>();

function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

function lerTema(): Tema {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "escuro" : "claro";
}

/** Grava a escolha e aplica no documento. */
export function definirTema(tema: Tema): void {
  document.documentElement.setAttribute("data-theme", tema === "escuro" ? "dark" : "light");
  try {
    window.localStorage.setItem(CHAVE_TEMA, tema);
  } catch {
    /* modo privado / cota cheia: o tema vale só para esta sessão */
  }
  ouvintes.forEach((o) => o());
}

export function alternarTema(): void {
  definirTema(lerTema() === "escuro" ? "claro" : "escuro");
}

/**
 * Tema efetivo. No servidor devolve "claro" (o <html> nasce com data-theme="light");
 * o script inline corrige antes de pintar e o alternador notifica as mudanças.
 */
export function useTema(): Tema {
  return useSyncExternalStore(assinar, lerTema, () => "claro" as Tema);
}
