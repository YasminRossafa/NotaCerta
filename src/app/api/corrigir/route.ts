import { NextResponse, type NextRequest } from "next/server";
import { EntradaSchema, TEXTO_MINIMO, type ErroApi } from "@/lib/schema";
import { ErroCorretor, corrigirRedacao } from "@/lib/server/corretor";
import { chaveConfigurada } from "@/lib/ai/provider";
import {
  COOKIE_DISPOSITIVO,
  consumirUso,
  cookieDispositivo,
  devolverUso,
  gerarIdDispositivo,
  limiteDiario,
} from "@/lib/server/rate-limit";

/**
 * POST /api/corrigir — spec §9.
 * Único ponto de contato com a Anthropic. Não loga o conteúdo da redação (spec §14).
 */

export const maxDuration = 120; // segundos — correção com visão pode levar ~1 min

const STATUS_POR_ERRO: Record<ErroCorretor["codigo"], number> = {
  configuracao: 500,
  api_indisponivel: 503,
  saida_invalida: 502,
  entrada_invalida: 400,
};

function responderErro(corpo: ErroApi, status: number, cookie?: string): NextResponse<ErroApi> {
  const res = NextResponse.json(corpo, { status });
  if (cookie) res.headers.set("Set-Cookie", cookie);
  return res;
}

export async function POST(request: NextRequest) {
  // 0. Identidade anônima por dispositivo (cookie HttpOnly).
  let idDispositivo = request.cookies.get(COOKIE_DISPOSITIVO)?.value;
  let cookieNovo: string | undefined;
  if (!idDispositivo || !/^[0-9a-f-]{36}$/i.test(idDispositivo)) {
    idDispositivo = gerarIdDispositivo();
    cookieNovo = cookieDispositivo(idDispositivo);
  }

  // 1. Entrada
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return responderErro(
      { erro: "entrada_invalida", mensagem: "Corpo da requisição inválido (JSON esperado)." },
      400,
      cookieNovo,
    );
  }

  const entrada = EntradaSchema.safeParse(json);
  if (!entrada.success) {
    return responderErro(
      {
        erro: "entrada_invalida",
        mensagem: entrada.error.issues[0]?.message ?? "Dados inválidos.",
      },
      400,
      cookieNovo,
    );
  }

  if (entrada.data.texto && entrada.data.texto.length < TEXTO_MINIMO) {
    return responderErro(
      { erro: "texto_curto", mensagem: "O texto é curto demais para ser uma redação." },
      422,
      cookieNovo,
    );
  }

  if (!chaveConfigurada()) {
    return responderErro(
      { erro: "configuracao", mensagem: "Servidor sem chave da API configurada." },
      500,
      cookieNovo,
    );
  }

  // 2. Rate limit por dispositivo
  if (!consumirUso(idDispositivo)) {
    return responderErro(
      {
        erro: "limite_diario",
        mensagem: "Você já usou sua correção gratuita de hoje.",
        upgrade: true,
        limite: limiteDiario(),
      },
      429,
      cookieNovo,
    );
  }

  // 3–5. Modelo → normalização → validação (dentro de corrigirRedacao)
  try {
    const correcao = await corrigirRedacao(entrada.data);
    const res = NextResponse.json(correcao, { status: 200 });
    if (cookieNovo) res.headers.set("Set-Cookie", cookieNovo);
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    devolverUso(idDispositivo); // o aluno não recebeu nada: não cobrar do saldo diário
    const erro =
      e instanceof ErroCorretor
        ? e
        : new ErroCorretor("api_indisponivel", "Falha inesperada ao corrigir.");
    // Log sem conteúdo da redação (spec §14).
    console.error(`[api/corrigir] ${erro.codigo}: ${erro.message}`);
    return responderErro(
      { erro: erro.codigo, mensagem: erro.message },
      STATUS_POR_ERRO[erro.codigo],
      cookieNovo,
    );
  }
}
