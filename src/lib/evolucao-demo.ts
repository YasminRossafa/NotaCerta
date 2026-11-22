import type { CodigoCompetencia } from "@/lib/competencias";
import type { EntradaHistorico } from "@/lib/historico";
import { CorrecaoSchema, type Correcao, type Paragrafo, type TipoParagrafo } from "@/lib/schema";

/**
 * Dados de demonstração para /evolucao (spec do pedido do fundador): 7 correções fictícias,
 * plausíveis, mostrando evolução de ~520 para ~880 pontos ao longo de algumas semanas. Nunca
 * reais — toda entrada é marcada `demo: true` e some com "Remover dados de demonstração".
 */

type TipoProblema =
  | "normaCulta"
  | "semMotivo"
  | "repertorioFraco"
  | "conectivoFechamento"
  | "detalhamentoCurto"
  | "agenteGenerico";

const TIPOS_PROBLEMA: Record<
  TipoProblema,
  { problema: string; motivo: string; competencia: CodigoCompetencia }
> = {
  normaCulta: {
    problema: "Desvio de norma culta no trecho destacado.",
    motivo: "Ajuste necessário para seguir a norma padrão da língua nessa construção.",
    competencia: "c1",
  },
  semMotivo: {
    problema: "Falta a frase de motivo explícita logo após a problemática.",
    motivo:
      "O método exige uma frase de causa (porque/pois/uma vez que) logo depois da problemática; sem ela, o corretor não enxerga a relação de causa.",
    competencia: "c3",
  },
  repertorioFraco: {
    problema: "Repertório pouco conectado ao tema.",
    motivo:
      "O repertório precisa dialogar claramente com o tema e com o contexto brasileiro, não apenas abrir o parágrafo.",
    competencia: "c3",
  },
  conectivoFechamento: {
    problema: "Conectivo trocado ou ausente no fechamento do parágrafo.",
    motivo:
      "O fechamento deve usar um conectivo conclusivo (Desse modo/Logo/Dessa forma) para marcar a progressão do texto.",
    competencia: "c4",
  },
  detalhamentoCurto: {
    problema: "Detalhamento curto demais na proposta.",
    motivo:
      "O detalhamento da proposta precisa ser uma frase inteira, com conectivo próprio, não apenas uma expressão solta.",
    competencia: "c5",
  },
  agenteGenerico: {
    problema: "Agente pouco específico na proposta.",
    motivo:
      "A Competência 5 exige um agente real e específico (órgão, ministério, secretaria), não uma referência genérica.",
    competencia: "c5",
  },
};

const ITEM_POR_TIPO: Partial<Record<TipoProblema, Partial<Record<TipoParagrafo, string>>>> = {
  semMotivo: {
    desenvolvimento1: "Motivo explícito (porque/pois/uma vez que)",
    desenvolvimento2: "Motivo explícito (porque/pois/uma vez que)",
  },
  repertorioFraco: {
    introducao: "Repertório sociocultural",
    desenvolvimento1: "Citação/repertório adequado ao parágrafo",
    desenvolvimento2: "Citação/repertório adequado ao parágrafo",
  },
  conectivoFechamento: {
    desenvolvimento1: "Argumento com fechamento (Desse modo/Logo/Dessa forma)",
    desenvolvimento2: "Argumento com fechamento (Desse modo/Logo/Dessa forma)",
  },
  detalhamentoCurto: { conclusao: "Detalhamento (frase inteira)" },
  agenteGenerico: { conclusao: "Agente específico (órgão real)" },
};

const CHECKLIST_BASE: Record<TipoParagrafo, string[]> = {
  introducao: [
    "Repertório sociocultural",
    "Tema citado por completo + Brasil",
    "Duas problemáticas específicas",
    "Sem 1ª pessoa, sem dado estatístico, sem conectivo de desenvolvimento",
  ],
  desenvolvimento1: [
    "Conectivo correto (Primeiramente/Em primeiro lugar)",
    "Problemática retomada",
    "Motivo explícito (porque/pois/uma vez que)",
    "Citação/repertório adequado ao parágrafo",
    "Argumento com fechamento (Desse modo/Logo/Dessa forma)",
  ],
  desenvolvimento2: [
    "Conectivo correto (Em segundo lugar/Ademais)",
    "Problemática retomada",
    "Motivo explícito (porque/pois/uma vez que)",
    "Citação/repertório adequado ao parágrafo",
    "Argumento com fechamento (Desse modo/Logo/Dessa forma)",
  ],
  conclusao: [
    "Conectivo conclusivo",
    "Agente específico (órgão real)",
    "Ação no infinitivo",
    "Modo/Meio",
    "Finalidade",
    "Detalhamento (frase inteira)",
    "Retomada do repertório",
  ],
};

type ApontamentoPossivel = { trecho: string; tipo: TipoProblema };
type ParagrafoTemplate = {
  tipo: TipoParagrafo;
  texto: string;
  apontamentosPossiveis: ApontamentoPossivel[];
  reescrita: string;
};
type TemaTemplate = { tema: string; paragrafos: ParagrafoTemplate[] };

const TEMA_SUS: TemaTemplate = {
  tema: "A valorização do Sistema Único de Saúde (SUS) como direito universal",
  paragrafos: [
    {
      tipo: "introducao",
      texto:
        'Na obra "Admirável Mundo Novo", de Aldous Huxley, a saúde da população é controlada pelo Estado como forma de manter a ordem social. No Brasil, a valorização do Sistema Único de Saúde (SUS) como direito universal esbarra na falta de investimento público e na desinformação da população sobre seus próprios direitos.',
      apontamentosPossiveis: [
        { trecho: "a saúde da população é controlada pelo Estado", tipo: "repertorioFraco" },
      ],
      reescrita:
        'Na obra "Admirável Mundo Novo", de Aldous Huxley, o Estado controla a saúde da população como forma de manter a ordem social, o que dialoga com os limites do próprio cuidado em saúde. No Brasil, a valorização do Sistema Único de Saúde (SUS) como direito universal esbarra na falta de investimento público e na desinformação da população sobre seus próprios direitos.',
    },
    {
      tipo: "desenvolvimento1",
      texto:
        "Em primeiro lugar, a falta de investimento público compromete o atendimento das famílias mais vulneráveis. Segundo dados do IPEA, municípios pequenos têm menos de um médico para cada mil habitantes. Desse modo, o direito à saúde se torna distante da realidade de grande parte da população.",
      apontamentosPossiveis: [
        {
          trecho:
            "a falta de investimento público compromete o atendimento das famílias mais vulneráveis",
          tipo: "semMotivo",
        },
        {
          trecho: "municípios pequenos têm menos de um médico para cada mil habitantes",
          tipo: "normaCulta",
        },
      ],
      reescrita:
        "Em primeiro lugar, a falta de investimento público compromete o atendimento das famílias mais vulneráveis, pois recursos insuficientes limitam a estrutura das unidades básicas de saúde. Segundo dados do IPEA, municípios pequenos têm menos de um médico para cada mil habitantes. Desse modo, o direito à saúde se torna distante da realidade de grande parte da população.",
    },
    {
      tipo: "desenvolvimento2",
      texto:
        "Em segundo lugar, a desinformação sobre os direitos garantidos pelo SUS agrava esse cenário. Conforme o filósofo Michel Foucault, o controle sobre os corpos também passa pelo acesso à informação em saúde. Logo, cidadãos mal informados deixam de buscar atendimento que já é seu por direito.",
      apontamentosPossiveis: [
        {
          trecho: "o controle sobre os corpos também passa pelo acesso à informação em saúde",
          tipo: "repertorioFraco",
        },
        {
          trecho: "cidadãos mal informados deixam de buscar atendimento que já é seu por direito",
          tipo: "conectivoFechamento",
        },
      ],
      reescrita:
        "Em segundo lugar, a desinformação sobre os direitos garantidos pelo SUS agrava esse cenário, uma vez que muitos brasileiros desconhecem os próprios serviços gratuitos disponíveis. Conforme o filósofo Michel Foucault, o acesso à informação em saúde também é uma forma de poder. Dessa forma, cidadãos mal informados deixam de buscar atendimento que já é seu por direito.",
    },
    {
      tipo: "conclusao",
      texto:
        "Portanto, o Ministério da Saúde deve ampliar o investimento em atenção básica por meio de parcerias com estados e municípios, com a finalidade de universalizar o atendimento. Em detalhe, campanhas de educação em saúde nas escolas. Assim, o SUS se consolidará como o pilar de cidadania imaginado desde a Constituição de 1988.",
      apontamentosPossiveis: [
        { trecho: "o Ministério da Saúde", tipo: "agenteGenerico" },
        {
          trecho: "Em detalhe, campanhas de educação em saúde nas escolas",
          tipo: "detalhamentoCurto",
        },
      ],
      reescrita:
        "Portanto, o Ministério da Saúde, em conjunto com as secretarias estaduais, deve ampliar o investimento em atenção básica por meio de parcerias com municípios, com a finalidade de universalizar o atendimento. Em detalhe, campanhas de educação em saúde nas escolas ajudariam a informar a população sobre seus direitos. Assim, o SUS se consolidará como o pilar de cidadania imaginado desde a Constituição de 1988.",
    },
  ],
};

const TEMA_SURDOS: TemaTemplate = {
  tema: "Desafios para a formação educacional de surdos no Brasil",
  paragrafos: [
    {
      tipo: "introducao",
      texto:
        'No filme "O Milagre de Anne Sullivan", Helen Keller enfrenta grandes dificuldades para se comunicar por ser surda e cega. Fora da ficção, os desafios enfrentados por pessoas surdas no Brasil ainda são evidentes, sobretudo na formação educacional, marcada pela falta de intérpretes e pelo preconceito social.',
      apontamentosPossiveis: [
        {
          trecho: "Helen Keller enfrenta grandes dificuldades para se comunicar",
          tipo: "repertorioFraco",
        },
      ],
      reescrita:
        'No filme "O Milagre de Anne Sullivan", é retratada a história de Helen Keller, menina surda e cega que enfrenta grandes dificuldades de comunicação. Fora da ficção, os desafios enfrentados por pessoas surdas no Brasil ainda são evidentes, sobretudo na formação educacional, marcada pela falta de intérpretes e pelo preconceito social.',
    },
    {
      tipo: "desenvolvimento1",
      texto:
        "Primeiramente, a falta de intérpretes de Libras nas escolas públicas compromete o acompanhamento das aulas. Segundo o IBGE, grande parte das escolas brasileiras não têm estrutura de acessibilidade. Desse modo, estudantes surdos ficam sem o apoio necessário para aprender.",
      apontamentosPossiveis: [
        {
          trecho:
            "a falta de intérpretes de Libras nas escolas públicas compromete o acompanhamento das aulas",
          tipo: "semMotivo",
        },
      ],
      reescrita:
        "Primeiramente, a falta de intérpretes de Libras nas escolas públicas compromete o acompanhamento das aulas, pois sem tradução o conteúdo fica inacessível ao aluno surdo. Segundo o IBGE, grande parte das escolas brasileiras não tem estrutura de acessibilidade. Desse modo, estudantes surdos ficam sem o apoio necessário para aprender.",
    },
    {
      tipo: "desenvolvimento2",
      texto:
        "Em segundo lugar, o preconceito social dificulta a integração de pessoas surdas no ambiente escolar. Conforme Pierre Bourdieu, o capital cultural desigual perpetua barreiras entre grupos sociais. Logo, o preconceito impede a construção de uma convivência verdadeiramente inclusiva.",
      apontamentosPossiveis: [
        {
          trecho: "o capital cultural desigual perpetua barreiras entre grupos sociais",
          tipo: "normaCulta",
        },
        {
          trecho: "o preconceito impede a construção de uma convivência verdadeiramente inclusiva",
          tipo: "conectivoFechamento",
        },
      ],
      reescrita:
        "Em segundo lugar, o preconceito social dificulta a integração de pessoas surdas no ambiente escolar, visto que a sociedade ainda associa a surdez a uma limitação intelectual. Conforme Pierre Bourdieu, o capital cultural desigual perpetua barreiras entre grupos sociais. Dessa forma, o preconceito impede a construção de uma convivência verdadeiramente inclusiva.",
    },
    {
      tipo: "conclusao",
      texto:
        "Portanto, o governo deve investir em intérpretes de Libras por meio de concursos públicos específicos, com a finalidade de garantir a acessibilidade. Em detalhe, parcerias com universidades. Dessa forma, casos como o de Helen Keller não se repetirão na realidade brasileira.",
      apontamentosPossiveis: [
        { trecho: "o governo", tipo: "agenteGenerico" },
        { trecho: "Em detalhe, parcerias com universidades", tipo: "detalhamentoCurto" },
      ],
      reescrita:
        "Portanto, o Ministério da Educação deve investir em intérpretes de Libras por meio de concursos públicos específicos, com a finalidade de garantir a acessibilidade nas escolas. Em detalhe, parcerias com universidades poderiam formar mais profissionais capacitados. Dessa forma, casos como o de Helen Keller não se repetirão na realidade brasileira.",
    },
  ],
};

const TEMA_DESINFORMACAO: TemaTemplate = {
  tema: "Os caminhos para o combate à desinformação nas redes sociais",
  paragrafos: [
    {
      tipo: "introducao",
      texto:
        'No filme "Matrix", os personagens vivem presos a uma realidade construída artificialmente, sem perceber a manipulação ao seu redor. No Brasil, o combate à desinformação nas redes sociais enfrenta o avanço de notícias falsas e a ausência de letramento digital da população.',
      apontamentosPossiveis: [
        { trecho: "sem perceber a manipulação ao seu redor", tipo: "repertorioFraco" },
      ],
      reescrita:
        'No filme "Matrix", os personagens vivem presos a uma realidade artificial, sem perceber a manipulação à qual estão submetidos — alegoria que dialoga com o consumo acrítico de informação hoje. No Brasil, o combate à desinformação nas redes sociais enfrenta o avanço de notícias falsas e a ausência de letramento digital da população.',
    },
    {
      tipo: "desenvolvimento1",
      texto:
        "Em primeiro lugar, a velocidade de propagação das notícias falsas dificulta sua verificação. Segundo pesquisa do IBGE, a maior parte dos brasileiros se informa quase exclusivamente por redes sociais. Desse modo, conteúdos não verificados alcançam milhões antes de qualquer checagem.",
      apontamentosPossiveis: [
        {
          trecho: "a velocidade de propagação das notícias falsas dificulta sua verificação",
          tipo: "semMotivo",
        },
      ],
      reescrita:
        "Em primeiro lugar, a velocidade de propagação das notícias falsas dificulta sua verificação, pois os algoritmos priorizam conteúdos de forte apelo emocional. Segundo pesquisa do IBGE, a maior parte dos brasileiros se informa quase exclusivamente por redes sociais. Desse modo, conteúdos não verificados alcançam milhões antes de qualquer checagem.",
    },
    {
      tipo: "desenvolvimento2",
      texto:
        "Em segundo lugar, a ausência de letramento digital nas escolas agrava a vulnerabilidade da população. Conforme a socióloga Zygmunt Bauman, a modernidade líquida torna as informações cada vez mais descartáveis e superficiais. Logo, poucos param para questionar o que consomem.",
      apontamentosPossiveis: [
        {
          trecho:
            "a modernidade líquida torna as informações cada vez mais descartáveis e superficiais",
          tipo: "normaCulta",
        },
        { trecho: "poucos param para questionar o que consomem", tipo: "conectivoFechamento" },
      ],
      reescrita:
        "Em segundo lugar, a ausência de letramento digital nas escolas agrava a vulnerabilidade da população, já que faltam ferramentas básicas para avaliar a credibilidade de uma fonte. Conforme Zygmunt Bauman, a modernidade líquida torna as informações cada vez mais descartáveis. Dessa forma, poucos param para questionar o que consomem.",
    },
    {
      tipo: "conclusao",
      texto:
        "Portanto, o Ministério da Educação deve incluir letramento digital no currículo por meio de aulas regulares, com a finalidade de formar leitores críticos. Em detalhe, parceria com plataformas. Assim, o Brasil estará mais preparado para enfrentar a desinformação.",
      apontamentosPossiveis: [{ trecho: "parceria com plataformas", tipo: "detalhamentoCurto" }],
      reescrita:
        "Portanto, o Ministério da Educação deve incluir letramento digital no currículo por meio de aulas regulares, com a finalidade de formar leitores críticos. Em detalhe, parcerias com as próprias plataformas poderiam financiar materiais didáticos sobre checagem de fatos. Assim, o Brasil estará mais preparado para enfrentar a desinformação.",
    },
  ],
};

const TEMA_VIOLENCIA: TemaTemplate = {
  tema: "A persistência da violência doméstica contra a mulher no Brasil",
  paragrafos: [
    {
      tipo: "introducao",
      texto:
        'Na obra "A Hora da Estrela", de Clarice Lispector, a protagonista Macabéa vive à margem da sociedade, sem rede de apoio. No Brasil, a persistência da violência doméstica contra a mulher revela a fragilidade da rede de proteção e a naturalização histórica da violência de gênero.',
      apontamentosPossiveis: [
        {
          trecho: "a protagonista Macabéa vive à margem da sociedade, sem rede de apoio",
          tipo: "repertorioFraco",
        },
      ],
      reescrita:
        'Na obra "A Hora da Estrela", de Clarice Lispector, Macabéa vive à margem da sociedade, sem rede de apoio — retrato que ecoa a situação de muitas mulheres em contexto de violência. No Brasil, a persistência da violência doméstica contra a mulher revela a fragilidade da rede de proteção e a naturalização histórica da violência de gênero.',
    },
    {
      tipo: "desenvolvimento1",
      texto:
        "Em primeiro lugar, a subnotificação dos casos de violência doméstica dificulta o combate ao problema. Segundo dados do IPEA, grande parte das vítimas não denuncia por medo de retaliação. Desse modo, o ciclo de violência se perpetua silenciosamente.",
      apontamentosPossiveis: [
        {
          trecho:
            "a subnotificação dos casos de violência doméstica dificulta o combate ao problema",
          tipo: "semMotivo",
        },
      ],
      reescrita:
        "Em primeiro lugar, a subnotificação dos casos de violência doméstica dificulta o combate ao problema, pois sem registro oficial políticas públicas não conseguem dimensionar a real gravidade da situação. Segundo dados do IPEA, grande parte das vítimas não denuncia por medo de retaliação. Desse modo, o ciclo de violência se perpetua silenciosamente.",
    },
    {
      tipo: "desenvolvimento2",
      texto:
        'Em segundo lugar, a naturalização histórica da violência de gênero dificulta a ruptura desse padrão. Conforme a filósofa Simone de Beauvoir, a mulher foi historicamente construída como o "outro" em relação ao homem. Logo, essa hierarquia ainda sustenta relações abusivas.',
      apontamentosPossiveis: [
        {
          trecho: 'a mulher foi historicamente construída como o "outro" em relação ao homem',
          tipo: "normaCulta",
        },
        { trecho: "essa hierarquia ainda sustenta relações abusivas", tipo: "conectivoFechamento" },
      ],
      reescrita:
        'Em segundo lugar, a naturalização histórica da violência de gênero dificulta a ruptura desse padrão, uma vez que papéis desiguais entre homens e mulheres foram reforçados por séculos. Conforme Simone de Beauvoir, a mulher foi historicamente construída como o "outro" em relação ao homem. Dessa forma, essa hierarquia ainda sustenta relações abusivas.',
    },
    {
      tipo: "conclusao",
      texto:
        "Portanto, o Ministério dos Direitos Humanos deve ampliar a rede de Casas da Mulher Brasileira por meio de repasses aos estados, com a finalidade de acolher vítimas. Em detalhe, campanhas educativas. Assim, a violência doméstica deixará de ser tratada como um problema privado.",
      apontamentosPossiveis: [
        { trecho: "Em detalhe, campanhas educativas", tipo: "detalhamentoCurto" },
      ],
      reescrita:
        "Portanto, o Ministério dos Direitos Humanos deve ampliar a rede de Casas da Mulher Brasileira por meio de repasses aos estados, com a finalidade de acolher vítimas com dignidade. Em detalhe, campanhas educativas nas escolas poderiam discutir relações saudáveis desde cedo. Assim, a violência doméstica deixará de ser tratada como um problema privado.",
    },
  ],
};

function bucket(nota: number): "baixo" | "alto" {
  return nota <= 80 ? "baixo" : "alto";
}

const JUSTIFICATIVAS: Record<CodigoCompetencia, Record<"baixo" | "alto", string>> = {
  c1: {
    baixo: "Vários desvios de norma culta ao longo do texto; revise pontuação e concordância.",
    alto: "Boa norma culta, com poucos desvios pontuais.",
  },
  c2: {
    baixo: "Estrutura dissertativa ainda incompleta; revise a organização dos parágrafos.",
    alto: "Tema bem compreendido e estrutura dissertativa clara.",
  },
  c3: {
    baixo: "Argumentação frágil, com repertório pouco conectado ao tema.",
    alto: "Argumentação consistente, com repertório bem relacionado ao tema.",
  },
  c4: {
    baixo: "Conectivos trocados ou ausentes entre os parágrafos.",
    alto: "Bom uso de conectivos entre os parágrafos.",
  },
  c5: {
    baixo: "Proposta de intervenção incompleta, com agente genérico.",
    alto: "Proposta de intervenção completa, com agente específico.",
  },
};

const RESUMOS: Record<"baixo" | "medio" | "alto", string> = {
  baixo:
    "Sua redação ainda precisa de ajustes estruturais importantes. Revise a introdução, os desenvolvimentos e a proposta de intervenção usando o método — as ideias já estão lá, falta organizá-las na estrutura certa.",
  medio:
    "Você já domina boa parte da estrutura. Para subir a nota, foque nos pontos marcados em cada parágrafo, principalmente a frase de motivo e os conectivos.",
  alto: "Excelente evolução! A redação está muito próxima do modelo ideal — ajuste os últimos detalhes apontados e você chega à nota máxima.",
};

const POOL_REPERTORIO = [
  "constituicao-1988",
  "ibge",
  "empatia",
  "cidadania",
  "bourdieu",
  "lei-organica-saude",
  "oms-ms",
];

function montarChecklist(
  tipo: TipoParagrafo,
  tiposAplicados: TipoProblema[],
): Paragrafo["checklistModelo"] {
  const itensComFalha = new Set(
    tiposAplicados.map((t) => ITEM_POR_TIPO[t]?.[tipo]).filter((x): x is string => Boolean(x)),
  );
  return CHECKLIST_BASE[tipo].map((item) => {
    if (!itensComFalha.has(item)) return { item, ok: true };
    const tipoCorrespondente = tiposAplicados.find((t) => ITEM_POR_TIPO[t]?.[tipo] === item);
    return {
      item,
      ok: false,
      observacao: tipoCorrespondente ? TIPOS_PROBLEMA[tipoCorrespondente].problema : undefined,
    };
  });
}

function montarParagrafo(template: ParagrafoTemplate, nivel: 0 | 1 | 2): Paragrafo {
  let quantidade = Math.min(nivel, template.apontamentosPossiveis.length);
  if (template.tipo === "conclusao" && nivel === 0 && template.apontamentosPossiveis.length > 0) {
    quantidade = 1; // a proposta é o último detalhe a ficar perfeito, mesmo em notas altas
  }
  const aplicados = template.apontamentosPossiveis.slice(0, quantidade);
  const apontamentos = aplicados.map((a) => ({
    trecho: a.trecho,
    ...TIPOS_PROBLEMA[a.tipo],
  }));
  return {
    tipo: template.tipo,
    textoOriginal: template.texto,
    status: apontamentos.length > 0 ? "ajustes" : "adequado",
    apontamentos,
    reescrita: apontamentos.length > 0 ? template.reescrita : null,
    checklistModelo: montarChecklist(
      template.tipo,
      aplicados.map((a) => a.tipo),
    ),
  };
}

function montarCorrecao(
  tema: TemaTemplate,
  competencias: Record<CodigoCompetencia, number>,
  nivel: 0 | 1 | 2,
  indiceRepertorio: number,
): Correcao {
  const notaTotal = Object.values(competencias).reduce((a, b) => a + b, 0);
  const resumoNivel = notaTotal >= 800 ? "alto" : notaTotal >= 640 ? "medio" : "baixo";
  const repertorioSugestoes = [0, 2, 4].map((offset) => {
    const id = POOL_REPERTORIO[(indiceRepertorio + offset) % POOL_REPERTORIO.length];
    return {
      id,
      porqueCombina: "Repertório de exemplo, usado aqui só para ilustrar como a seção aparece.",
    };
  });

  return {
    tema: tema.tema,
    temaDetectado: false,
    transcricao: null,
    completa: true,
    competencias: {
      c1: { nota: competencias.c1, justificativa: JUSTIFICATIVAS.c1[bucket(competencias.c1)] },
      c2: { nota: competencias.c2, justificativa: JUSTIFICATIVAS.c2[bucket(competencias.c2)] },
      c3: { nota: competencias.c3, justificativa: JUSTIFICATIVAS.c3[bucket(competencias.c3)] },
      c4: { nota: competencias.c4, justificativa: JUSTIFICATIVAS.c4[bucket(competencias.c4)] },
      c5: { nota: competencias.c5, justificativa: JUSTIFICATIVAS.c5[bucket(competencias.c5)] },
    },
    notaTotal,
    paragrafos: tema.paragrafos.map((p) => montarParagrafo(p, nivel)),
    repertorioSugestoes,
    resumoProfessor: RESUMOS[resumoNivel],
  };
}

type PlanoEntrada = {
  diasAtras: number;
  tema: TemaTemplate;
  competencias: Record<CodigoCompetencia, number>;
  nivel: 0 | 1 | 2;
};

const PLANO: PlanoEntrada[] = [
  {
    diasAtras: 42,
    tema: TEMA_SURDOS,
    nivel: 2,
    competencias: { c1: 80, c2: 120, c3: 120, c4: 120, c5: 80 },
  },
  {
    diasAtras: 35,
    tema: TEMA_DESINFORMACAO,
    nivel: 2,
    competencias: { c1: 80, c2: 160, c3: 120, c4: 120, c5: 80 },
  },
  {
    diasAtras: 28,
    tema: TEMA_SUS,
    nivel: 1,
    competencias: { c1: 120, c2: 160, c3: 160, c4: 160, c5: 80 },
  },
  {
    diasAtras: 21,
    tema: TEMA_VIOLENCIA,
    nivel: 1,
    competencias: { c1: 80, c2: 160, c3: 120, c4: 160, c5: 80 },
  },
  {
    diasAtras: 14,
    tema: TEMA_SURDOS,
    nivel: 1,
    competencias: { c1: 120, c2: 160, c3: 160, c4: 160, c5: 120 },
  },
  {
    diasAtras: 7,
    tema: TEMA_SUS,
    nivel: 0,
    competencias: { c1: 160, c2: 160, c3: 160, c4: 160, c5: 160 },
  },
  {
    diasAtras: 1,
    tema: TEMA_DESINFORMACAO,
    nivel: 0,
    competencias: { c1: 160, c2: 200, c3: 160, c4: 200, c5: 160 },
  },
];

/** Gera as 7 correções de demonstração (data relativa a agora), validadas com o schema real. */
export function gerarHistoricoDemo(): EntradaHistorico[] {
  const agora = Date.now();
  return PLANO.map((p, i) => {
    const resultado = montarCorrecao(p.tema, p.competencias, p.nivel, i);
    const validado = CorrecaoSchema.parse(resultado); // nunca deve falhar — dados gerados aqui mesmo
    const criadoEm = new Date(agora - p.diasAtras * 86_400_000).toISOString();
    return {
      id: `demo-${i}-${p.diasAtras}`,
      criadoEm,
      tema: validado.tema,
      notaTotal: validado.notaTotal,
      competencias: p.competencias,
      resultado: validado,
      textoOriginal: validado.paragrafos.map((par) => par.textoOriginal).join("\n\n"),
      demo: true,
    };
  });
}
