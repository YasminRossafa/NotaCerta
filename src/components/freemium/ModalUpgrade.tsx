"use client";

import { CapturaEmail } from "@/components/freemium/CapturaEmail";
import { Botao } from "@/components/ui/Botao";
import { IconeCheck } from "@/components/ui/Icones";
import { Modal } from "@/components/ui/Modal";

export type MotivoUpgrade = "limite" | "recurso";

const BENEFICIOS = [
  "Correções ilimitadas, todos os dias",
  "Todas as reescritas, parágrafo por parágrafo",
  "Repertório completo para o seu tema",
  "Histórico e progresso entre correções",
  "Exportar a correção em PDF",
];

/**
 * Modal de upgrade (stub do plano pago, spec §13). Não há cobrança: captura e-mail + intenção.
 * TODO(claudia): pagamento — ligar o botão a um checkout real.
 */
export function ModalUpgrade({
  aberto,
  aoFechar,
  motivo,
  recurso,
}: {
  aberto: boolean;
  aoFechar: () => void;
  motivo: MotivoUpgrade;
  recurso?: string;
}) {
  const titulo =
    motivo === "limite" ? "Você já usou sua correção grátis de hoje" : "Recurso do Plano Fundador";

  return (
    <Modal aberto={aberto} aoFechar={aoFechar} titulo={titulo}>
      <p className="text-slate text-sm leading-relaxed">
        {motivo === "limite"
          ? "O plano gratuito libera 1 correção completa por dia. Volte amanhã para outra, ou entre na lista do Plano Fundador para corrigir sem limite."
          : `“${recurso ?? "Este recurso"}” faz parte do Plano Fundador. Estamos abrindo as primeiras vagas: deixe seu e-mail para entrar com condição de fundador.`}
      </p>

      <ul className="text-navy mt-4 space-y-2 text-sm">
        {BENEFICIOS.map((b) => (
          <li key={b} className="flex items-center gap-2.5">
            <span className="bg-verde-claro text-verde flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
              <IconeCheck width={13} height={13} />
            </span>
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-cinza-fundo mt-5 rounded-xl p-4">
        <CapturaEmail
          origem={motivo}
          titulo="Entrar na lista do Plano Fundador"
          texto="Sem cobrança agora. Avisamos quando abrir, com preço de fundador."
          rotuloBotao="Quero ser Fundador"
          interesseFundador
          compacto
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Botao variante="fantasma" onClick={aoFechar}>
          {motivo === "limite" ? "Volto amanhã" : "Agora não"}
        </Botao>
        <Botao href="/precos" variante="secundario" onClick={aoFechar}>
          Ver planos
        </Botao>
      </div>
    </Modal>
  );
}
