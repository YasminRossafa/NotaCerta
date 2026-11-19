import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Cabecalho } from "@/components/layout/Cabecalho";
import { Rodape } from "@/components/layout/Rodape";
import { FundadorProvider } from "@/lib/fundador-context";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  icons: {
    icon: "/notacerta-icone.png",
    shortcut: "/notacerta-icone.png",
    apple: "/notacerta-icone.png",
  },
  title: {
    default: "NotaCerta — Corretor de redação ENEM gratuito com método",
    template: "%s · NotaCerta",
  },
  description: SITE.descricao,
  applicationName: SITE.nome,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    title: "NotaCerta — Corretor de redação ENEM gratuito com método",
    description: SITE.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: "NotaCerta — Corretor de redação ENEM gratuito com método",
    description: SITE.descricao,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <a
          href="#conteudo"
          className="focus:text-azul-escuro sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:shadow"
        >
          Pular para o conteúdo
        </a>
        <FundadorProvider>
          <Cabecalho />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Rodape />
        </FundadorProvider>
      </body>
    </html>
  );
}
