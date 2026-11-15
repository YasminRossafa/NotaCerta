import "server-only";

/**
 * Rate limit por dispositivo (spec §13): cookie anônimo `nc_did` + contador mensal em memória.
 * Reseta no mês civil (ex.: virou dia 1, o contador zera).
 *
 * TODO(claudia): em serverless (Vercel) a memória não é compartilhada entre instâncias nem
 * sobrevive a cold starts, então este limite é "melhor esforço". Para valer de verdade,
 * trocar o Map por um store externo (Upstash Redis / Vercel KV) mantendo esta interface.
 */

export const COOKIE_DISPOSITIVO = "nc_did";
const UM_ANO_S = 60 * 60 * 24 * 365;

export function limiteMensal(): number {
  const n = Number(process.env.NOTACERTA_FREE_LIMIT_MENSAL ?? "2");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 2;
}

type Registro = { mes: string; total: number };
const contadores = new Map<string, Registro>();

function mesAtual(): string {
  return new Date().toISOString().slice(0, 7);
}

/** Limpeza preguiçosa para o Map não crescer sem limite. */
function limparAntigos(): void {
  if (contadores.size < 5000) return;
  const m = mesAtual();
  for (const [k, v] of contadores) if (v.mes !== m) contadores.delete(k);
}

export function gerarIdDispositivo(): string {
  return crypto.randomUUID();
}

export function usosNoMes(id: string): number {
  const r = contadores.get(id);
  return r && r.mes === mesAtual() ? r.total : 0;
}

/** Tenta consumir uma correção. Retorna false se o limite mensal já foi atingido. */
export function consumirUso(id: string): boolean {
  limparAntigos();
  const atual = usosNoMes(id);
  if (atual >= limiteMensal()) return false;
  contadores.set(id, { mes: mesAtual(), total: atual + 1 });
  return true;
}

/** Devolve a correção ao saldo (quando a chamada ao modelo falhou e o aluno não recebeu nada). */
export function devolverUso(id: string): void {
  const atual = usosNoMes(id);
  if (atual > 0) contadores.set(id, { mes: mesAtual(), total: atual - 1 });
}

export function cookieDispositivo(id: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_DISPOSITIVO}=${id}; Path=/; Max-Age=${UM_ANO_S}; SameSite=Lax; HttpOnly${secure}`;
}
