import type { Correcao } from "@/lib/schema";

/**
 * Correção de exemplo (fixture) para demonstrar a tela de resultado sem chamar a API
 * (/resultado?exemplo=1). Também é útil em testes visuais. Não é uma correção real.
 */
export const EXEMPLO_CORRECAO: Correcao = {
  tema: "Desafios para a formação educacional de surdos no Brasil",
  temaDetectado: false,
  transcricao: null,
  completa: true,
  competencias: {
    c1: { nota: 160, justificativa: "Boa norma culta, com uma vírgula entre sujeito e verbo e um erro de crase." },
    c2: { nota: 200, justificativa: "Tema citado por completo, contextualizado no Brasil, estrutura dissertativa clara." },
    c3: { nota: 160, justificativa: "Argumentação consistente; o D2 fica sem a frase de motivo explícita." },
    c4: { nota: 160, justificativa: "Conectivos corretos; a conclusão carece de conectivo de detalhamento." },
    c5: { nota: 120, justificativa: "Proposta com agente genérico e detalhamento curto demais." },
  },
  notaTotal: 800,
  paragrafos: [
    {
      tipo: "introducao",
      textoOriginal:
        "No filme 'O Milagre de Anne Sullivan', é retratada a história de Helen Keller, uma menina surda e cega que enfrenta grandes dificuldades para se comunicar. Fora da ficção, os desafios enfrentados por pessoas surdas no Brasil ainda são evidentes, sobretudo na formação educacional. A falta de acessibilidade nas escolas e o preconceito social são dois entraves que comprometem o desenvolvimento dessa parcela da população.",
      status: "adequado",
      apontamentos: [],
      reescrita: null,
      checklistModelo: [
        { item: "Repertório sociocultural", ok: true },
        { item: "Tema citado por completo + Brasil", ok: true },
        { item: "Duas problemáticas específicas", ok: true },
        { item: "Sem 1ª pessoa, sem dado estatístico, sem conectivo de desenvolvimento", ok: true },
      ],
    },
    {
      tipo: "desenvolvimento1",
      textoOriginal:
        "Primeiramente, destaca-se a falta de acessibilidade nas instituições de ensino como um dos principais entraves à inclusão de surdos, uma vez que muitas escolas públicas não possuem intérpretes de Libras em tempo integral. Segundo dados do IBGE, apenas 1% das escolas brasileiras têm estrutura completa de acessibilidade. Os alunos surdos, portanto, ficam sem apoio. Desse modo, a ausência de recursos inclusivos contribui para o sentimento de exclusão, levando ao abandono escolar.",
      status: "ajustes",
      apontamentos: [
        {
          trecho: "Os alunos surdos, portanto, ficam sem apoio.",
          problema: "Conectivo conclusivo usado no meio do parágrafo, antes do argumento final.",
          motivo:
            "No método, o conectivo conclusivo do parágrafo (Desse modo/Logo/Dessa forma) aparece uma vez, na frase que fecha o argumento. Usar 'portanto' antes disso cria dois fechamentos e quebra a progressão.",
          competencia: "c4",
        },
      ],
      reescrita:
        "Primeiramente, destaca-se a falta de acessibilidade nas instituições de ensino como um dos principais entraves à inclusão de surdos, uma vez que muitas escolas públicas não possuem intérpretes de Libras em tempo integral. Segundo dados do IBGE, apenas 1% das escolas brasileiras têm estrutura completa de acessibilidade, o que deixa os alunos surdos sem apoio pedagógico. Desse modo, a ausência de recursos inclusivos contribui para o sentimento de exclusão, levando ao abandono escolar.",
      checklistModelo: [
        { item: "Conectivo correto (D1: Primeiramente/Em primeiro lugar)", ok: true },
        { item: "Problemática retomada", ok: true },
        { item: "Motivo explícito (porque/pois/uma vez que)", ok: true },
        { item: "Citação/repertório adequado ao parágrafo", ok: true },
        { item: "Argumento com fechamento (Desse modo/Logo/Dessa forma)", ok: false, observacao: "Há dois fechamentos ('portanto' e 'Desse modo')." },
      ],
    },
    {
      tipo: "desenvolvimento2",
      textoOriginal:
        "Em segundo lugar, observa-se o preconceito social como um fator que dificulta a integração de pessoas surdas no ambiente educacional. Conforme defendeu Jean-Paul Sartre, o homem é condenado a ser livre, mas essa liberdade só é possível se houver reconhecimento mútuo. Logo, o preconceito impede a construção de uma convivência democrática, afetando o desempenho e a permanência dos alunos surdos nas escolas.",
      status: "ajustes",
      apontamentos: [
        {
          trecho: "observa-se o preconceito social como um fator que dificulta a integração de pessoas surdas no ambiente educacional.",
          problema: "Falta a frase de motivo explícita depois da problemática.",
          motivo:
            "O método exige, logo após a problemática, uma frase de causa introduzida por 'porque', 'pois', 'uma vez que' ou 'tendo em vista que'. Sem ela, o parágrafo afirma o problema mas não explica por que ele acontece, e o corretor não enxerga a relação de causa.",
          competencia: "c3",
        },
      ],
      reescrita:
        "Em segundo lugar, observa-se o preconceito social como um fator que dificulta a integração de pessoas surdas no ambiente educacional, pois, historicamente, a sociedade marginaliza indivíduos com deficiência. Conforme defendeu Jean-Paul Sartre, o homem é condenado a ser livre, mas essa liberdade só é possível se houver reconhecimento mútuo. Logo, o preconceito impede a construção de uma convivência democrática, afetando o desempenho e a permanência dos alunos surdos nas escolas.",
      checklistModelo: [
        { item: "Conectivo correto (D2: Em segundo lugar/Ademais)", ok: true },
        { item: "Problemática retomada", ok: true },
        { item: "Motivo explícito (porque/pois/uma vez que)", ok: false, observacao: "Não há frase de causa após a problemática." },
        { item: "Citação/repertório adequado ao parágrafo", ok: true },
        { item: "Argumento com fechamento (Desse modo/Logo/Dessa forma)", ok: true },
      ],
    },
    {
      tipo: "conclusao",
      textoOriginal:
        "Portanto, o governo deve investir em infraestrutura por meio da destinação de verba para equipamentos, com a finalidade de garantir a acessibilidade nas escolas, como intérpretes. Dessa forma, casos como o de Helen Keller não se repetirão à realidade brasileira.",
      status: "ajustes",
      apontamentos: [
        {
          trecho: "o governo",
          problema: "Agente genérico na proposta de intervenção.",
          motivo:
            "A Competência 5 exige um agente específico: um órgão real (MEC, secretarias de educação, Congresso Nacional). 'O governo' não diz quem executa a ação, e o corretor desconta por proposta incompleta.",
          competencia: "c5",
        },
        {
          trecho: "como intérpretes",
          problema: "Detalhamento curto demais.",
          motivo:
            "O detalhamento precisa ser uma frase inteira, com conectivo próprio ('Em detalhe,', 'isto é,'). Duas palavras podem ser desconsideradas pelo corretor, e a proposta perde um dos 7 elementos.",
          competencia: "c5",
        },
        {
          trecho: "à realidade brasileira",
          problema: "Crase indevida.",
          motivo:
            "O verbo 'repetir-se' não rege a preposição 'a' nesse sentido; o correto é 'na realidade brasileira'. Crase só ocorre quando há preposição 'a' + artigo 'a'.",
          competencia: "c1",
        },
      ],
      reescrita:
        "Portanto, o Ministério da Educação (MEC) deve investir em infraestrutura inclusiva por meio da destinação de verba específica para a compra de equipamentos tecnológicos, com a finalidade de garantir a acessibilidade plena nas escolas. Em detalhe, é urgente que todas as instituições de ensino contratem intérpretes de Libras disponíveis em tempo integral. Dessa forma, casos como o de Helen Keller, do filme 'O Milagre de Anne Sullivan', não se repetirão na realidade brasileira.",
      checklistModelo: [
        { item: "Conectivo conclusivo", ok: true },
        { item: "Agente específico (órgão real)", ok: false, observacao: "'O governo' é genérico." },
        { item: "Ação no infinitivo", ok: true },
        { item: "Modo/Meio", ok: true },
        { item: "Finalidade", ok: true },
        { item: "Detalhamento (frase inteira)", ok: false, observacao: "'como intérpretes' é curto demais." },
        { item: "Retomada do repertório", ok: true },
      ],
    },
  ],
  repertorioSugestoes: [
    { id: "empatia", porqueCombina: "Fundamenta, no D2, a inclusão de surdos como dever de se colocar no lugar do outro." },
    { id: "ibge", porqueCombina: "Dá o dado concreto de acessibilidade escolar para a citação científica do D1." },
    { id: "cidadania", porqueCombina: "Enquadra a educação de surdos como direito e participação plena na sociedade." },
  ],
  resumoProfessor:
    "Sua redação tem uma base sólida: a introdução está dentro do modelo, com repertório bem relacionado ao tema e duas problemáticas claras. Para subir a nota, priorize três coisas: coloque a frase de motivo no D2 (um 'pois' que explique a causa do preconceito), troque 'o governo' por um órgão específico como o MEC e transforme o detalhamento da proposta em uma frase inteira. Com esses ajustes, o texto passa facilmente de 900.",
};
