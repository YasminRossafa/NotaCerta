import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tom = "info" | "atencao" | "erro" | "sucesso";

const tons: Record<Tom, string> = {
  info: "border-borda bg-azul-claro text-azul-escuro",
  atencao: "border-ambar/50 bg-ambar-claro text-amber-900",
  erro: "border-vermelho/40 bg-vermelho-claro text-red-900",
  sucesso: "border-verde/40 bg-verde-claro text-green-900",
};

export function Aviso({
  tom = "info",
  titulo,
  children,
  className,
  compacto,
}: {
  tom?: Tom;
  titulo?: string;
  children: ReactNode;
  className?: string;
  compacto?: boolean;
}) {
  return (
    <div
      role={tom === "erro" ? "alert" : "status"}
      className={cn(
        "rounded-xl border text-sm leading-relaxed",
        compacto ? "px-3 py-2" : "px-4 py-3",
        tons[tom],
        className,
      )}
    >
      {titulo && <p className="mb-0.5 font-semibold">{titulo}</p>}
      <div>{children}</div>
    </div>
  );
}

/** Aviso constante de "nota estimada" (spec §3.4 e §14). */
export function AvisoNotaEstimada({ className }: { className?: string }) {
  return (
    <p className={cn("text-slate text-xs leading-relaxed", className)}>
      A nota do NotaCerta é <strong className="text-navy font-semibold">estimada</strong> por
      inteligência artificial seguindo o método da professora. Ela serve como referência de estudo e
      não representa a nota oficial do ENEM. O NotaCerta não tem vínculo com o INEP ou com o MEC.
    </p>
  );
}

/** Aviso de modo demonstração — exibido no rodapé quando AI_PROVIDER=gemini (camada gratuita). */
export function AvisoModoDemonstracao({ className }: { className?: string }) {
  return (
    <p className={cn("text-slate text-xs leading-relaxed", className)}>
      <strong className="text-navy font-semibold">Modo demonstração:</strong> as correções desta
      instância são geradas pelo Gemini (camada gratuita do Google AI Studio). Use apenas redações
      de exemplo, nunca redações reais de alunos.
    </p>
  );
}
