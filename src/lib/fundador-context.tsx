"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Estado do "Plano Fundador" no cliente (spec §18.4): vem de um cookie assinado pelo servidor
 * (/api/fundador), carregado uma vez por sessão de navegação neste provider. Demonstração, não
 * é autenticação real.
 */
export type EstadoFundador = {
  fundador: boolean;
  carregando: boolean;
  entrar: (email: string) => Promise<boolean>;
  sair: () => Promise<void>;
};

const FundadorContext = createContext<EstadoFundador | null>(null);

export function FundadorProvider({ children }: { children: ReactNode }) {
  const [fundador, setFundador] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    fetch("/api/fundador")
      .then((r) => (r.ok ? (r.json() as Promise<{ fundador?: boolean }>) : { fundador: false }))
      .then((d) => ativo && setFundador(Boolean(d.fundador)))
      .catch(() => {})
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (email: string) => {
    const resp = await fetch("/api/fundador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (resp.ok) setFundador(true);
    return resp.ok;
  }, []);

  const sair = useCallback(async () => {
    try {
      await fetch("/api/fundador", { method: "DELETE" });
    } finally {
      setFundador(false);
    }
  }, []);

  return (
    <FundadorContext.Provider value={{ fundador, carregando, entrar, sair }}>
      {children}
    </FundadorContext.Provider>
  );
}

export function useFundador(): EstadoFundador {
  const ctx = useContext(FundadorContext);
  if (!ctx) throw new Error("useFundador precisa estar dentro de <FundadorProvider>.");
  return ctx;
}
