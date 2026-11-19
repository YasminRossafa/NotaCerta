"use client";

import { useId, useRef, useState } from "react";
import { IconeCheck, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { ErroImagem, prepararImagem, type ImagemPreparada } from "@/lib/imagem";

/**
 * Upload da foto da redação manuscrita. No celular abre a câmera
 * (capture="environment"); em qualquer dispositivo aceita arrastar e soltar ou
 * escolher da galeria. A imagem é comprimida no cliente.
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
  const [arrastando, setArrastando] = useState(false);
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
        <figure className="border-borda overflow-hidden rounded-[14px] border">
          <div className="bg-cinza-fundo relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagem.previewUrl}
              alt="Prévia da foto da redação enviada"
              className="max-h-[320px] w-full object-contain"
            />
            <span className="bg-verde absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-[var(--shadow-1)]">
              <IconeCheck width={18} height={18} strokeWidth={3} titulo="Foto pronta" />
            </span>
          </div>
          <figcaption className="text-slate flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <span>
              {imagem.largura}×{imagem.altura}px · pronta para enviar
            </span>
            <span className="flex gap-3">
              <button
                type="button"
                onClick={() => inputArquivo.current?.click()}
                className="text-azul min-h-[44px] font-bold"
              >
                Trocar
              </button>
              <button
                type="button"
                onClick={() => aoMudar(null)}
                className="text-vermelho-texto inline-flex min-h-[44px] items-center gap-1 font-bold"
              >
                <IconeX width={16} height={16} />
                Remover
              </button>
            </span>
          </figcaption>
        </figure>
      ) : (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={(e) => {
            // Só desliga quando o ponteiro sai da área, não ao passar por um filho.
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setArrastando(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setArrastando(false);
            tratar(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "rounded-[14px] border-2 border-dashed px-4 py-8 text-center transition-[background-color,border-color,transform] duration-200",
            arrastando
              ? "border-azul bg-azul-claro text-azul-escuro scale-[1.01]"
              : "border-trilho bg-cinza-fundo text-slate hover:border-azul hover:bg-azul-claro hover:text-azul-escuro",
          )}
        >
          <p className="font-semibold">
            {arrastando ? "Solte a foto aqui" : "Arraste a foto da redação ou escolha abaixo"}
          </p>
          <p id={descId} className="text-slate mx-auto mt-1 max-w-sm text-[13px]">
            Boa luz, folha inteira no quadro, sem sombra. Nós transcrevemos antes de corrigir.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => inputCamera.current?.click()}
              disabled={processando}
              className="bg-azul inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-bold text-white disabled:opacity-60 sm:hidden"
            >
              Tirar foto
            </button>
            <button
              type="button"
              onClick={() => inputArquivo.current?.click()}
              disabled={processando}
              className="bg-superficie border-borda text-navy inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm font-bold disabled:opacity-60"
            >
              {processando ? "Processando…" : "Escolher arquivo"}
            </button>
          </div>
        </div>
      )}

      {mensagemErro && (
        <p role="alert" className="text-vermelho-texto text-[13px] font-semibold">
          {mensagemErro}
        </p>
      )}
    </div>
  );
}
