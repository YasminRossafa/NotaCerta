import Link from "next/link";
import { AvisoFundadorRodape } from "@/components/freemium/AvisoFundadorRodape";
import { Logo } from "@/components/layout/Logo";
import { AvisoModoDemonstracao, AvisoNotaEstimada } from "@/components/ui/Aviso";
import { nomeProvider } from "@/lib/ai/provider";
import { NAV_LINKS, SITE } from "@/lib/site";

// Constante para manter o rodapé estático sob Cache Components (sem Date no render).
const ANO_ATUAL = 2026;

export function Rodape() {
  const modoDemonstracao = nomeProvider() === "gemini";

  return (
    <footer className="bg-rodape-fundo mt-auto border-t border-white/10 text-white">
      <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-md">
          <Logo variante="escura" altura={30} />
          <p className="mt-3 text-sm text-white/70">{SITE.slogan}</p>
          <AvisoNotaEstimada className="mt-4" sobreFundoEscuro />
          {modoDemonstracao && <AvisoModoDemonstracao className="mt-2" sobreFundoEscuro />}
          <AvisoFundadorRodape />
        </div>

        <div>
          <p className="text-sm font-bold text-white">Navegar</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[32px] items-center text-white/70 transition-colors hover:text-white"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold text-white">Confiança</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link
                href="/privacidade"
                className="inline-flex min-h-[32px] items-center text-white/70 transition-colors hover:text-white"
              >
                Privacidade (LGPD)
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${SITE.contatoEmail}`}
                className="inline-flex min-h-[32px] items-center text-white/70 transition-colors hover:text-white"
              >
                Contato
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-[1120px] px-5 py-4 text-xs text-white/60">
          © {ANO_ATUAL} NotaCerta. Método de correção baseado na apostila do CEC (Cursinho Educação
          e Cidadania), UFSCar Sorocaba.
        </p>
      </div>
    </footer>
  );
}
