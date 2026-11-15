# NotaCerta

Corretor de redação ENEM com feedback pedagógico: nota estimada por competência, erros explicados com o **motivo**, reescrita que ensina e repertório curado por tema. A especificação completa está em [`NOTACERTA_SPEC.md`](./NOTACERTA_SPEC.md) (fonte de verdade do projeto).

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript
- Tailwind CSS v4 (tokens de design em `src/app/globals.css`)
- Zod (entrada/saída da API)
- `@anthropic-ai/sdk` **só no servidor** (`src/lib/server/`)
- Sem banco de dados: estado do resultado no `sessionStorage`; limite grátis e rascunho no `localStorage`

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha ANTHROPIC_API_KEY
npm run dev                   # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run format     # prettier
```

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ANTHROPIC_API_KEY` | sim | Chave secreta. Só no servidor. **Nunca** usar prefixo `NEXT_PUBLIC_`. |
| `ANTHROPIC_MODEL` | não | Modelo da rota `/api/corrigir`. Padrão: `claude-sonnet-5`. |
| `NOTACERTA_FREE_LIMIT_DIARIO` | não | Correções grátis por dia por dispositivo. Padrão: `1`. |
| `NEXT_PUBLIC_SITE_URL` | não | URL pública (canonical/OpenGraph). |

## Deploy na Vercel

1. Suba o repositório no GitHub e importe o projeto na Vercel (framework detectado: Next.js).
2. Em **Settings → Environment Variables**, cadastre `ANTHROPIC_API_KEY` (e, se quiser, `ANTHROPIC_MODEL`, `NOTACERTA_FREE_LIMIT_DIARIO`, `NEXT_PUBLIC_SITE_URL`).
3. Deploy. A rota `/api/corrigir` declara `maxDuration = 120` segundos; no plano Hobby confirme que o Fluid Compute está ativo para o limite valer.

## Estrutura

```
data/                      acervo curado (repertorios.json) e redações-modelo (exemplos-estrutura.json)
src/app/                   rotas: / · /corrigir · /resultado · /estrutura · /repertorios · /precos · /privacidade · /api/corrigir
src/components/            ui/ layout/ corrigir/ resultado/ repertorios/ estrutura/ freemium/
src/lib/                   schema.ts (contrato Zod) · repertorios.ts · estrutura.ts · freemium.ts · gating.ts · resultado-store.ts
src/lib/server/            metodo-prompt.ts (método §8) · corretor.ts (Anthropic) · rate-limit.ts
```

## Arquitetura da correção

```
Navegador ── POST /api/corrigir { tema, texto | imagemBase64 } ──▶ rota Next.js (servidor)
                                                                   ├─ rate limit por cookie anônimo
                                                                   ├─ system prompt = método + acervo condensado (prompt caching)
                                                                   ├─ Anthropic (saída estruturada no schema §12)
                                                                   └─ normaliza + valida com Zod (1 reparo; senão 502)
Navegador ◀── JSON Correcao ── salva em sessionStorage ── /resultado renderiza
```

Regras duras mantidas no código:

- A chave da API nunca chega ao cliente.
- O modelo não aponta o que está correto e sempre explica o motivo (system prompt em `metodo-prompt.ts`).
- Sugestões de repertório vêm **só** de `data/repertorios.json`; ids fora do acervo são descartados no servidor e na UI.

## Pendências marcadas no código

Procure por `TODO(claudia)`: pagamento real, persistência do histórico, rate limit distribuído (Redis/KV), envio de e-mails capturados a um backend, confirmação do id do modelo, aviso de privacidade com razão social.
