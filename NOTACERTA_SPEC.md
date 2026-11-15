# NOTACERTA — Especificação do Produto e do Site (contexto para o agente de código)

> **Para o agente (Fable):** este arquivo é a fonte de verdade do projeto. Leia-o inteiro antes de escrever qualquer código. Construa na ordem da seção **16. Ordem de construção**. Quando uma decisão não estiver aqui, prefira a opção mais simples que respeite a arquitetura da seção 5 e deixe um comentário `// TODO(claudia):` em vez de inventar regra de negócio. Não exponha a chave da API no cliente em nenhuma hipótese.

---

## 1. O que é o NotaCerta

Plataforma web que corrige redações do ENEM com **feedback estruturado e pedagógico**, seguindo um método de correção específico (o método da professora, detalhado na seção 8). O usuário envia a redação (texto colado ou foto da redação manuscrita) e recebe:

- Nota estimada por competência (C1–C5) e nota total (0–1000);
- Análise parágrafo a parágrafo, apontando o erro **e explicando o motivo**;
- Reescrita dos trechos problemáticos;
- Sugestão de repertório sociocultural por tema;
- Um resumo final no tom de um professor.

**Não é** um corretor genérico de IA. O diferencial é a **qualidade e fidelidade ao método** — guia de reescrita que ensina (não reescreve tudo pelo aluno), repertório curado e correção calibrada no padrão de um corretor humano.

## 2. Posicionamento (contexto de negócio)

Já existem corretores de IA gratuitos e instantâneos (Glau, Quero Bolsa). **Não competimos em preço** — a versão gratuita é uma isca de aquisição, não o produto. Competimos em **profundidade pedagógica**: o método, a reescrita que ensina, o repertório por tema e a calibração contra correção humana. Isso precisa ficar **visível na tela de resultado** (seção 11), senão o usuário não percebe a diferença.

- **Público:** vestibulandos que estudam sozinhos (maioria usa celular) e cursinhos/escolas parceiros (canal B2B2C futuro).
- **Modelo:** freemium (seção 13). Grátis entrega valor real, mas limitado; o plano pago libera volume e recursos.
- **Aquisição:** SEO (páginas que rankeiam para "corretor de redação ENEM grátis") + TikTok. Por isso SSR/SEO importa.

## 3. Princípios de produto

1. **Mobile-first, mas totalmente responsivo.** A maioria acessa pelo celular, então cada tela é desenhada primeiro para 360–414px — mas o site precisa ficar ótimo no desktop também. Use breakpoints do Tailwind (`sm`/`md`/`lg`/`xl`): o conteúdo cresce para layouts de várias colunas em telas largas, com largura máxima confortável de leitura (não esticar texto de ponta a ponta num monitor). Teste em 360px, 768px e 1280px. Nada de rolagem horizontal; alvos de toque ≥ 44px.
2. **A tela de resultado é o produto.** É onde mora o "uau". Investir o máximo de capricho nela.
3. **Funciona sem login.** A primeira correção não exige cadastro (reduz atrito). O e-mail é capturado no momento certo (ao ver o resultado / ao pedir a 2ª correção).
4. **Honestidade.** Sempre "nota **estimada**", nunca "sua nota no ENEM será X". Disclaimer discreto e constante.
5. **Rápido e com estados claros.** Loading que mostra que está analisando por competência; erros e vazios tratados.

## 4. Stack técnica

- **Next.js (App Router) + TypeScript** — React com rota de API embutida (resolve a segurança da chave) e SSR (SEO).
- **Tailwind CSS** para estilo + tokens de design da seção 10.
- **Zod** para validar entrada/saída da API.
- **Anthropic SDK** (`@anthropic-ai/sdk`) **só no servidor** (rota de API).
- Sem banco de dados no MVP. Estado do resultado passa do servidor para a página via resposta da própria requisição; histórico (pago) fica como `// TODO` com interface pronta para plugar um banco depois.
- Persistência leve no cliente (limite de uso grátis, rascunho) via `localStorage`, sempre em `try/catch`.
- Deploy alvo: Vercel (free). Variáveis de ambiente na Vercel.

## 5. Arquitetura (regra de ouro: a chave nunca vai ao cliente)

```
Navegador (React)
   │  POST /api/corrigir  { tema, texto | imagemBase64 }
   ▼
Rota de API Next.js (servidor)   ← ANTHROPIC_API_KEY mora aqui (env)
   │  monta system prompt (método) + mensagem do usuário
   │  aplica rate limit + prompt caching
   ▼
API Anthropic (claude-sonnet-5-5, com visão p/ imagem)
   ▲  JSON estruturado (schema da seção 12)
   │
   ▼  valida com Zod, devolve ao cliente
Navegador renderiza a tela de resultado
```

- **`ANTHROPIC_API_KEY`** só existe no servidor, via `process.env`. Nunca com prefixo `NEXT_PUBLIC_`.
- Toda chamada ao modelo acontece na rota `/api/corrigir`. O cliente nunca fala com a Anthropic direto.

## 6. Variáveis de ambiente (`.env.local`, e um `.env.example` versionado)

```
ANTHROPIC_API_KEY=            # chave secreta — NUNCA commitar, NUNCA NEXT_PUBLIC
ANTHROPIC_MODEL=claude-sonnet-5-5
NOTACERTA_FREE_LIMIT_DIARIO=1 # correções grátis por dia por dispositivo
```

## 7. Rotas / páginas

| Rota | O quê | SEO |
|---|---|---|
| `/` | Landing: proposta de valor, como funciona, prova social, CTA "Corrigir redação grátis" | alta (título/meta para "corretor de redação ENEM gratuito") |
| `/corrigir` | A ferramenta: entrada da redação (texto ou foto) + tema → chama a API → leva ao resultado | média |
| `/resultado` | Renderiza o resultado da correção (recebe o objeto da resposta; se recarregar sem dados, oferece voltar a `/corrigir`) | nenhuma (noindex) |
| `/estrutura` | A estrutura da redação explicada (introdução → D1 → D2 → conclusão, com os 7 elementos) **+ redações-modelo com cada parte destacada por cor** (seção 8.7). Página de estudo e de SEO. | alta (conteúdo) |
| `/repertorios` | Acervo de repertórios (seção 8.6), navegável e filtrável por categoria e por tema. Página de estudo e de SEO. | alta (conteúdo) |
| `/precos` | Freemium: grátis vs Plano Fundador | média |
| `/api/corrigir` | Rota de API (servidor) — seção 9 | — |

Rodapé com: aviso de nota estimada, link de privacidade (LGPD), contato. Cabeçalho com logo NotaCerta + CTA.

## 8. O MÉTODO DE CORREÇÃO (coração do produto — não resumir, não "melhorar")

O modelo abaixo é o critério oficial. O corretor da IA deve segui-lo à risca. **Regra geral: não apontar o que já está correto ou dentro do modelo. Só apontar erro — e, ao apontar, sempre explicar o motivo específico.** Se uma frase estiver muito confusa, explicar como melhorá-la e ajustar na reescrita.

### 8.1 Introdução (3 frases, impessoal, sem 1ª pessoa)
1. **Repertório sociocultural** — conhecimento externo (obra, filme, fato histórico, conceito filosófico, música) para contextualizar. Não precisa ser idêntico ao tema, precisa ser relacionável.
2. **Tema + Brasil** — relacionar o repertório ao tema, citando o tema **por completo** e trazendo para o contexto brasileiro ("no Brasil", "na sociedade brasileira").
3. **Duas problemáticas** — dois problemas específicos tirados dos textos de apoio, unidos por "e"/"além de". Não podem ser genéricos.

**Erros a apontar na introdução:** uso de 1ª pessoa; ausência do tema ou do "Brasil"; problemáticas genéricas ou em número diferente de duas; **dado estatístico na introdução (não pode)**; uso de conectivo de desenvolvimento ("Primeiramente", "Em primeiro lugar", "Ademais", "Em segundo lugar") na introdução — esses são exclusivos do desenvolvimento.

### 8.2 Desenvolvimento 1 e 2 (D1 e D2) — mesma estrutura
Ordem dos elementos:
1. **Conectivo fixo** — D1: "Primeiramente" ou "Em primeiro lugar"; D2: "Em segundo lugar" ou "Ademais". Um só por parágrafo. A 1ª problemática da introdução vira D1; a 2ª vira D2.
2. **Problemática** — retoma, com palavras próprias, a problemática correspondente da introdução.
3. **Motivo** — frase explícita de causa, introduzida por **"porque"/"pois"/"uma vez que"/"tendo em vista que"**, explicando por que aquilo é um problema. **A ausência dessa frase de motivo é um erro que deve ser sempre apontado.**
4. **Citação / repertório** — D1: científica, dados ou fatos; D2: filosófica, literária ou sociológica.
5. **Argumento** — aprofunda o impacto do problema e fecha o parágrafo (de preferência com conectivo conclusivo do parágrafo: "Desse modo", "Logo", "Dessa forma").

**Erros a apontar no desenvolvimento:** conectivo trocado (D2 abrindo com conectivo de D1, etc.); falta da frase de motivo explícita; parágrafo sem repertório/citação; citação "jogada" sem integração ou atribuída entre aspas de forma duvidosa (preferir o conceito do autor a uma aspa não verificável); dado numérico impossível ou inconsistente entre parágrafos; concordância/regência/pontuação (ver 8.4).

### 8.3 Conclusão — proposta de intervenção completa (7 elementos)
Estrutura modelo: **[Conectivo conclusivo] + [Agente] + [Ação] + [Modo/Meio] + [Finalidade] + [Detalhamento] + [Retomada do repertório]**.
1. **Conectivo conclusivo** — Portanto / Dessa forma / Assim / Logo / Sendo assim.
2. **Agente** — **sempre específico**: um órgão real (MEC, Ministério da Saúde, Ministério dos Direitos Humanos e da Cidadania, Congresso Nacional, secretarias estaduais/municipais de educação, Conselho Tutelar...). **Agente genérico ("o governo", "a sociedade") ou uma lei agindo sozinha (ex.: "o ECA deve...") é erro.**
3. **Ação** — verbo no infinitivo (capacitar, fiscalizar, investir, criar, implementar...).
4. **Modo/Meio** — "por meio de", "mediante", "através de", "por intermédio de".
5. **Finalidade** — "com a finalidade de", "a fim de que", "com o objetivo de".
6. **Detalhamento** — aprofundamento com conectivo próprio ("Em detalhe,", "isto é,", "como, por exemplo,"). **Detalhamento muito curto pode ser desconsiderado — apontar como erro e sugerir uma frase inteira.**
7. **Retomada do repertório** — breve menção à obra/personagem da introdução, fechando o circuito.

**Observação do método:** não é erro o detalhamento da proposta cobrir só uma das duas problemáticas.

### 8.4 Gramática (Competência 1) — focos recorrentes
Vírgula (nunca entre sujeito e verbo), crase, acentuação, concordância verbal e nominal, regência verbal e nominal. Apontar caso a caso, sempre com o motivo e a forma correta.

### 8.5 Notas por competência (C1–C5, calibração)
Cada competência vale 0–200, em múltiplos de 40 (0, 40, 80, 120, 160, 200). Total 0–1000. A estimativa deve ser **realista e calibrada** como a de um corretor humano — nem inflada nem punitiva. Referências reais de calibração do método (use como âncora de régua, não como alvo):

- Redação com bom tema e coesão mas vários erros de norma culta → algo como C1 120–140, C2 200, C3 160–200, C4 200, C5 160–180 (total ~860–900).
- Redação com estrutura quebrada, conectivos trocados, parágrafo sem repertório e proposta incompleta → algo como C1 100–120, C2 140–160, C3 120–140, C4 100–120, C5 120 (total ~620–660).
- Redação incompleta (faltando parágrafos) → não estimar nota total; sinalizar que está incompleta.

> As tabelas de conectivos e os exemplos prontos de cada parágrafo estão nos arquivos da apostila do projeto. Incorpore as regras ao prompt do sistema (seção 9); preserve as regras acima **exatamente**.

### 8.6 Base de repertórios (acervo armazenado)
O projeto inclui um **acervo curado de repertórios** no arquivo **`data/repertorios.json`** (entregue junto com este spec — mova-o para `data/` no projeto). Não gere esse acervo do zero: use o arquivo. Cada item tem:
```ts
{ id: string; titulo: string; autor?: string;
  categoria: "filme"|"conto-fabula"|"obra-br"|"obra-estrangeira"|"fato-historico"|"filosofia"|"sociologia"|"dado"|"conceito";
  resumo: string;        // o que é / sobre o que fala
  comoUsar: string;      // como aplicar na redação
  temas: string[];       // tags para busca e para casar com o tema da redação
  uso: ("introducao"|"d1"|"d2")[];  // onde encaixa no método (d1 = dado/científico, d2 = filosófico/sociológico/literário)
}
```
Esse acervo tem **dois papéis**:
1. **Página `/repertorios`** — lista navegável, com busca por texto e filtros por `categoria` e por `tema`. Cada item é um cartão com título, autor, resumo, "como usar" e as tags de uso (Introdução / D1 / D2). É material de estudo e página de SEO.
2. **Fonte das sugestões da correção** — ao final de cada correção, sugerir **2 a 3 repertórios deste acervo** que combinem com o tema da redação (ver seção 9). **As sugestões vêm sempre do acervo curado, nunca inventadas pelo modelo** — isso evita citação falsa (risco que a própria apostila alerta) e reforça o diferencial de "repertório curado". Cada sugestão linka para o item em `/repertorios`.

O acervo deve ser fácil de ampliar depois (basta adicionar itens ao JSON). No protótipo, o acervo entregue já é suficiente.

### 8.7 Redações-modelo destacadas (página `/estrutura`)
O projeto inclui o arquivo **`data/exemplos-estrutura.json`** (entregue junto — mover para `data/`) com redações-modelo **já segmentadas**. Cada exemplo tem um `tema` e quatro parágrafos; cada parágrafo é uma lista de `partes`, e cada parte tem um `rotulo` (o elemento do método, ex.: "Repertório sociocultural", "Motivo", "Agente") e o `texto`.

A página `/estrutura` tem duas camadas:
1. **Explicação dos elementos** — introdução (3 frases), D1/D2 (conectivo → problemática → motivo → citação → argumento) e conclusão (os 7 elementos), em linguagem de aluno.
2. **Exemplos destacados** — renderizar os exemplos de `exemplos-estrutura.json` com o **tema em destaque no topo** e cada `parte` **colorida conforme seu `rotulo`**, com uma **legenda** (rótulo → cor). Assim o aluno vê, no texto real, onde está cada elemento. Manter **poucos exemplos** (os 2 do arquivo) para não poluir; se quiser, um seletor para alternar entre os temas.

Use uma paleta de destaque consistente e acessível (uma cor por rótulo, com texto legível por cima). Esses mesmos exemplos podem ser reaproveitados no jogo de estrutura de redação (outro projeto).

## 9. Rota `/api/corrigir` — comportamento

Entrada (`POST`, JSON), validada com Zod:
```ts
{ tema?: string, texto?: string, imagemBase64?: string, imagemMime?: string }
// pelo menos um de texto|imagemBase64 é obrigatório
```
Passos:
1. **Rate limit** por dispositivo (header/cookie com id anônimo) — `NOTACERTA_FREE_LIMIT_DIARIO`. Estourou → responde `429` com `{ erro: "limite_diario", upgrade: true }` (o cliente abre o modal de upgrade).
2. Monta as mensagens: **system prompt = método (seção 8)** + **uma versão condensada do acervo de repertórios** (só `id`, `titulo`, `temas`, `uso` de cada item de `data/repertorios.json`), tudo marcado para **prompt caching** (é grande e estático → `cache_control`). Depois, a mensagem do usuário com o tema + a redação (texto, ou imagem em bloco de visão se vier foto). Instrua o modelo a **escolher 2–3 repertórios do acervo** cujos `temas`/`uso` combinem com o tema da redação e a **retornar os `id`s** no campo `repertorioSugestoes` (seção 12) — nunca inventar repertório fora da lista.
3. Chama `claude-sonnet-5-5`, `temperature: 0.2`, `max_tokens: ~3500`. Se veio imagem, incluir o bloco de imagem para o modelo transcrever antes de corrigir.
4. **Força saída JSON** no schema da seção 12. Validar com Zod; se o modelo devolver algo fora do schema, pedir 1 reparo ou responder `502` tratado.
5. Responder o JSON ao cliente. Não logar o conteúdo da redação (privacidade).

**Prompt do sistema (resumo a implementar):** "Você é o corretor de redações do NotaCerta e segue estritamente o método da professora (CEC/UFSCar Sorocaba). [regras da seção 8]. Não aponte o que já está correto. Ao apontar um erro, sempre explique o motivo específico. Estime C1–C5 em múltiplos de 40, de forma calibrada. Se a redação vier como imagem, transcreva-a fielmente antes de corrigir, sem corrigir a ortografia na transcrição. Responda **somente** com JSON válido no schema fornecido, em português do Brasil, com todo o texto adequado para leitura (sem markdown dentro dos campos)."

## 10. Design system (consistente com a marca NotaCerta)

**Paleta (tokens Tailwind):**
- `azul` primário `#2563EB` · `azul-escuro` `#1E3A8A` · `navy` (texto/escuro) `#0F172A`
- `azul-claro` `#EFF6FF` · `borda` `#BFDBFE` · `cinza-fundo` `#F1F5F9` · `slate` (texto secundário) `#64748B`
- Semânticos de nota: `verde` `#16A34A` (120–200), `ambar` `#F59E0B` (80–100), `vermelho` `#DC2626` (0–40)

**Tipografia:** uma sans limpa para UI/corpo (ex.: Inter) e, opcionalmente, uma serifada para títulos grandes, dando um ar editorial/educacional. Corpo ≥ 16px no mobile.

**Formas:** cantos arredondados (12–16px), cartões com sombra suave, sem listras/barras decorativas. Ícones de traço simples. Alto contraste (texto escuro sobre claro; nunca cinza-claro sobre bege).

**Componentes-chave:** `Botao` (primário/secundário), `Campo`/`AreaTexto`, `UploadFoto` (câmera no mobile), `SeletorTema`, `AnelDeNota` (círculo com o total), `BarraCompetencia` (C1–C5 com cor semântica), `CartaoParagrafo` (original + apontamentos + reescrita colapsável), `CartaoRepertorio`, `ModalUpgrade`, `Aviso` (nota estimada), estados de `Carregando`/`Erro`/`Vazio`.

## 11. Tela de resultado (a mais importante)

**Layout:** no **mobile**, tudo empilhado na ordem abaixo. No **desktop** (`lg+`), usar duas colunas: uma coluna lateral mais estreita, "grudada" ao rolar (sticky), com o anel de nota total + as 5 competências + o resumo do professor; e a coluna principal (mais larga) com os parágrafos e o repertório. Assim a nota fica sempre visível enquanto o aluno lê os parágrafos.

Ordem na tela (mobile, de cima para baixo):
1. **Cabeçalho do resultado:** tema identificado + nota total em `AnelDeNota` grande + selo "nota estimada".
2. **Competências C1–C5:** cinco `BarraCompetencia` com nota e uma linha de justificativa cada.
3. **Parágrafo a parágrafo:** um `CartaoParagrafo` para introdução, D1, D2 e conclusão. Cada cartão mostra:
   - status (adequado / precisa de ajustes / incompleto) com cor;
   - o texto original com os trechos problemáticos destacados;
   - lista de apontamentos (trecho → problema → **motivo**), cada um com a tag da competência;
   - **reescrita** colapsável ("Ver como ficaria melhor") — só aparece se houver o que reescrever;
   - um mini-checklist do modelo (ex.: "Motivo explícito (porque/pois)", "Agente específico") com ✓/✗.
4. **Repertório sugerido** para o tema — 2 a 3 cartões vindos do acervo curado (`data/repertorios.json`), cada um com título, resumo, "como usar", a frase de por que combina com o tema e um link "ver no acervo" para `/repertorios`. Reforça o diferencial de repertório curado e puxa o aluno para estudar mais.
5. **Resumo do professor** — parágrafo final no tom humano.
6. **CTA contextual:** "Corrigir outra redação" (gratuito, conta no limite) e, ao esbarrar no limite ou pedir recurso pago, `ModalUpgrade`.

O destaque de trechos e a seção de reescrita são o que fazem o NotaCerta parecer melhor que um corretor genérico. Capriche neles.

## 12. Schema JSON da correção (contrato entre API e UI)

```ts
type Competencia = { nota: number; justificativa: string }; // nota 0..200, múltiplos de 40
type Apontamento = {
  trecho: string;        // trecho exato do texto do aluno
  problema: string;      // o que está errado
  motivo: string;        // POR QUE é um problema (obrigatório)
  competencia: "c1"|"c2"|"c3"|"c4"|"c5";
};
type Paragrafo = {
  tipo: "introducao"|"desenvolvimento1"|"desenvolvimento2"|"conclusao";
  textoOriginal: string;
  status: "adequado"|"ajustes"|"incompleto";
  apontamentos: Apontamento[];           // vazio se estiver adequado
  reescrita: string | null;              // null se nada a reescrever
  checklistModelo: { item: string; ok: boolean; observacao?: string }[];
};
type Correcao = {
  tema: string;
  temaDetectado: boolean;                // true se foi inferido do texto
  transcricao: string | null;            // preenchido só quando a entrada foi imagem
  completa: boolean;                     // false se faltam parágrafos
  competencias: { c1:Competencia; c2:Competencia; c3:Competencia; c4:Competencia; c5:Competencia };
  notaTotal: number | null;              // null se !completa
  paragrafos: Paragrafo[];
  repertorioSugestoes: {
    id: string;          // id de um item de data/repertorios.json (fonte curada)
    porqueCombina: string; // 1 frase: por que esse repertório serve para ESTE tema
  }[];                   // 2 a 3 itens
  resumoProfessor: string;
};
```
A UI renderiza a partir desse objeto. Validar com Zod tanto na saída da API quanto antes de renderizar. Para o repertório, a UI pega o `id` retornado, busca o item completo em `data/repertorios.json` e monta o cartão (título, autor, resumo, "como usar") + a frase `porqueCombina` + link para `/repertorios`. Se algum `id` não existir no acervo, descartar aquele item (nunca mostrar repertório fora do acervo).

## 13. Freemium (regras de negócio)

- **Grátis:** 1 correção/dia; nota + competências + apontamentos de todos os parágrafos + **1 reescrita** (a do parágrafo mais crítico) + resumo. As demais reescritas e o repertório completo aparecem borrados com `ModalUpgrade`.
- **Plano Fundador (pago):** correções ilimitadas, todas as reescritas, repertório completo por tema, histórico/progresso e exportar em PDF.
- No MVP, **o grátis funciona de verdade**; o pago é "stub": o gating e o `ModalUpgrade` existem e capturam e-mail/intenção, mas não há cobrança ainda (`// TODO(claudia): pagamento`). O objetivo do protótipo é validar uso e captar interessados.
- **Captura de e-mail:** pedir ao mostrar o resultado ("salve sua correção / receba melhorias") ou ao pedir a 2ª correção. Guardar intenção localmente + `// TODO` para enviar a um backend/lista depois.

## 14. Legal e confiança (LGPD)

- Público inclui menores de idade. **Não armazenar a redação nem dados pessoais** no MVP além do necessário; se for guardar e-mail, pedir consentimento explícito e ter aviso de privacidade.
- Não logar o conteúdo das redações no servidor.
- Deixar claro que a nota é **estimada** e que o NotaCerta não tem vínculo com o INEP/MEC.

## 15. Acessibilidade e qualidade

Contraste AA, navegação por teclado, `alt` em ícones significativos, foco visível, área de toque ≥ 44px. Tratar: imagem ilegível (pedir outra foto), texto muito curto para ser redação, API fora do ar, limite atingido.

## 16. Ordem de construção (fazer nesta sequência, commits pequenos)

1. **Scaffold:** Next.js (App Router) + TS + Tailwind + ESLint/Prettier. Tokens de design (seção 10), layout raiz (cabeçalho/rodapé), navegação mobile, componentes base (`Botao`, `Campo`, `AreaTexto`, `Aviso`).
2. **Landing `/`** com proposta de valor, "como funciona", CTA e SEO (title/meta/OpenGraph). Responsiva (seção 3.1).
3. **Acervo de repertórios:** mover `data/repertorios.json` para o projeto, tipar, e construir a página **`/repertorios`** (busca + filtros por categoria e tema). Fazer antes da correção, porque a correção depende do acervo.
4. **`/corrigir`:** formulário com abas "Colar texto" / "Enviar foto", campo de tema (com opção "não sei o tema → detectar"), validação, estado de carregando.
5. **`/api/corrigir`:** Anthropic SDK no servidor, system prompt do método (seção 8) + acervo condensado (seção 9), prompt caching, visão para imagem, saída JSON validada com Zod, rate limit, tratamento de erro. Variáveis de ambiente (seção 6).
6. **`/resultado`:** render completo do schema (seção 11), responsivo (duas colunas no desktop) — `AnelDeNota`, `BarraCompetencia`, `CartaoParagrafo` com destaque e reescrita colapsável, `CartaoRepertorio` (puxando do acervo), resumo.
7. **Freemium:** limite diário, `ModalUpgrade`, captura de e-mail, borrões no conteúdo pago.
8. **Páginas de apoio:** `/estrutura` (explicação dos elementos + exemplos destacados de `data/exemplos-estrutura.json`, seção 8.7) e `/precos`; polish, estados de erro/vazio, revisão de acessibilidade e responsividade (360/768/1280px), `README` com passos de rodar e deploy.

## 17. Fora de escopo no MVP (não construir agora)

App nativo; múltiplos vestibulares além do ENEM; fórum/comunidade; cobrança real; banco de dados/históri­co persistente (deixar interface pronta, implementação como `// TODO`); correção de redação dissertativa que não siga este método.

---

### Resumo para o agente
Construa um site **Next.js + TS + Tailwind**, **mobile-first**, cuja rota de API no servidor chama o **claude-sonnet-5-5** com o **método da seção 8** como system prompt (com prompt caching) e devolve o **JSON da seção 12**, que a **tela de resultado da seção 11** renderiza. A chave da API nunca aparece no cliente. A versão gratuita funciona de ponta a ponta; o pago é stub com gating e captura de e-mail. Priorize a tela de resultado — é o diferencial do produto.
