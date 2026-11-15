import "server-only";

/**
 * Abstração de provedor de IA (spec §5/§9, generalizada): a rota /api/corrigir não fala
 * diretamente com nenhum SDK — chama `corrigirRedacao` de um `AiProvider`, escolhido por
 * `AI_PROVIDER`. Isso permite trocar Anthropic por Gemini (camada gratuita) sem tocar na
 * lógica de normalização/validação, que fica em `lib/server/corretor.ts`.
 *
 * Cada implementação devolve o JSON **bruto** (string) que o modelo produziu — a validação
 * com Zod e o reparo de 1 tentativa acontecem em `corretor.ts`, iguais para qualquer provedor.
 */

export type EntradaProvider = {
  systemPrompt: string;
  userContent: string;
  imageBase64?: string;
  imageMime?: string;
};

export interface AiProvider {
  corrigirRedacao(entrada: EntradaProvider): Promise<string>;
}

export type CodigoErroProvider = "configuracao" | "limite_taxa" | "recusado" | "indisponivel";

export class ErroProvider extends Error {
  constructor(
    public codigo: CodigoErroProvider,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ErroProvider";
  }
}

/** Nome do provedor configurado (não lança; usado para checagens leves antes de consumir cota). */
export function nomeProvider(): string {
  return (process.env.AI_PROVIDER || "gemini").trim().toLowerCase();
}

/** true se a chave do provedor selecionado está presente — checagem leve pré-rate-limit. */
export function chaveConfigurada(): boolean {
  const nome = nomeProvider();
  if (nome === "anthropic") return Boolean(process.env.ANTHROPIC_API_KEY);
  if (nome === "gemini") return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL);
  return false;
}

let providerCache: AiProvider | null = null;

/** Lê `AI_PROVIDER` ("gemini" | "anthropic") e devolve a implementação correspondente. */
export async function obterProvider(): Promise<AiProvider> {
  if (providerCache) return providerCache;

  const nome = nomeProvider();
  if (nome === "anthropic") {
    const { AnthropicProvider } = await import("@/lib/ai/anthropic-provider");
    providerCache = new AnthropicProvider();
  } else if (nome === "gemini") {
    const { GeminiProvider } = await import("@/lib/ai/gemini-provider");
    providerCache = new GeminiProvider();
  } else {
    throw new ErroProvider(
      "configuracao",
      `AI_PROVIDER inválido: "${nome}". Use "gemini" ou "anthropic".`,
    );
  }
  return providerCache;
}
