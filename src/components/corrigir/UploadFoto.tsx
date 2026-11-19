"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import { CheckDesenhado } from "@/components/motion/CheckDesenhado";
import { Botao } from "@/components/ui/Botao";
import { IconeCamera, IconeUpload, IconeX } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import { ErroImagem, prepararImagem, type ImagemPreparada } from "@/lib/imagem";

/**
 * Upload da foto da redação manuscrita. No celular abre a câmera (capture="environment");
 * em qualquer dispositivo aceita arrastar e soltar ou escolher da galeria. A imagem é
 * comprimida no cliente.
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
  const reduzido = useReducedMotion();

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

      <AnimatePresence mode="wait" initial={false}>
        {imagem ? (
          <motion.figure
            key="previa"
            initial={reduzido ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="card overflow-hidden"
          >
            <div className="bg-cinza-fundo relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagem.previewUrl}
                alt="Prévia da foto da redação enviada"
                className="max-h-[420px] w-full object-contain"
              />
              {/* O check da caneta confirmando que a foto está pronta. */}
              <span className="bg-superficie text-verde border-borda absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm">
                <CheckDesenhado tamanho={20} titulo="Foto pronta" />
              </span>
            </div>
            <figcaption className="text-slate flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>
                {imagem.largura}×{imagem.altura}px · pronta para enviar
              </span>
              <span className="flex gap-3">
                <button
                  type="button"
                  onClick={() => inputArquivo.current?.click()}
                  className="text-azul min-h-[44px] font-semibold"
                >
                  Trocar
                </button>
                <button
                  type="button"
                  onClick={() => aoMudar(null)}
                  className="text-vermelho-texto inline-flex min-h-[44px] items-center gap-1 font-semibold"
                >
                  <IconeX width={16} height={16} />
                  Remover
                </button>
              </span>
            </figcaption>
          </motion.figure>
        ) : (
          <motion.div
            key="area"
            initial={false}
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
            animate={reduzido ? undefined : { scale: arrastando ? 1.01 : 1 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors",
              arrastando
                ? "border-azul bg-azul-claro"
                : "border-borda bg-azul-claro/40 hover:border-azul/60",
            )}
          >
            <motion.span
              animate={reduzido ? undefined : { y: arrastando ? -4 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="text-azul bg-superficie flex h-14 w-14 items-center justify-center rounded-full shadow-sm"
            >
              {arrastando ? (
                <IconeUpload width={28} height={28} />
              ) : (
                <IconeCamera width={28} height={28} />
              )}
            </motion.span>
            <div>
              <p className="text-navy font-semibold">
                {arrastando ? "Solte a foto aqui" : "Arraste a foto da redação, ou escolha abaixo"}
              </p>
              <p id={descId} className="text-slate mt-1 text-sm">
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
          </motion.div>
        )}
      </AnimatePresence>

      {mensagemErro && (
        <p role="alert" className="text-vermelho-texto text-sm font-medium">
          {mensagemErro}
        </p>
      )}
    </div>
  );
}
