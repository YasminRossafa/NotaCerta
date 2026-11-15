import "server-only";

/**
 * Rate limit por dispositivo (spec §9.1): cookie anônimo `nc_did` + contador diário em memória.
 *
 * TODO(claudia): em serverless (Vercel) a memória não é compartilhada entre instâncias nem
 * sobrevive a cold starts, então este limite é "melhor esforço". Para valer de verdade,
 * trocar o Map por um store externo (Upstash Redis / Vercel KV) mantendo esta interface.
 */

export const COOKIE_DISPOSITIVO = "nc_did";
const UM_ANO_S = 60 * 60 * 24 * 365;

export function limiteDiario(): number {
  const n = Number(process.env.NOTACERTA_FREE_LIMIT_DIARIO ?? "1");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

type Registro = { dia: string; total: number };
const contadores = new Map<string, Registro>();

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Limpeza preguiçosa para o Map não crescer sem limite. */
function limparAntigos(): void {
  if (contadores.size < 5000) return;
  const d = hoje();
  for (const [k, v] of contadores) if (v.dia !== d) contadores.delete(k);
}

export function gerarIdDispositivo(): string {
  return crypto.randomUUID();
}

export function usosHoje(id: string): number {
  const r = contadores.get(id);
  return r && r.dia === hoje() ? r.total : 0;
}

/** Tenta consumir uma correção. Retorna false se o limite diário já foi atingido. */
export function consumirUso(id: string): boolean {
  limparAntigos();
  const atual = usosHoje(id);
  if (atual >= limiteDiario()) return false;
  contadores.set(id, { dia: hoje(), total: atual + 1 });
  return true;
}

/** Devolve a correção ao saldo (quando a chamada ao modelo falhou e o aluno não recebeu nada). */
export function devolverUso(id: string): void {
  const atual = usosHoje(id);
  if (atual > 0) contadores.set(id, { dia: hoje(), total: atual - 1 });
}

export function cookieDispositivo(id: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_DISPOSITIVO}=${id}; Path=/; Max-Age=${UM_ANO_S}; SameSite=Lax; HttpOnly${secure}`;
}
