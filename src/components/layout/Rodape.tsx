import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { AvisoNotaEstimada } from "@/components/ui/Aviso";
import { NAV_LINKS, SITE } from "@/lib/site";

// Constante para manter o rodapé estático sob Cache Components (sem Date no render).
const ANO_ATUAL = 2026;

export function Rodape() {
  return (
    <footer className="mt-auto border-t border-borda/60 bg-cinza-fundo">
      <div className="container-nc grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-md">
          <Logo />
          <p className="mt-3 text-sm text-slate">{SITE.slogan}</p>
          <AvisoNotaEstimada className="mt-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-navy">Navegar</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate hover:text-azul-escuro">
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy">Confiança</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/privacidade" className="text-slate hover:text-azul-escuro">
                Privacidade (LGPD)
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.contatoEmail}`} className="text-slate hover:text-azul-escuro">
                Contato
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-borda/60">
        <p className="container-nc py-4 text-xs text-slate">
          © {ANO_ATUAL} NotaCerta. Método de correção baseado na apostila do CEC
          (Cursinho Educação e Cidadania), UFSCar Sorocaba.
        </p>
      </div>
    </footer>
  );
}
