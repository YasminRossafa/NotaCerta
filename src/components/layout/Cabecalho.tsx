"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ControleFundador } from "@/components/freemium/ControleFundador";
import { AlternadorTema } from "@/components/layout/AlternadorTema";
import { Logo } from "@/components/layout/Logo";
import { Botao } from "@/components/ui/Botao";
import { IconeMenu, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/site";

/**
 * Cabeçalho em pílula flutuante (referência visual da home): fixo no topo, vidro
 * fosco, com a logo do projeto, os links, o alternador de tema e o CTA do Fundador.
 */
export function Cabecalho() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [ultimoPath, setUltimoPath] = useState(pathname);

  // Fecha o menu ao navegar (ajuste de estado durante o render, sem efeito).
  if (pathname !== ultimoPath) {
    setUltimoPath(pathname);
    setAberto(false);
  }

  const ehAtivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-3.5">
      <div className="w-full max-w-[1120px]">
        <nav
          aria-label="Principal"
          className="bg-pilula border-pilula-borda flex items-center gap-2 rounded-[999px] border py-2 pr-2.5 pl-4 shadow-[var(--shadow-1)] backdrop-blur-xl sm:pl-5"
        >
          <Logo className="mr-auto" altura={26} />

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ehAtivo(l.href) ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-full px-3.5 text-sm font-semibold transition-colors",
                  ehAtivo(l.href)
                    ? "bg-azul-claro text-azul-escuro"
                    : "text-slate hover:bg-azul-claro hover:text-azul-escuro",
                )}
              >
                {l.rotulo}
              </Link>
            ))}
          </div>

          <ControleFundador className="hidden xl:flex" />
          <AlternadorTema />

          {/* O wrapper é quem esconde: `hidden` perderia para o `inline-flex` do Botao. */}
          <span className="hidden sm:contents">
            <Botao href="/precos" variante="navy" tamanho="sm">
              Plano Fundador
            </Botao>
          </span>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="text-navy hover:bg-azul-claro flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors lg:hidden"
          >
            {aberto ? <IconeX /> : <IconeMenu />}
          </button>
        </nav>

        {/* Menu em cartão abaixo da pílula — sem overlay, para não cobrir a ferramenta. */}
        <div
          id="menu-mobile"
          hidden={!aberto}
          className="bg-superficie border-borda mt-2 rounded-[20px] border p-2 shadow-[var(--shadow-2)] lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ehAtivo(l.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-[48px] items-center rounded-2xl px-4 font-semibold transition-colors",
                  ehAtivo(l.href)
                    ? "bg-azul-claro text-azul-escuro"
                    : "text-navy hover:bg-cinza-fundo",
                )}
              >
                {l.rotulo}
              </Link>
            ))}
            <div className="border-borda mt-1 flex items-center justify-between gap-2 border-t px-2 pt-3 pb-1">
              <ControleFundador />
              <Botao href="/precos" variante="navy" tamanho="sm" className="sm:hidden">
                Plano Fundador
              </Botao>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
