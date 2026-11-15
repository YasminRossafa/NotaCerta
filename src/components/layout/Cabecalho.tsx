"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Botao } from "@/components/ui/Botao";
import { IconeMenu, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/site";

export function Cabecalho() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [ultimoPath, setUltimoPath] = useState(pathname);

  // Fecha o menu ao navegar (ajuste de estado durante o render, sem efeito).
  if (pathname !== ultimoPath) {
    setUltimoPath(pathname);
    setAberto(false);
  }

  return (
    <header className="border-borda/60 sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="container-nc flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const ativo = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  ativo ? "bg-azul-claro text-azul-escuro" : "text-slate hover:text-navy",
                )}
              >
                {l.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Botao href="/" tamanho="sm" className="hidden sm:inline-flex">
            Corrigir grátis
          </Botao>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="text-navy hover:bg-cinza-fundo flex h-11 w-11 items-center justify-center rounded-xl md:hidden"
          >
            {aberto ? <IconeX /> : <IconeMenu />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!aberto}
        className="border-borda/60 border-t bg-white md:hidden"
      >
        <nav aria-label="Menu" className="container-nc flex flex-col gap-1 py-3">
          {NAV_LINKS.map((l) => {
            const ativo = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium",
                  ativo ? "bg-azul-claro text-azul-escuro" : "text-navy hover:bg-cinza-fundo",
                )}
              >
                {l.rotulo}
              </Link>
            );
          })}
          <Botao href="/" cheio className="mt-2">
            Corrigir redação grátis
          </Botao>
        </nav>
      </div>
    </header>
  );
}
