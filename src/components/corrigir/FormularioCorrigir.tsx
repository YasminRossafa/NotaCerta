"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { ContadorPalavras } from "@/components/corrigir/ContadorPalavras";
import { OverlayCorrigindo } from "@/components/corrigir/OverlayCorrigindo";
import { SeletorTema } from "@/components/corrigir/SeletorTema";
import { UploadFoto } from "@/components/corrigir/UploadFoto";
import { ModalUpgrade, type MotivoUpgrade } from "@/components/freemium/ModalUpgrade";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { IconeSeta } from "@/components/ui/Icones";
import { cn } from "@/lib/cn";
import {
  lerRascunho,
  LIMITE_GRATIS_PADRAO,
  limparRascunho,
  podeCorrigirGratis,
  registrarUso,
  salvarRascunho,
  usosNoMes,
} from "@/lib/freemium";
import { useFundador } from "@/lib/fundador-context";
import { salvarCorrecaoNoHistorico } from "@/lib/historico";
import type { ImagemPreparada } from "@/lib/imagem";
import { salvarResultado } from "@/lib/resultado-store";
import { CorrecaoSchema, ErroApiSchema, TEXTO_MAXIMO, TEXTO_MINIMO } from "@/lib/schema";
import { useSnapshotCliente } from "@/lib/use-cliente";

type Modo = "texto" | "foto";

type ErroForm = { tema?: string; texto?: string; imagem?: string };

const MENSAGENS_ERRO_API: Record<string, string> = {
  entrada_invalida: "Confira os campos e tente de novo.",
  texto_curto: "O texto é curto demais para ser uma redação. Cole a redação completa.",
  imagem_ilegivel:
    "Não conseguimos ler a foto. Tente outra com mais luz e a folha inteira no quadro.",
  nao_e_redacao:
    "O conteúdo enviado não parece uma redação dissertativa. Confira o texto ou a foto.",
  saida_invalida: "A correção veio incompleta. Tente novamente em alguns segundos.",
  api_indisponivel: "O corretor está fora do ar neste momento. Tente de novo em instantes.",
  configuracao:
    "O servidor não está configurado: falta a chave da API. Crie um .env.local com ANTHROPIC_API_KEY (veja o README, seção “Como obter e configurar a chave de API”) e reinicie o servidor.",
};

const ABAS = [
  { id: "texto", rotulo: "Colar texto" },
  { id: "foto", rotulo: "Enviar foto" },
] as const;

export function FormularioCorrigir() {
  const router = useRouter();
  const tabsId = useId();
  const reduzido = useReducedMotion();

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

  // Contador do plano grátis (hidratação segura: no servidor é null).
  const usos = useSnapshotCliente(() => usosNoMes(), null);
  const { fundador } = useFundador();

  // Rascunho salvo (hidratação segura: no servidor é null).
  const rascunhoRaw = useSnapshotCliente(() => {
    const r = lerRascunho();
    return r ? JSON.stringify(r) : null;
  }, null);
  const rascunho = rascunhoRaw
    ? (JSON.parse(rascunhoRaw) as { tema: string; texto: string })
    : null;
  const mostrarRascunho = Boolean(rascunho && !rascunhoIgnorado && !texto && !tema);

  // Salva rascunho (debounce) — sincroniza com sistema externo, sem setState.
  useEffect(() => {
    if (!texto && !tema) return;
    const t = window.setTimeout(() => salvarRascunho({ tema, texto }), 600);
    return () => window.clearTimeout(t);
  }, [tema, texto]);

  function validar(): boolean {
    const e: ErroForm = {};
    if (!detectar && tema.trim().length < 5)
      e.tema = "Informe o tema ou marque “detectar pelo texto”.";
    if (modo === "texto") {
      if (texto.trim().length < TEXTO_MINIMO)
        e.texto = `Texto muito curto para uma redação (mínimo ${TEXTO_MINIMO} caracteres).`;
      if (texto.length > TEXTO_MAXIMO)
        e.texto = "Texto longo demais. Uma redação do ENEM tem até 30 linhas.";
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

    if (!fundador && !podeCorrigirGratis()) {
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
        if (resp.status === 429 && erro.success && erro.data.erro === "limite_mensal") {
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

      if (!fundador) registrarUso();
      limparRascunho();
      salvarResultado({ correcao: parsed.data, origem: modo === "foto" ? "imagem" : "texto" });
      if (fundador) {
        // Histórico (spec "Minha evolução"): só para o Plano Fundador, só neste navegador.
        const textoOriginal = modo === "foto" ? (parsed.data.transcricao ?? "") : texto.trim();
        salvarCorrecaoNoHistorico({ resultado: parsed.data, textoOriginal });
      }
      router.push("/resultado");
    } catch {
      setErroApi("Sem conexão com o servidor. Verifique sua internet e tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <form onSubmit={enviar} noValidate>
        {mostrarRascunho && rascunho && (
          <Aviso tom="info" compacto className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>Encontramos um rascunho salvo neste aparelho.</span>
              <span className="flex gap-3">
                <button
                  type="button"
                  className="text-azul min-h-[36px] font-bold underline"
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
                  className="text-slate min-h-[36px] underline"
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

        {/* Abas: o indicador desliza entre rótulos de larguras diferentes — é
            animação de layout, por isso motion e não CSS. */}
        <div
          role="tablist"
          aria-label="Forma de envio"
          className="bg-cinza-fundo relative inline-flex rounded-full p-1"
        >
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              type="button"
              role="tab"
              id={`${tabsId}-tab-${aba.id}`}
              aria-selected={modo === aba.id}
              aria-controls={`${tabsId}-painel-${aba.id}`}
              onClick={() => setModo(aba.id)}
              className={cn(
                "relative min-h-[44px] rounded-full px-4 text-sm font-bold transition-colors sm:px-[18px]",
                modo === aba.id ? "text-white" : "text-slate hover:text-navy",
              )}
            >
              {modo === aba.id && (
                <motion.span
                  layoutId={`${tabsId}-aba-ativa`}
                  className="bg-navy-fixo dark:bg-azul-acao absolute inset-0 rounded-full shadow-[0_4px_10px_rgb(11_18_32/.3)]"
                  transition={
                    reduzido
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 430, damping: 34, mass: 0.6 }
                  }
                />
              )}
              {/* O rótulo fica acima da pílula que desliza. */}
              <span className="relative">{aba.rotulo}</span>
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`${tabsId}-painel-texto`}
          aria-labelledby={`${tabsId}-tab-texto`}
          hidden={modo !== "texto"}
          className="mt-3.5"
        >
          <div className="relative">
            <label htmlFor={`${tabsId}-texto`} className="sr-only">
              Texto da redação
            </label>
            <textarea
              id={`${tabsId}-texto`}
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                if (erros.texto) setErros((er) => ({ ...er, texto: undefined }));
              }}
              placeholder="Cole sua redação aqui — os 4 parágrafos, separados por uma linha em branco."
              spellCheck={false}
              aria-invalid={erros.texto ? true : undefined}
              aria-describedby={`${tabsId}-ajuda${erros.texto ? ` ${tabsId}-erro` : ""}`}
              className={cn(
                "bg-cinza-fundo text-navy placeholder:text-slate/70 w-full resize-y rounded-[14px] border-2 px-4 pt-3.5 pb-9 text-[15px] leading-relaxed",
                "focus:bg-superficie focus:border-azul focus:ring-azul/15 transition-colors focus:ring-4 focus:outline-none",
                "min-h-[150px] sm:min-h-[180px]",
                erros.texto ? "border-vermelho" : "border-transparent",
              )}
            />
            <ContadorPalavras texto={texto} className="absolute right-3 bottom-2.5" />
          </div>
          <p id={`${tabsId}-ajuda`} className="text-slate mt-2 text-[13px]">
            {fundador
              ? "Esta correção entra no seu histórico de evolução, salvo só neste navegador."
              : "Não guardamos o texto depois da correção."}
          </p>
          {erros.texto && (
            <p
              id={`${tabsId}-erro`}
              role="alert"
              className="text-vermelho-texto mt-1.5 text-[13px] font-semibold"
            >
              {erros.texto}
            </p>
          )}
        </div>

        <div
          role="tabpanel"
          id={`${tabsId}-painel-foto`}
          aria-labelledby={`${tabsId}-tab-foto`}
          hidden={modo !== "foto"}
          className="mt-3.5"
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

        <div className="mt-3.5">
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
        </div>

        {erroApi && (
          <Aviso tom="erro" titulo="Não foi possível corrigir agora" className="mt-4">
            {erroApi}
          </Aviso>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Botao type="submit" tamanho="lg" className="group">
            Corrigir minha redação
            <IconeSeta className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </Botao>
          <small className="text-slate font-medium">
            {fundador
              ? "Plano Fundador: correções ilimitadas"
              : `Grátis: ${Math.min(usos ?? 0, LIMITE_GRATIS_PADRAO)} de ${LIMITE_GRATIS_PADRAO} correções neste mês`}
          </small>
        </div>
      </form>

      {enviando && <OverlayCorrigindo comImagem={modo === "foto"} />}

      {/* Fora do <form>: o modal tem seu próprio formulário de e-mail (sem <form> aninhado). */}
      <ModalUpgrade
        aberto={modal.aberto}
        motivo={modal.motivo}
        aoFechar={() => setModal((m) => ({ ...m, aberto: false }))}
      />
    </>
  );
}
