import type { Paragrafo } from "@/lib/schema";

/** Cor/rótulo do status do parágrafo (spec §11/§12), compartilhado pela etapa, atalho e painel. */
export const ROTULO_STATUS: Record<Paragrafo["status"], string> = {
  adequado: "Adequado",
  ajustes: "Precisa de ajustes",
  incompleto: "Incompleto",
};

export const COR_PONTO_STATUS: Record<Paragrafo["status"], string> = {
  adequado: "bg-verde",
  ajustes: "bg-ambar",
  incompleto: "bg-vermelho",
};

export const CLASSES_CHIP_STATUS: Record<Paragrafo["status"], string> = {
  adequado: "bg-verde-claro text-green-800",
  ajustes: "bg-ambar-claro text-amber-800",
  incompleto: "bg-vermelho-claro text-red-800",
};
