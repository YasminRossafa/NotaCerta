/** Próximo índice ao navegar um grupo de abas/etapas com as setas (roving tabindex), ou null se a tecla não for de navegação. */
export function proximoIndice(atual: number, total: number, tecla: string): number | null {
  if (tecla === "ArrowRight" || tecla === "ArrowDown") return (atual + 1) % total;
  if (tecla === "ArrowLeft" || tecla === "ArrowUp") return (atual - 1 + total) % total;
  if (tecla === "Home") return 0;
  if (tecla === "End") return total - 1;
  return null;
}
