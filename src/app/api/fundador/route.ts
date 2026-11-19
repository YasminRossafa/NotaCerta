import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  COOKIE_FUNDADOR,
  cookieFundador,
  cookieFundadorLimpo,
  emailEhFundador,
  verificarCookie,
} from "@/lib/server/fundador";

/**
 * /api/fundador — acesso de demonstração ao "Plano Fundador" (spec §18.4), não é autenticação
 * real: sem senha, sem conta, sem banco de dados. Só confirma que o e-mail está na lista
 * `FOUNDER_EMAILS` do servidor e marca/lê um cookie assinado neste navegador.
 */

const CorpoSchema = z.object({ email: z.string().trim().min(1) });

export async function POST(request: NextRequest) {
  const json: unknown = await request.json().catch(() => null);
  const entrada = CorpoSchema.safeParse(json);
  const email = entrada.success ? entrada.data.email.trim().toLowerCase() : "";

  if (!entrada.success || !emailEhFundador(email)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.headers.set("Set-Cookie", cookieFundador(email));
    return res;
  } catch {
    // FOUNDER_COOKIE_SECRET ausente — erro de configuração do servidor, não do usuário.
    console.error("[api/fundador] FOUNDER_COOKIE_SECRET não configurado.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const valor = request.cookies.get(COOKIE_FUNDADOR)?.value;
  let fundador = false;
  try {
    fundador = verificarCookie(valor);
  } catch {
    fundador = false;
  }
  const res = NextResponse.json({ fundador });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookieFundadorLimpo());
  return res;
}
