import { z } from "zod";

/**
 * Contrato entre a API e a UI (spec §12).
 *
 * Há dois schemas:
 *  - `CorrecaoModeloSchema`: o que o modelo deve produzir (saída estruturada). Sem refinamentos
 *    numéricos, porque o JSON Schema das saídas estruturadas aceita um subconjunto do Zod.
 *  - `CorrecaoSchema`: validação estrita usada pela API antes de responder e pela UI antes de
 *    renderizar (notas em múltiplos de 40, etc.).
 */

export const CODIGOS = ["c1", "c2", "c3", "c4", "c5"] as const;
export const TIPOS_PARAGRAFO = [
  "introducao",
  "desenvolvimento1",
  "desenvolvimento2",
  "conclusao",
] as const;
export const STATUS_PARAGRAFO = ["adequado", "ajustes", "incompleto"] as const;

const CompetenciaModelo = z.object({
  nota: z.number().int().describe("Nota de 0 a 200 em múltiplos de 40 (0, 40, 80, 120, 160, 200)."),
  justificativa: z.string().describe("Uma linha explicando a nota, em tom de professor."),
});

const ApontamentoModelo = z.object({
  trecho: z.string().describe("Trecho EXATO copiado do texto do aluno (para destacar na tela)."),
  problema: z.string().describe("O que está errado, em uma frase objetiva."),
  motivo: z.string().describe("POR QUE é um problema segundo o método. Obrigatório, específico."),
  competencia: z.enum(CODIGOS).describe("Competência afetada."),
});

const ItemChecklistModelo = z.object({
  item: z.string().describe("Item do modelo do parágrafo, ex.: 'Motivo explícito (porque/pois)'."),
  ok: z.boolean(),
  observacao: z
    .string()
    .nullable()
    .describe("Observação curta quando ok=false; null se não houver."),
});

const ParagrafoModelo = z.object({
  tipo: z.enum(TIPOS_PARAGRAFO),
  textoOriginal: z.string().describe("Texto do parágrafo exatamente como o aluno escreveu."),
  status: z.enum(STATUS_PARAGRAFO),
  apontamentos: z.array(ApontamentoModelo).describe("Vazio se o parágrafo estiver adequado."),
  reescrita: z
    .string()
    .nullable()
    .describe(
      "Versão melhorada do parágrafo seguindo o método; null se não houver o que reescrever.",
    ),
  checklistModelo: z.array(ItemChecklistModelo),
});

export const CorrecaoModeloSchema = z.object({
  tema: z.string().describe("Tema da redação (informado ou inferido)."),
  temaDetectado: z.boolean().describe("true se o tema foi inferido do texto."),
  transcricao: z
    .string()
    .nullable()
    .describe("Transcrição fiel quando a entrada foi imagem; null quando veio texto."),
  completa: z.boolean().describe("false se faltam parágrafos (menos de 4)."),
  competencias: z.object({
    c1: CompetenciaModelo,
    c2: CompetenciaModelo,
    c3: CompetenciaModelo,
    c4: CompetenciaModelo,
    c5: CompetenciaModelo,
  }),
  notaTotal: z.number().int().nullable().describe("Soma das competências; null se !completa."),
  paragrafos: z.array(ParagrafoModelo),
  repertorioSugestoes: z
    .array(
      z.object({
        id: z.string().describe("id de um item do ACERVO fornecido. Nunca inventar."),
        porqueCombina: z
          .string()
          .describe("1 frase: por que esse repertório serve para ESTE tema."),
      }),
    )
    .describe("2 a 3 itens do acervo."),
  resumoProfessor: z.string().describe("Parágrafo final, tom humano de professor."),
});

export type CorrecaoModelo = z.infer<typeof CorrecaoModeloSchema>;

/* ----------------------------- schema estrito ----------------------------- */

const NotaCompetencia = z
  .number()
  .int()
  .min(0)
  .max(200)
  .refine((n) => n % 40 === 0, "Nota deve ser múltiplo de 40");

export const CompetenciaSchema = z.object({
  nota: NotaCompetencia,
  justificativa: z.string().min(1),
});

export const ApontamentoSchema = z.object({
  trecho: z.string().min(1),
  problema: z.string().min(1),
  motivo: z.string().min(1),
  competencia: z.enum(CODIGOS),
});

export const ParagrafoSchema = z.object({
  tipo: z.enum(TIPOS_PARAGRAFO),
  textoOriginal: z.string(),
  status: z.enum(STATUS_PARAGRAFO),
  apontamentos: z.array(ApontamentoSchema),
  reescrita: z.string().nullable(),
  checklistModelo: z.array(
    z.object({
      item: z.string().min(1),
      ok: z.boolean(),
      observacao: z.string().optional(),
    }),
  ),
});

export const CorrecaoSchema = z.object({
  tema: z.string().min(1),
  temaDetectado: z.boolean(),
  transcricao: z.string().nullable(),
  completa: z.boolean(),
  competencias: z.object({
    c1: CompetenciaSchema,
    c2: CompetenciaSchema,
    c3: CompetenciaSchema,
    c4: CompetenciaSchema,
    c5: CompetenciaSchema,
  }),
  notaTotal: z.number().int().min(0).max(1000).nullable(),
  paragrafos: z.array(ParagrafoSchema).min(1).max(6),
  repertorioSugestoes: z
    .array(z.object({ id: z.string().min(1), porqueCombina: z.string().min(1) }))
    .max(5), // 3 no grátis, 5 no Plano Fundador (spec §18.4) — ver lib/server/corretor.ts
  resumoProfessor: z.string().min(1),
});

export type Correcao = z.infer<typeof CorrecaoSchema>;
export type Competencia = z.infer<typeof CompetenciaSchema>;
export type Apontamento = z.infer<typeof ApontamentoSchema>;
export type Paragrafo = z.infer<typeof ParagrafoSchema>;
export type TipoParagrafo = Paragrafo["tipo"];
export type StatusParagrafo = Paragrafo["status"];

/* ------------------------------ entrada da API ----------------------------- */

export const MIMES_IMAGEM = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const TEXTO_MINIMO = 200;
export const TEXTO_MAXIMO = 12000;

export const EntradaSchema = z
  .object({
    tema: z.string().trim().max(300).optional(),
    texto: z.string().trim().max(TEXTO_MAXIMO).optional(),
    imagemBase64: z.string().max(9_000_000).optional(),
    imagemMime: z.enum(MIMES_IMAGEM).optional(),
  })
  .refine((e) => Boolean(e.texto) || Boolean(e.imagemBase64), {
    message: "Envie o texto da redação ou uma foto.",
  })
  .refine((e) => !e.imagemBase64 || Boolean(e.imagemMime), {
    message: "Informe o tipo da imagem (imagemMime).",
  });

export type Entrada = z.infer<typeof EntradaSchema>;

/* ------------------------------- erros da API ------------------------------ */

export const CODIGOS_ERRO = [
  "entrada_invalida",
  "texto_curto",
  "limite_mensal",
  "imagem_ilegivel",
  "nao_e_redacao",
  "saida_invalida",
  "api_indisponivel",
  "configuracao",
] as const;

export const ErroApiSchema = z.object({
  erro: z.enum(CODIGOS_ERRO),
  mensagem: z.string(),
  upgrade: z.boolean().optional(),
  limite: z.number().optional(),
});
export type ErroApi = z.infer<typeof ErroApiSchema>;

export const ROTULO_PARAGRAFO: Record<TipoParagrafo, string> = {
  introducao: "Introdução",
  desenvolvimento1: "Desenvolvimento 1",
  desenvolvimento2: "Desenvolvimento 2",
  conclusao: "Conclusão",
};
