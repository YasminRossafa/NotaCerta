"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { Carregando } from "@/components/corrigir/Carregando";
import { SeletorTema } from "@/components/corrigir/SeletorTema";
import { UploadFoto } from "@/components/corrigir/UploadFoto";
import { ModalUpgrade, type MotivoUpgrade } from "@/components/freemium/ModalUpgrade";
import { AreaTexto } from "@/components/ui/AreaTexto";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { IconeCamera, IconeSeta, IconeTexto } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import {
  lerRascunho,
  limparRascunho,
  podeCorrigirGratis,
  registrarUso,
  salvarRascunho,
} from "@/lib/freemium";
import type { ImagemPreparada } from "@/lib/imagem";
import { salvarResultado } from "@/lib/resultado-store";
import { CorrecaoSchema, ErroApiSchema, TEXTO_MAXIMO, TEXTO_MINIMO } from "@/lib/schema";
import { useSnapshotCliente } from "@/lib/use-cliente";

type Modo = "texto" | "foto";

type ErroForm = { tema?: string; texto?: string; imagem?: string };

const MENSAGENS_ERRO_API: Record<string, string> = {
  entrada_invalida: "Confira os campos e tente de novo.",
  texto_curto: "O texto é curto demais para ser uma redação. Cole a redação completa.",
  imagem_ilegivel: "Não conseguimos ler a foto. Tente outra com mais luz e a folha inteira no quadro.",
  nao_e_redacao: "O conteúdo enviado não parece uma redação dissertativa. Confira o texto ou a foto.",
  saida_invalida: "A correção veio incompleta. Tente novamente em alguns segundos.",
  api_indisponivel: "O corretor está fora do ar neste momento. Tente de novo em instantes.",
  configuracao: "O servidor não está configurado (chave da API ausente).",
};

export function FormularioCorrigir() {
  const router = useRouter();
  const tabsId = useId();

  const [modo, setModo] = useState<Modo>("texto");
  const [tema, setTema] = useState("");
  const [detectar, setDetectar] = useState(false);
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState<ImagemPreparada | null>(null);
  const [erros, setErros] = useState<ErroForm>({});
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [modal, setModal] = useState<{ aberto: boolean; motivo: MotivoUpgrade }>({
    aberto: false,
    motivo: "limite",
  });
  const [rascunhoIgnorado, setRascunhoIgnorado] = useState(false);

  // Rascunho salvo (hidratação segura: no servidor é null).
  const rascunhoRaw = useSnapshotCliente(() => {
    const r = lerRascunho();
    return r ? JSON.stringify(r) : null;
  }, null);
  const rascunho = rascunhoRaw ? (JSON.parse(rascunhoRaw) as { tema: string; texto: string }) : null;
  const mostrarRascunho = Boolean(rascunho && !rascunhoIgnorado && !texto && !tema);

  // Salva rascunho (debounce) — sincroniza com sistema externo, sem setState.
  useEffect(() => {
    if (!texto && !tema) return;
    const t = window.setTimeout(() => salvarRascunho({ tema, texto }), 600);
    return () => window.clearTimeout(t);
  }, [tema, texto]);

  function validar(): boolean {
    const e: ErroForm = {};
    if (!detectar && tema.trim().length < 5) e.tema = "Informe o tema ou marque “detectar pelo texto”.";
    if (modo === "texto") {
      if (texto.trim().length < TEXTO_MINIMO)
        e.texto = `Texto muito curto para uma redação (mínimo ${TEXTO_MINIMO} caracteres).`;
      if (texto.length > TEXTO_MAXIMO) e.texto = "Texto longo demais. Uma redação do ENEM tem até 30 linhas.";
    } else if (!imagem) {
      e.imagem = "Envie a foto da redação.";
    }
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function enviar(ev: FormEvent) {
    ev.preventDefault();
    setErroApi(null);
    if (!validar()) return;

    if (!podeCorrigirGratis()) {
      setModal({ aberto: true, motivo: "limite" });
      return;
    }

    setEnviando(true);
    try {
      const corpo =
        modo === "texto"
          ? { tema: detectar ? undefined : tema.trim(), texto: texto.trim() }
          : {
              tema: detectar ? undefined : tema.trim(),
              imagemBase64: imagem!.base64,
              imagemMime: imagem!.mime,
            };

      const resp = await fetch("/api/corrigir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });

      const json: unknown = await resp.json().catch(() => null);

      if (!resp.ok) {
        const erro = ErroApiSchema.safeParse(json);
        if (resp.status === 429 && erro.success && erro.data.erro === "limite_diario") {
          setModal({ aberto: true, motivo: "limite" });
          return;
        }
        const codigo = erro.success ? erro.data.erro : "api_indisponivel";
        setErroApi(
          MENSAGENS_ERRO_API[codigo] ??
            (erro.success ? erro.data.mensagem : "Algo deu errado. Tente novamente."),
        );
        return;
      }

      const parsed = CorrecaoSchema.safeParse(json);
      if (!parsed.success) {
        setErroApi(MENSAGENS_ERRO_API.saida_invalida);
        return;
      }

      registrarUso();
      limparRascunho();
      salvarResultado({ correcao: parsed.data, origem: modo === "foto" ? "imagem" : "texto" });
      router.push("/resultado");
    } catch {
      setErroApi("Sem conexão com o servidor. Verifique sua internet e tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviando) return <Carregando comImagem={modo === "foto"} />;

  const caracteres = texto.length;

  return (
    <form onSubmit={enviar} noValidate className="space-y-6">
      {mostrarRascunho && rascunho && (
        <Aviso tom="info" compacto>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Encontramos um rascunho salvo neste aparelho.</span>
            <span className="flex gap-3">
              <button
                type="button"
                className="min-h-[36px] font-semibold text-azul underline"
                onClick={() => {
                  setTema(rascunho.tema);
                  setTexto(rascunho.texto);
                  setModo("texto");
                }}
              >
                Recuperar
              </button>
              <button
                type="button"
                className="min-h-[36px] text-slate underline"
                onClick={() => {
                  setRascunhoIgnorado(true);
                  limparRascunho();
                }}
              >
                Descartar
              </button>
            </span>
          </div>
        </Aviso>
      )}

      {/* Abas */}
      <div role="tablist" aria-label="Forma de envio" className="grid grid-cols-2 gap-1 rounded-xl bg-cinza-fundo p-1">
        {(
          [
            { id: "texto", rotulo: "Colar texto", Icone: IconeTexto },
            { id: "foto", rotulo: "Enviar foto", Icone: IconeCamera },
          ] as const
        ).map((aba) => (
          <button
            key={aba.id}
            type="button"
            role="tab"
            id={`${tabsId}-tab-${aba.id}`}
            aria-selected={modo === aba.id}
            aria-controls={`${tabsId}-painel-${aba.id}`}
            onClick={() => setModo(aba.id)}
            className={cn(
              "flex min-h-[44px] items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors",
              modo === aba.id ? "bg-white text-azul-escuro shadow-sm" : "text-slate hover:text-navy",
            )}
          >
            <aba.Icone width={18} height={18} />
            {aba.rotulo}
          </button>
        ))}
      </div>

      <SeletorTema
        tema={tema}
        detectar={detectar}
        aoMudarTema={(v) => {
          setTema(v);
          if (erros.tema) setErros((e) => ({ ...e, tema: undefined }));
        }}
        aoMudarDetectar={(v) => {
          setDetectar(v);
          if (v) setErros((e) => ({ ...e, tema: undefined }));
        }}
        erro={erros.tema}
      />

      <div
        role="tabpanel"
        id={`${tabsId}-painel-texto`}
        aria-labelledby={`${tabsId}-tab-texto`}
        hidden={modo !== "texto"}
      >
        <AreaTexto
          rotulo="Texto da redação"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (erros.texto) setErros((er) => ({ ...er, texto: undefined }));
          }}
          placeholder={
            "Cole aqui a redação completa, com os 4 parágrafos (introdução, dois desenvolvimentos e conclusão)."
          }
          contador={`${caracteres.toLocaleString("pt-BR")} caracteres`}
          ajuda="Separe os parágrafos com uma linha em branco. Não guardamos o texto depois da correção."
          erro={erros.texto}
          spellCheck={false}
        />
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-painel-foto`}
        aria-labelledby={`${tabsId}-tab-foto`}
        hidden={modo !== "foto"}
      >
        <UploadFoto
          imagem={imagem}
          aoMudar={(img) => {
            setImagem(img);
            if (img && erros.imagem) setErros((e) => ({ ...e, imagem: undefined }));
          }}
          erro={erros.imagem}
        />
      </div>

      {erroApi && (
        <Aviso tom="erro" titulo="Não foi possível corrigir agora">
          {erroApi}
        </Aviso>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate">
          Grátis: 1 correção completa por dia neste aparelho. Nota estimada, não oficial.
        </p>
        <Botao type="submit" tamanho="lg" className="sm:min-w-[240px]">
          Corrigir redação
          <IconeSeta />
        </Botao>
      </div>

      <ModalUpgrade
        aberto={modal.aberto}
        motivo={modal.motivo}
        aoFechar={() => setModal((m) => ({ ...m, aberto: false }))}
      />
    </form>
  );
}
