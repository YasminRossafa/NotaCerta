/**
 * Freemium no cliente (spec §13): limite diário por dispositivo, plano (stub) e captura de e-mail.
 * Tudo em localStorage, sempre dentro de try/catch (spec §4).
 *
 * O limite "de verdade" é aplicado no servidor (rota /api/corrigir); aqui é só a experiência
 * (abrir o ModalUpgrade antes de gastar uma chamada).
 */

export const LIMITE_GRATIS_PADRAO = 1;

const CHAVES = {
  uso: "nc:uso",
  email: "nc:email",
  plano: "nc:plano",
  rascunho: "nc:rascunho",
} as const;

export type Plano = "gratis" | "fundador";

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

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Plano ativo. Stub: sempre "gratis" salvo marcação manual em localStorage. */
export function planoAtivo(): Plano {
  // TODO(claudia): pagamento — trocar por verificação real de assinatura.
  const p = ler<{ plano: Plano }>(CHAVES.plano);
  return p?.plano === "fundador" ? "fundador" : "gratis";
}

export function usosHoje(): number {
  const u = ler<{ dia: string; total: number }>(CHAVES.uso);
  return u && u.dia === hoje() ? u.total : 0;
}

export function registrarUso(): void {
  gravar(CHAVES.uso, { dia: hoje(), total: usosHoje() + 1 });
}

export function podeCorrigirGratis(limite = LIMITE_GRATIS_PADRAO): boolean {
  if (planoAtivo() === "fundador") return true;
  return usosHoje() < limite;
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
