"use client";

import { useState, type FormEvent } from "react";
import { Botao } from "@/components/ui/Botao";
import { Campo } from "@/components/ui/Campo";
import { IconeCheck } from "@/components/ui/Icones";
import { emailSalvo, emailValido, salvarIntencaoEmail, type OrigemEmail } from "@/lib/freemium";
import { useSnapshotCliente } from "@/lib/use-cliente";

/**
 * Captura de e-mail com consentimento explícito (LGPD, spec §13/§14).
 * Guarda a intenção localmente; envio a um backend fica como TODO em freemium.ts.
 */
export function CapturaEmail({
  origem,
  titulo,
  texto,
  rotuloBotao = "Quero receber",
  interesseFundador = false,
  compacto,
  aoSalvar,
}: {
  origem: OrigemEmail;
  titulo: string;
  texto?: string;
  rotuloBotao?: string;
  interesseFundador?: boolean;
  compacto?: boolean;
  aoSalvar?: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [consente, setConsente] = useState(false);
  const [erro, setErro] = useState<string | undefined>();
  const existente = useSnapshotCliente(() => emailSalvo()?.email ?? null, null);
  const [salvoAgora, setSalvoAgora] = useState<string | null>(null);
  const salvo = salvoAgora ?? existente;

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!emailValido(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }
    if (!consente) {
      setErro("Marque o consentimento para continuar.");
      return;
    }
    salvarIntencaoEmail(email, origem, interesseFundador);
    setSalvoAgora(email.trim().toLowerCase());
    setErro(undefined);
    aoSalvar?.(email);
  }

  if (salvo) {
    return (
      <div className="border-verde/40 bg-verde-claro flex items-start gap-3 rounded-xl border px-4 py-3 text-sm text-verde-texto">
        <span className="bg-verde mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
          <IconeCheck width={14} height={14} />
        </span>
        <p>
          Anotado: <strong>{salvo}</strong>. Avisaremos por e-mail sobre novidades e o Plano
          Fundador.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className={compacto ? "space-y-3" : "space-y-4"}>
      <div>
        <p className="text-navy font-semibold">{titulo}</p>
        {texto && <p className="text-slate mt-1 text-sm">{texto}</p>}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Campo
          rotulo="Seu e-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          erro={erro}
          className="flex-1"
        />
        <Botao type="submit" className="sm:mt-[26px]">
          {rotuloBotao}
        </Botao>
      </div>
      <label className="text-slate flex cursor-pointer items-start gap-3 text-xs leading-relaxed">
        <input
          type="checkbox"
          checked={consente}
          onChange={(e) => setConsente(e.target.checked)}
          className="border-borda accent-azul mt-0.5 h-5 w-5 shrink-0 rounded"
        />
        <span>
          Concordo em receber e-mails do NotaCerta e li o{" "}
          <a href="/privacidade" className="text-azul font-medium underline">
            aviso de privacidade
          </a>
          . Não guardamos sua redação. Você pode sair quando quiser.
        </span>
      </label>
    </form>
  );
}
