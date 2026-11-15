"use client";

import { useSyncExternalStore } from "react";

const assinarNada = () => () => {};

/**
 * Lê um valor só disponível no navegador (localStorage, sessionStorage) sem causar
 * divergência de hidratação: no servidor devolve `valorServidor`.
 * O snapshot deve ser primitivo ou estável (ex.: string | null).
 */
export function useSnapshotCliente<T>(lerSnapshot: () => T, valorServidor: T): T {
  return useSyncExternalStore(assinarNada, lerSnapshot, () => valorServidor);
}

/** true depois que o componente montou no navegador. */
export function useMontado(): boolean {
  return useSyncExternalStore(
    assinarNada,
    () => true,
    () => false,
  );
}
