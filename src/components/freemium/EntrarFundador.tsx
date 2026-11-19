"use client";

import { useState, type FormEvent } from "react";
import { Botao } from "@/components/ui/Botao";
import { Campo } from "@/components/ui/Campo";
import { IconeCheck } from "@/components/ui/Icones";
import { useFundador } from "@/lib/fundador-context";

type Estado = "idle" | "enviando" | "erro" | "sucesso";

/**
 * Formulário "Já tenho acesso" ao Plano Fundador (spec §18.4, demo): e-mail → POST /api/fundador.
 * Reaproveitado no cabeçalho (dentro de um Modal, ver ControleFundador) e em /precos (inline).
 */
export function EntrarFundadorForm({
  rotuloBotao = "Entrar",
  compacto,
}: {
  rotuloBotao?: string;
  compacto?: boolean;
}) {
  const { entrar } = useFundador();
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const ok = await entrar(email);
    setEstado(ok ? "sucesso" : "erro");
  }

  if (estado === "sucesso") {
    return (
      <div className="border-verde/40 bg-verde-claro flex items-start gap-3 rounded-xl border px-4 py-3 text-sm text-green-900">
        <span className="bg-verde mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
          <IconeCheck width={14} height={14} />
        </span>
        <p>Plano Fundador ativado neste navegador.</p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className={compacto ? "space-y-2" : "space-y-3"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Campo
          rotulo="Já tenho acesso — e-mail de fundador"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (estado === "erro") setEstado("idle");
          }}
          placeholder="voce@exemplo.com"
          erro={estado === "erro" ? "Esse e-mail não está na lista de fundadores." : undefined}
          className="flex-1"
        />
        <Botao
          type="submit"
          variante="secundario"
          disabled={estado === "enviando"}
          className="sm:mt-[26px]"
        >
          {estado === "enviando" ? "Verificando..." : rotuloBotao}
        </Botao>
      </div>
    </form>
  );
}
