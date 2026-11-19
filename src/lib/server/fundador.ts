import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Acesso "Plano Fundador" de demonstração (spec §18.4 / pedido do fundador): NÃO é autenticação
 * real — não há senha, conta nem banco de dados. Confirma apenas que o e-mail digitado está na
 * lista `FOUNDER_EMAILS` e marca um cookie assinado (HMAC) neste navegador, para destravar a UI
 * do protótipo. O e-mail nunca é exposto ao cliente (sem NEXT_PUBLIC_, nunca commitado).
 */

export const COOKIE_FUNDADOR = "nc_fundador";
const UM_ANO_S = 60 * 60 * 24 * 365;

function listaEmails(): string[] {
  return (process.env.FOUNDER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function emailEhFundador(email: string): boolean {
  return listaEmails().includes(email.trim().toLowerCase());
}

function segredo(): string {
  const s = process.env.FOUNDER_COOKIE_SECRET;
  if (!s) throw new Error("FOUNDER_COOKIE_SECRET não configurado no servidor.");
  return s;
}

function assinar(email: string): string {
  return createHmac("sha256", segredo()).update(email).digest("hex");
}

function flagsCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `Path=/; SameSite=Lax; HttpOnly${secure}`;
}

/** Cookie assinado `email.assinatura` (base64url + hex) — sem JWT, ~10 linhas de HMAC. */
export function cookieFundador(email: string): string {
  const valor = `${Buffer.from(email, "utf8").toString("base64url")}.${assinar(email)}`;
  return `${COOKIE_FUNDADOR}=${valor}; Max-Age=${UM_ANO_S}; ${flagsCookie()}`;
}

export function cookieFundadorLimpo(): string {
  return `${COOKIE_FUNDADOR}=; Max-Age=0; ${flagsCookie()}`;
}

/** true se o valor do cookie é uma assinatura válida para um e-mail que ainda está na lista. */
export function verificarCookie(valor: string | undefined): boolean {
  if (!valor) return false;
  const [emailB64, assinatura] = valor.split(".");
  if (!emailB64 || !assinatura) return false;

  let email: string;
  try {
    email = Buffer.from(emailB64, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const esperada = Buffer.from(assinar(email), "hex");
  const recebida = Buffer.from(assinatura, "hex");
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return false;

  return emailEhFundador(email);
}
