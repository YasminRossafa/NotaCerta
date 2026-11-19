"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

export function Cabecalho() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [ultimoPath, setUltimoPath] = useState(pathname);
  const reduzido = useReducedMotion();

  // Fecha o menu ao navegar (ajuste de estado durante o render, sem efeito).
  if (pathname !== ultimoPath) {
    setUltimoPath(pathname);
    setAberto(false);
  }

  const ehAtivo = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="border-borda/70 bg-superficie/85 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="container-nc flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((l) => {
            const ativo = ehAtivo(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  ativo ? "text-navy" : "text-slate hover:text-navy",
                )}
              >
                {l.rotulo}
                {/* Indicador que desliza de um item para o outro (spec §18.5). */}
                {ativo && (
                  <motion.span
                    layoutId="indicador-nav"
                    className="bg-ambar absolute inset-x-2 -bottom-0.5 h-[3px] rounded-full"
                    transition={
                      reduzido
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 520, damping: 38, mass: 0.6 }
                    }
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ControleFundador className="hidden lg:flex" />
          <AlternadorTema />
          <Botao href="/" tamanho="sm" className="hidden sm:inline-flex">
            Corrigir grátis
          </Botao>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="text-navy hover:bg-cinza-fundo border-borda flex h-11 w-11 items-center justify-center rounded-xl border md:hidden"
          >
            {aberto ? <IconeX /> : <IconeMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            id="menu-mobile"
            key="menu-mobile"
            initial={reduzido ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduzido ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="border-borda/70 bg-superficie overflow-hidden border-t md:hidden"
          >
            <nav aria-label="Menu" className="container-nc flex flex-col gap-1 py-3">
              {NAV_LINKS.map((l) => {
                const ativo = ehAtivo(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={ativo ? "page" : undefined}
                    className={cn(
                      "flex min-h-[48px] items-center rounded-xl px-3 text-base font-semibold",
                      ativo
                        ? "bg-azul-claro text-azul-escuro"
                        : "text-navy hover:bg-cinza-fundo transition-colors",
                    )}
                  >
                    {l.rotulo}
                  </Link>
                );
              })}
              <Botao href="/" cheio className="mt-2">
                Corrigir redação grátis
              </Botao>
              <div className="border-borda/70 mt-2 flex items-center justify-center border-t pt-3">
                <ControleFundador />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
