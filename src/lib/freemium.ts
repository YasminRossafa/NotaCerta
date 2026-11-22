/**
 * Freemium no cliente (spec §13): limite mensal por dispositivo e captura de e-mail. Tudo em
 * localStorage, sempre dentro de try/catch (spec §4).
 *
 * O limite "de verdade" é aplicado no servidor (rota /api/corrigir); aqui é só a experiência
 * (abrir o ModalUpgrade antes de gastar uma chamada). Reseta no mês civil. O Plano Fundador
 * (spec §18.4) é à parte: vem do cookie assinado de `/api/fundador` — ver `useFundador()`.
 */

export const LIMITE_GRATIS_PADRAO = 2;

const CHAVES = {
  uso: "nc:uso",
  email: "nc:email",
  rascunho: "nc:rascunho",
} as const;

function ler<T>(chave: string): T | null {
  try {
    const raw = window.localStorage.getItem(chave);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: unknown): void {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* modo privado / cota cheia: ignorar */
  }
}

function mesAtual(): string {
  return new Date().toISOString().slice(0, 7);
}

export function usosNoMes(): number {
  const u = ler<{ mes: string; total: number }>(CHAVES.uso);
  return u && u.mes === mesAtual() ? u.total : 0;
}

export function registrarUso(): void {
  gravar(CHAVES.uso, { mes: mesAtual(), total: usosNoMes() + 1 });
}

export function podeCorrigirGratis(limite = LIMITE_GRATIS_PADRAO): boolean {
  return usosNoMes() < limite;
}

/* ------------------------------ captura de e-mail ------------------------------ */

export type OrigemEmail = "resultado" | "limite" | "recurso" | "precos";

export type IntencaoEmail = {
  email: string;
  consentimento: true;
  origem: OrigemEmail;
  em: string;
  interesseFundador: boolean;
};

export function emailSalvo(): IntencaoEmail | null {
  return ler<IntencaoEmail>(CHAVES.email);
}

export function salvarIntencaoEmail(
  email: string,
  origem: OrigemEmail,
  interesseFundador: boolean,
): void {
  const existente = emailSalvo();
  const registro: IntencaoEmail = {
    email: email.trim().toLowerCase(),
    consentimento: true,
    origem,
    em: new Date().toISOString(),
    interesseFundador: interesseFundador || Boolean(existente?.interesseFundador),
  };
  gravar(CHAVES.email, registro);
  // TODO(claudia): enviar a intenção para um backend/lista (ex.: rota /api/leads → planilha ou CRM).
}

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/* ---------------------------------- rascunho ---------------------------------- */

export function salvarRascunho(r: { tema: string; texto: string }): void {
  gravar(CHAVES.rascunho, { ...r, em: new Date().toISOString() });
}

export function lerRascunho(): { tema: string; texto: string } | null {
  const r = ler<{ tema: string; texto: string }>(CHAVES.rascunho);
  return r && (r.texto || r.tema) ? { tema: r.tema ?? "", texto: r.texto ?? "" } : null;
}

export function limparRascunho(): void {
  try {
    window.localStorage.removeItem(CHAVES.rascunho);
  } catch {
    /* ignorar */
  }
}
