export const SITE = {
  nome: "NotaCerta",
  slogan: "Correção de redação ENEM com método, não com achismo.",
  descricao:
    "Corretor de redação ENEM gratuito com feedback pedagógico: nota estimada por competência, erros explicados com o motivo, reescrita que ensina e repertório curado por tema.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://notacerta.vercel.app",
  contatoEmail: "contato@notacerta.com.br", // TODO(claudia): e-mail real de contato
} as const;

export const NAV_LINKS = [
  { href: "/", rotulo: "Corrigir" },
  { href: "/estrutura", rotulo: "Estrutura" },
  { href: "/repertorios", rotulo: "Repertórios" },
  { href: "/evolucao", rotulo: "Minha evolução" },
  { href: "/precos", rotulo: "Planos" },
] as const;
