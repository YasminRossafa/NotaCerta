"use client";

import { useId, useRef, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { IconeCamera, IconeUpload, IconeX } from "@/components/ui/Icones";
import { ErroImagem, prepararImagem, type ImagemPreparada } from "@/lib/imagem";

/**
 * Upload da foto da redação manuscrita. No celular abre a câmera (capture="environment");
 * em qualquer dispositivo aceita arquivo da galeria. A imagem é comprimida no cliente.
 */
export function UploadFoto({
  imagem,
  aoMudar,
  erro,
}: {
  imagem: ImagemPreparada | null;
  aoMudar: (img: ImagemPreparada | null) => void;
  erro?: string;
}) {
  const inputCamera = useRef<HTMLInputElement>(null);
  const inputArquivo = useRef<HTMLInputElement>(null);
  const [processando, setProcessando] = useState(false);
  const [erroLocal, setErroLocal] = useState<string | null>(null);
  const descId = useId();

  async function tratar(arquivo: File | undefined) {
    if (!arquivo) return;
    setErroLocal(null);
    setProcessando(true);
    try {
      aoMudar(await prepararImagem(arquivo));
    } catch (e) {
      aoMudar(null);
      setErroLocal(
        e instanceof ErroImagem ? e.message : "Não conseguimos processar a foto. Tente outra.",
      );
    } finally {
      setProcessando(false);
      if (inputCamera.current) inputCamera.current.value = "";
      if (inputArquivo.current) inputArquivo.current.value = "";
    }
  }

  const mensagemErro = erro ?? erroLocal;

  return (
    <div className="space-y-3">
      <input
        ref={inputCamera}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-describedby={descId}
        onChange={(e) => tratar(e.target.files?.[0])}
      />
      <input
        ref={inputArquivo}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-describedby={descId}
        onChange={(e) => tratar(e.target.files?.[0])}
      />

      {imagem ? (
        <figure className="card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagem.previewUrl}
            alt="Prévia da foto da redação enviada"
            className="max-h-[420px] w-full object-contain bg-cinza-fundo"
          />
          <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-slate">
            <span>
              {imagem.largura}×{imagem.altura}px · pronta para enviar
            </span>
            <button
              type="button"
              onClick={() => aoMudar(null)}
              className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-vermelho"
            >
              <IconeX width={16} height={16} />
              Remover
            </button>
          </figcaption>
        </figure>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-borda bg-azul-claro/40 px-4 py-10 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            tratar(e.dataTransfer.files?.[0]);
          }}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-azul shadow-sm">
            <IconeCamera width={28} height={28} />
          </span>
          <div>
            <p className="font-semibold text-navy">Foto da redação manuscrita</p>
            <p id={descId} className="mt-1 text-sm text-slate">
              Boa luz, folha inteira no quadro, sem sombra. Nós transcrevemos antes de corrigir.
            </p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
            <Botao
              onClick={() => inputCamera.current?.click()}
              disabled={processando}
              cheio
              className="sm:hidden"
            >
              <IconeCamera />
              Tirar foto
            </Botao>
            <Botao
              variante="secundario"
              onClick={() => inputArquivo.current?.click()}
              disabled={processando}
              cheio
            >
              <IconeUpload />
              {processando ? "Processando…" : "Escolher arquivo"}
            </Botao>
          </div>
        </div>
      )}

      {mensagemErro && (
        <p role="alert" className="text-sm font-medium text-vermelho">
          {mensagemErro}
        </p>
      )}
    </div>
  );
}
