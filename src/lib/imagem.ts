/**
 * Preparo da foto no cliente: redimensiona e comprime para JPEG antes de enviar,
 * mantendo o corpo da requisição pequeno (limite de 4,5 MB na Vercel).
 */

export const LADO_MAXIMO = 1800;
export const QUALIDADE_JPEG = 0.85;
export const TAMANHO_MAXIMO_BYTES = 3_500_000; // após compressão

export type ImagemPreparada = {
  base64: string; // sem o prefixo data:
  mime: "image/jpeg";
  previewUrl: string;
  largura: number;
  altura: number;
};

export class ErroImagem extends Error {
  constructor(
    public codigo: "formato" | "decodificacao" | "tamanho",
    mensagem: string,
  ) {
    super(mensagem);
  }
}

async function decodificar(arquivo: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(arquivo, { imageOrientation: "from-image" });
    } catch {
      /* cai para <img> */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ErroImagem("decodificacao", "Não conseguimos abrir essa imagem."));
    };
    img.src = url;
  });
}

export async function prepararImagem(arquivo: File): Promise<ImagemPreparada> {
  if (!arquivo.type.startsWith("image/")) {
    throw new ErroImagem("formato", "Envie uma imagem (JPG, PNG ou WEBP).");
  }

  const fonte = await decodificar(arquivo);
  const w0 = "width" in fonte ? fonte.width : 0;
  const h0 = "height" in fonte ? fonte.height : 0;
  if (!w0 || !h0) throw new ErroImagem("decodificacao", "Não conseguimos abrir essa imagem.");

  const escala = Math.min(1, LADO_MAXIMO / Math.max(w0, h0));
  const largura = Math.round(w0 * escala);
  const altura = Math.round(h0 * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ErroImagem("decodificacao", "Seu navegador não suporta processar a imagem.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, largura, altura);
  ctx.drawImage(fonte, 0, 0, largura, altura);
  if ("close" in fonte) fonte.close();

  const dataUrl = canvas.toDataURL("image/jpeg", QUALIDADE_JPEG);
  const base64 = dataUrl.split(",")[1] ?? "";
  const bytes = Math.floor((base64.length * 3) / 4);
  if (bytes > TAMANHO_MAXIMO_BYTES) {
    throw new ErroImagem("tamanho", "A foto ficou grande demais. Tente enquadrar só a folha.");
  }

  return { base64, mime: "image/jpeg", previewUrl: dataUrl, largura, altura };
}
