# NotaCerta

Corretor de redação ENEM com feedback pedagógico: nota estimada por competência, erros explicados com o **motivo**, reescrita que ensina e repertório curado por tema. A especificação completa está em [`NOTACERTA_SPEC.md`](./NOTACERTA_SPEC.md) (fonte de verdade do projeto).

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript
- Tailwind CSS v4 (tokens de design em `src/app/globals.css`)
- Zod (entrada/saída da API)
- Provedor de IA plugável (`src/lib/ai/`) — `@google/genai` (Gemini, padrão para demo gratuita) ou `@anthropic-ai/sdk` (Anthropic), **só no servidor**
- Sem banco de dados: estado do resultado no `sessionStorage`; limite grátis e rascunho no `localStorage`

## Rodar localmente (modo demonstração, de graça)

O padrão do projeto é o **Gemini**, porque a camada gratuita do Google AI Studio permite rodar a demo sem custo.

1. Acesse [aistudio.google.com](https://aistudio.google.com) e entre com uma conta Google.
2. Clique em **"Get API key"** e crie uma chave.
3. Copie o `.env.example` para `.env.local` na raiz do projeto e preencha:
   ```
   AI_PROVIDER=gemini
   GEMINI_API_KEY=cole_sua_chave_aqui
   GEMINI_MODEL=escolha_um_modelo_da_familia_flash_ou_flash-lite
   ```
   Para o `GEMINI_MODEL`, veja no próprio Google AI Studio qual modelo mostra acesso gratuito (procure pela família **Flash** ou **Flash-Lite** — os ids mudam com o tempo, então escolha o que a página mostrar disponível na camada gratuita no momento).
4. Reinicie o servidor: `npm run dev` (ou pare com `Ctrl+C` e rode de novo se já estava rodando).
5. **Nunca** faça commit do `.env.local` (ele já está no `.gitignore`).

> ⚠️ **Atenção, privacidade:** na camada gratuita, o Google pode usar o conteúdo enviado para melhorar seus produtos. Por isso, **use apenas redações de exemplo ou suas próprias**, nunca redações reais de alunos — muitos são menores de idade, e enviar o texto deles para esse tipo de camada gratuita não é apropriado.

### Opcional: usar a Anthropic em vez do Gemini

Se preferir (ou for para produção), dá para usar a Anthropic — é uma conta separada e cobrada por uso:

1. Crie uma conta em [console.anthropic.com](https://console.anthropic.com), vá em **API Keys** e gere uma chave.
2. No `.env.local`:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=cole_sua_chave_aqui
   ANTHROPIC_MODEL=claude-sonnet-5
   ```
3. Reinicie `npm run dev`.

Com `AI_PROVIDER=anthropic`, o aviso de "modo demonstração" no rodapé do site desaparece automaticamente.

Outros comandos:

```bash
npm run build      # build de produção
npm run start      # serve o build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run format     # prettier
```

## Variáveis de ambiente

| Variável                      | Obrigatória                | Descrição                                                                    |
| ----------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| `AI_PROVIDER`                 | não                        | `gemini` (padrão, camada gratuita) ou `anthropic`.                           |
| `GEMINI_API_KEY`              | se `AI_PROVIDER=gemini`    | Chave do Google AI Studio. Só no servidor. **Nunca** `NEXT_PUBLIC_`.         |
| `GEMINI_MODEL`                | se `AI_PROVIDER=gemini`    | Modelo Gemini (família Flash/Flash-Lite — ver seção acima).                  |
| `ANTHROPIC_API_KEY`           | se `AI_PROVIDER=anthropic` | Chave secreta da Anthropic. Só no servidor. **Nunca** `NEXT_PUBLIC_`.        |
| `ANTHROPIC_MODEL`             | não                        | Modelo quando `AI_PROVIDER=anthropic`. Padrão: `claude-sonnet-5`.            |
| `NOTACERTA_FREE_LIMIT_MENSAL` | não                        | Correções grátis por mês por dispositivo (reseta no mês civil). Padrão: `2`. |
| `NEXT_PUBLIC_SITE_URL`        | não                        | URL pública (canonical/OpenGraph).                                           |

## Deploy na Vercel

1. Suba o repositório no GitHub e importe o projeto na Vercel (framework detectado: Next.js).
2. Em **Settings → Environment Variables**, cadastre `AI_PROVIDER` e as chaves do provedor escolhido (`GEMINI_API_KEY`/`GEMINI_MODEL` ou `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL`), além de `NOTACERTA_FREE_LIMIT_MENSAL` e `NEXT_PUBLIC_SITE_URL` se quiser.
3. Deploy. A rota `/api/corrigir` declara `maxDuration = 120` segundos; no plano Hobby confirme que o Fluid Compute está ativo para o limite valer.

## Estrutura

```
data/                      acervo curado (repertorios.json) e redações-modelo (exemplos-estrutura.json)
src/app/                   rotas: / · /corrigir · /resultado · /estrutura · /repertorios · /precos · /privacidade · /api/corrigir
src/components/            ui/ layout/ corrigir/ resultado/ repertorios/ estrutura/ freemium/
src/lib/                   schema.ts (contrato Zod) · repertorios.ts · estrutura.ts · freemium.ts · gating.ts · resultado-store.ts
src/lib/ai/                provider.ts (escolhe o provedor por AI_PROVIDER) · gemini-provider.ts · anthropic-provider.ts · gemini-schema.ts
src/lib/server/            metodo-prompt.ts (método §8) · corretor.ts (chama o provedor, normaliza, valida) · rate-limit.ts
```

## Arquitetura da correção

```
Navegador ── POST /api/corrigir { tema, texto | imagemBase64 } ──▶ rota Next.js (servidor)
                                                                   ├─ rate limit por cookie anônimo
                                                                   ├─ system prompt = método + acervo condensado
                                                                   ├─ AiProvider (Gemini ou Anthropic, por AI_PROVIDER) → JSON bruto
                                                                   └─ normaliza + valida com Zod (1 reparo; senão 502)
Navegador ◀── JSON Correcao ── salva em sessionStorage ── /resultado renderiza
```

A rota nunca fala diretamente com um SDK de IA — só com `AiProvider` (`src/lib/ai/provider.ts`), que devolve o JSON bruto do modelo. Validação, normalização e o reparo de 1 tentativa (`src/lib/server/corretor.ts`) são os mesmos para qualquer provedor.

Regras duras mantidas no código:

- A chave da API nunca chega ao cliente.
- O modelo não aponta o que está correto e sempre explica o motivo (system prompt em `metodo-prompt.ts`).
- Sugestões de repertório vêm **só** de `data/repertorios.json`; ids fora do acervo são descartados no servidor e na UI.

## Pendências marcadas no código

Procure por `TODO(claudia)`: pagamento real, persistência do histórico, rate limit distribuído (Redis/KV), envio de e-mails capturados a um backend, confirmação do id do modelo, aviso de privacidade com razão social.
