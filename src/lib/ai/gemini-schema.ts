import { Type, type Schema } from "@google/genai";
import { CODIGOS, STATUS_PARAGRAFO, TIPOS_PARAGRAFO } from "@/lib/schema";

/**
 * Equivalente, em `responseSchema` do Gemini, ao `CorrecaoModeloSchema` de `lib/schema.ts`
 * (spec §12). O formato de schema do Gemini é um subconjunto de OpenAPI — sem `$ref`, sem
 * uniões — por isso é escrito à mão aqui em vez de convertido automaticamente do Zod.
 */

const competencia: Schema = {
  type: Type.OBJECT,
  properties: {
    nota: {
      type: Type.NUMBER,
      description: "Nota de 0 a 200 em múltiplos de 40 (0, 40, 80, 120, 160, 200).",
    },
    justificativa: {
      type: Type.STRING,
      description: "Uma linha explicando a nota, em tom de professor.",
    },
  },
  required: ["nota", "justificativa"],
};

const apontamento: Schema = {
  type: Type.OBJECT,
  properties: {
    trecho: {
      type: Type.STRING,
      description: "Trecho EXATO copiado do texto do aluno (para destacar na tela).",
    },
    problema: { type: Type.STRING, description: "O que está errado, em uma frase objetiva." },
    motivo: {
      type: Type.STRING,
      description: "POR QUE é um problema segundo o método. Obrigatório, específico.",
    },
    competencia: {
      type: Type.STRING,
      enum: [...CODIGOS],
      description: "Competência afetada.",
    },
  },
  required: ["trecho", "problema", "motivo", "competencia"],
};

const itemChecklist: Schema = {
  type: Type.OBJECT,
  properties: {
    item: {
      type: Type.STRING,
      description: "Item do modelo do parágrafo, ex.: 'Motivo explícito (porque/pois)'.",
    },
    ok: { type: Type.BOOLEAN },
    observacao: {
      type: Type.STRING,
      nullable: true,
      description: "Observação curta quando ok=false; null se não houver.",
    },
  },
  required: ["item", "ok", "observacao"],
};

const paragrafo: Schema = {
  type: Type.OBJECT,
  properties: {
    tipo: { type: Type.STRING, enum: [...TIPOS_PARAGRAFO] },
    textoOriginal: {
      type: Type.STRING,
      description: "Texto do parágrafo exatamente como o aluno escreveu.",
    },
    status: { type: Type.STRING, enum: [...STATUS_PARAGRAFO] },
    apontamentos: {
      type: Type.ARRAY,
      items: apontamento,
      description: "Vazio se o parágrafo estiver adequado.",
    },
    reescrita: {
      type: Type.STRING,
      nullable: true,
      description:
        "Versão melhorada do parágrafo seguindo o método; null se não houver o que reescrever.",
    },
    checklistModelo: { type: Type.ARRAY, items: itemChecklist },
  },
  required: ["tipo", "textoOriginal", "status", "apontamentos", "reescrita", "checklistModelo"],
};

export const correcaoModeloResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tema: { type: Type.STRING, description: "Tema da redação (informado ou inferido)." },
    temaDetectado: { type: Type.BOOLEAN, description: "true se o tema foi inferido do texto." },
    transcricao: {
      type: Type.STRING,
      nullable: true,
      description: "Transcrição fiel quando a entrada foi imagem; null quando veio texto.",
    },
    completa: { type: Type.BOOLEAN, description: "false se faltam parágrafos (menos de 4)." },
    competencias: {
      type: Type.OBJECT,
      properties: {
        c1: competencia,
        c2: competencia,
        c3: competencia,
        c4: competencia,
        c5: competencia,
      },
      required: ["c1", "c2", "c3", "c4", "c5"],
    },
    notaTotal: {
      type: Type.NUMBER,
      nullable: true,
      description: "Soma das competências; null se !completa.",
    },
    paragrafos: { type: Type.ARRAY, items: paragrafo },
    repertorioSugestoes: {
      type: Type.ARRAY,
      description: "Itens do acervo: 2 a 3 no plano grátis, 4 a 5 no Plano Fundador.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "id de um item do ACERVO fornecido. Nunca inventar.",
          },
          porqueCombina: {
            type: Type.STRING,
            description: "1 frase: por que esse repertório serve para ESTE tema.",
          },
        },
        required: ["id", "porqueCombina"],
      },
    },
    resumoProfessor: {
      type: Type.STRING,
      description: "Parágrafo final, tom humano de professor.",
    },
  },
  required: [
    "tema",
    "temaDetectado",
    "transcricao",
    "completa",
    "competencias",
    "notaTotal",
    "paragrafos",
    "repertorioSugestoes",
    "resumoProfessor",
  ],
};
