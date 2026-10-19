import type { Material } from '../types'

export const materials: Material[] = [
  {
    disciplineId: 'portugues',
    title: 'Português para provas objetivas',
    intro:
      'O que mais cai: concordância, regência, crase, pontuação e interpretação. Resumos curtos, com as pegadinhas que as bancas repetem.',
    source: 'Revisado conforme o Acordo Ortográfico e gramáticas de referência.',
    lessons: [
      {
        id: 'lp-m1',
        title: 'Crase sem decoreba',
        minutes: 6,
        summary: 'Entenda a crase como encontro de dois “a” e resolva a maioria das questões por substituição.',
        sections: [
          {
            title: 'O teste que resolve',
            body: 'Crase é a fusão da preposição “a” com o artigo feminino “a(s)” ou com pronomes demonstrativos. Troque o termo feminino por um masculino: se aparecer “ao”, há crase. “Assistimos à palestra” vira “assistimos ao debate”.',
            points: [
              'Antes de palavra masculina: sem crase (a pé, a prazo).',
              'Antes de verbo: sem crase (começou a chover).',
              'Antes de “aquela/aquele”: com crase (àquela questão).',
              'Antes de nome de cidade: só com determinante (à Brasília que conheci).',
            ],
          },
          {
            title: 'Casos especiais',
            body: '“Até a” admite crase facultativa. Antes de pronomes de tratamento, geralmente não há crase, exceto “senhora” e “senhorita”. Locuções femininas de tempo e modo levam crase: à noite, à vontade, às pressas. Já “a distância” só recebe crase quando determinada: “à distância de dois metros”.',
            points: ['Casa: “voltei a casa” (sem determinante) x “voltei à casa dos meus pais”.', 'Terra: “cheguei a terra” (sentido oposto a bordo) x “voltei à terra natal”.'],
          },
        ],
      },
      {
        id: 'lp-m2',
        title: 'Concordância que a banca cobra',
        minutes: 8,
        summary: 'Sujeito posposto, verbos impessoais, expressões partitivas e o famoso “haver/fazer”.',
        sections: [
          {
            title: 'Verbos impessoais',
            body: '“Haver” no sentido de existir e “fazer” indicando tempo decorrido ficam sempre na terceira pessoa do singular. O mesmo vale para “chover”, “nevar” e “haver” indicando tempo. Não confunda com “existir”, que concorda normalmente: “Existem dez vagas”.',
            points: ['Faz cinco anos que estudo.', 'Havia muitas dúvidas na sala.', 'Devem existir outras possibilidades.'],
          },
          {
            title: 'Sujeito composto e partitivo',
            body: 'Com sujeito composto posposto, o verbo pode concordar com todos ou com o mais próximo. Com expressões partitivas (“a maioria de”, “grande parte de”), a concordância pode ser com o núcleo ou com o especificador. Com “ou”, a concordância depende do sentido: exclusão ou inclusão.',
            points: ['A maioria dos candidatos estudou/estudaram.', 'Chegou o professor e os alunos.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'administrativo',
    title: 'Direito Administrativo essencial',
    intro: 'Princípios, atos, licitações e responsabilidade do Estado: a base que sustenta a maior parte das questões.',
    source: 'Baseado na Constituição Federal e na Lei nº 14.133/2021.',
    lessons: [
      {
        id: 'da-m1',
        title: 'Princípios e regime jurídico',
        minutes: 7,
        summary: 'Como a Administração se submete à lei e quais limites decorrem da supremacia do interesse público.',
        sections: [
          {
            title: 'Supremacia e indisponibilidade',
            body: 'A Administração atua com prerrogativas para atender ao interesse público, mas também sofre restrições que protegem o administrado. Desse binômio nasce o regime jurídico-administrativo. Nenhuma prerrogativa é um fim em si mesma: ela existe para viabilizar o interesse público.',
          },
          {
            title: 'LIMPE na prática',
            body: 'Legalidade, impessoalidade, moralidade, publicidade e eficiência. A impessoalidade veda favorecimentos e promoção pessoal; a publicidade é a regra, com sigilo excepcional; a eficiência cobra resultado sem afastar os controles. A moralidade não se confunde com moral comum: é a moral administrativa, ligada à lealdade institucional.',
            points: ['Desvio de finalidade é vício de legalidade em sentido amplo.', 'Autotutela permite revogar atos inconvenientes e anular atos ilegais.'],
          },
        ],
      },
      {
        id: 'da-m2',
        title: 'Licitações em cinco modalidades',
        minutes: 9,
        summary: 'As modalidades da Lei 14.133, seus usos típicos e as hipóteses de dispensa e inexigibilidade.',
        sections: [
          {
            title: 'Modalidades',
            body: 'Pregão (bens e serviços comuns), concorrência (obras, serviços especiais e bens não comuns), concurso (trabalho técnico, científico ou artístico), leilão (alienação de bens) e diálogo competitivo (soluções inovadoras). O convite não existe mais.',
            points: ['Pregão exige critério de julgamento por menor preço ou maior desconto.', 'Diálogo competitivo é novidade da Lei 14.133/2021.'],
          },
          {
            title: 'Contratação direta',
            body: 'Dispensa é hipótese prevista em lei; inexigibilidade ocorre quando a competição é inviável. A dispensa pode ser por valor ou por situações específicas, como emergência. Nos dois casos, a motivação e a instrução do processo são obrigatórias.',
            points: ['Emergência não pode decorrer de falta de planejamento do gestor.', 'Inexigibilidade clássica: fornecedor exclusivo.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'constitucional',
    title: 'Constituição sem mistério',
    intro: 'Direitos fundamentais, organização do Estado e controle de constitucionalidade com foco no que é cobrado.',
    source: 'Baseado na CF/88 e na jurisprudência do STF.',
    lessons: [
      {
        id: 'dc-m1',
        title: 'Direitos fundamentais: eficácia',
        minutes: 6,
        summary: 'Aplicação imediata, reserva do possível e os limites do retrocesso.',
        sections: [
          {
            title: 'O art. 5º, § 1º',
            body: 'As normas de direitos fundamentais têm aplicação imediata. Isso não elimina a necessidade de regulamentação em alguns casos, mas desloca o ônus: a ausência de lei não pode ser usada automaticamente para negar o direito. Em direitos sociais, a reserva do possível pode condicionar prestações, desde que o mínimo existencial seja preservado.',
          },
          {
            title: 'Colisão de direitos',
            body: 'Direitos fundamentais não são absolutos. A solução de colisões costuma usar proporcionalidade: adequação, necessidade e proporcionalidade em sentido estrito. O STF também reconhece efeito horizontal, ou seja, aplicação dos direitos nas relações entre particulares.',
            points: ['Retrocesso social é controlado em hipóteses de proteção insuficiente.', 'Direitos fundamentais não se esgotam no art. 5º.'],
          },
        ],
      },
      {
        id: 'dc-m2',
        title: 'Controle concentrado',
        minutes: 8,
        summary: 'ADI, ADC, ADPF e o efeito vinculante das decisões do STF.',
        sections: [
          {
            title: 'Quem pode agir',
            body: 'A ADI e a ADC têm legitimados do art. 103, entre eles Presidente, mesas do Congresso, Governadores, PGR, OAB e partidos com representação no Congresso. A ADPF exige pertinência temática e é subsidiária em relação a outros instrumentos.',
          },
          {
            title: 'Efeitos da decisão',
            body: 'Em regra, a decisão de mérito tem eficácia erga omnes e efeito vinculante. A modulação de efeitos é possível por razões de segurança jurídica ou excepcional interesse social, pelo voto de dois terços do STF.',
            points: ['ADI pode ter por objeto omissão inconstitucional.', 'Leis municipais são controladas no TJ local, salvo hipóteses específicas.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'penal',
    title: 'Penal do zero ao gabarito',
    intro: 'Legalidade, crimes contra a Administração e as regras de prescrição que derrubam candidato.',
    source: 'Código Penal e súmulas dos Tribunais Superiores.',
    lessons: [
      {
        id: 'dp-m1',
        title: 'Peculato e concussão',
        minutes: 7,
        summary: 'As fronteiras entre os crimes funcionais mais cobrados em provas bancárias.',
        sections: [
          {
            title: 'Peculato',
            body: 'Apropriar-se ou desviar bem de que o funcionário tem posse em razão do cargo. Também há peculato culposo, com pena menor e extinção pela reparação antes da sentença. O peculato-furto ocorre quando o funcionário se vale da facilidade do cargo para subtrair bem de terceiro.',
          },
          {
            title: 'Exigir, solicitar, receber',
            body: 'Concussão é exigir vantagem indevida; corrupção passiva é solicitar ou receber, ou aceitar promessa. A diferença está no verbo e no momento. “Exigir” pressupõe imposição; “solicitar” deixa a decisão para o outro.',
            points: ['Funcionário público para fins penais inclui quem exerce cargo, emprego ou função pública, ainda que temporariamente.', 'A reparação do dano pode extinguir o peculato culposo.'],
          },
        ],
      },
      {
        id: 'dp-m2',
        title: 'Prescrição em três camadas',
        minutes: 7,
        summary: 'Prescrição da pretensão punitiva, executória e retroativa sem confundir os prazos.',
        sections: [
          {
            title: 'Antes e depois da sentença',
            body: 'A prescrição da pretensão punitiva (PPP) pode ser em abstrato, calculada pela pena máxima, ou retroativa, após a sentença condenatória, pela pena aplicada. A prescrição da pretensão executória (PPE) começa com o trânsito em julgado da condenação.',
          },
          {
            title: 'Prazos do art. 109',
            body: 'Os prazos variam de 3 a 20 anos conforme a pena. Crimes com pena máxima inferior a 1 ano prescrevem em 3 anos. A idade do réu também interfere: menor de 21 anos na data do fato e maior de 70 na data da sentença têm prazos reduzidos pela metade.',
            points: ['A prescrição retroativa não pode ultrapassar o período entre fato e recebimento da denúncia.', 'A prescrição da pretensão executória é contada a partir do trânsito em julgado da condenação e tem causas próprias de interrupção.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'processual-penal',
    title: 'Processo penal comentado',
    intro: 'Inquérito, flagrante, provas e ação penal explicados em ordem de prova.',
    source: 'Código de Processo Penal e entendimento do STF/STJ.',
    lessons: [
      {
        id: 'pp-m1',
        title: 'Flagrante e audiência de custódia',
        minutes: 6,
        summary: 'Os 24 horas que aparecem em quase toda prova e as formalidades que não podem faltar.',
        sections: [
          {
            title: 'Comunicação e custódia',
            body: 'A prisão em flagrante deve ser comunicada imediatamente ao juiz, e o auto enviado em até 24 horas. A audiência de custódia também ocorre em até 24 horas, com apresentação do preso ao juiz. A ausência de comunicação pode tornar a prisão ilegal.',
          },
          {
            title: 'Espécies de flagrante',
            body: 'Próprio: o agente é surpreendido praticando o crime. Impróprio: é perseguido logo após. Presumido: é encontrado com objetos que façam presumir autoria. O flagrante preparado e o provocado são rejeitados pela jurisprudência quando há indução à prática do crime.',
            points: ['Crime permanente permite flagrante enquanto durar a permanência.', 'A fuga após o crime impede o flagrante próprio, mas pode configurar perseguição.'],
          },
        ],
      },
      {
        id: 'pp-m2',
        title: 'Provas ilícitas e derivadas',
        minutes: 6,
        summary: 'A árvore envenenada, a fonte independente e o limite da descoberta inevitável.',
        sections: [
          {
            title: 'Regra e exceções',
            body: 'Provas obtidas por meio ilícito são inadmissíveis. A ilicitude pode contaminar provas derivadas, mas não quando houver fonte independente ou descoberta inevitável. A defesa pode usar a prova ilícita quando necessária para absolvição, conforme entendimento do STF.',
          },
          {
            title: 'Ação penal',
            body: 'A ação penal pública incondicionada é a regra. Na condicionada, há representação da vítima ou requisição do Ministro da Justiça. A privada é subsidiária quando a pública não é oferecida no prazo legal.',
            points: ['Violência doméstica: lesão leve é pública incondicionada.', 'Representação é condição de procedibilidade, não de punibilidade.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'humanos',
    title: 'Direitos Humanos para concursos',
    intro: 'Os sistemas de proteção, a DUDH e os tratados que mais aparecem nas provas.',
    source: 'Declaração Universal, Pacto de San José e Convenção 169 da OIT.',
    lessons: [
      {
        id: 'dh-m1',
        title: 'DUDH e gerações de direitos',
        minutes: 5,
        summary: 'Por que a Declaração não é tratado e como isso muda a resposta na prova.',
        sections: [
          {
            title: 'Natureza jurídica',
            body: 'A DUDH foi adotada por resolução da Assembleia Geral da ONU em 1948. Não é tratado e não foi assinada nem ratificada. Ainda assim, serve de referência interpretativa e parte de seu conteúdo é reconhecida como costume internacional.',
          },
          {
            title: 'Sistema interamericano',
            body: 'A Comissão Interamericana recebe petições e recomenda soluções. A Corte Interamericana é o órgão jurisdicional. O Brasil reconheceu a jurisdição obrigatória da Corte em 1998. Casos internos devem, em regra, esgotar recursos antes de chegar ao sistema.',
            points: ['Pacto de San José: assinado em 1969, em vigor em 1978.', 'Protocolo de San Salvador trata de direitos econômicos, sociais e culturais.'],
          },
        ],
      },
      {
        id: 'dh-m2',
        title: 'Convenção 169 da OIT',
        minutes: 5,
        summary: 'Consulta prévia, autodeterminação e os detalhes que a banca cobra.',
        sections: [
          {
            title: 'Consulta prévia',
            body: 'A Convenção 169 exige consulta aos povos interessados sempre que medidas legislativas ou administrativas possam afetá-los. A consulta deve ser prévia, livre, informada e de boa-fé, com o objetivo de obter consentimento ou acordo.',
          },
          {
            title: 'Terras e direitos',
            body: 'A Convenção reconhece a relação especial dos povos indígenas com suas terras e assegura proteção aos direitos de propriedade e posse. Também prevê respeito a costumes e instituições próprias, desde que compatíveis com direitos fundamentais.',
            points: ['Brasil ratificou a Convenção 169 em 2002.', 'Consulta não se confunde com simples informação.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'contabilidade',
    title: 'Contabilidade para bancos',
    intro: 'Equação patrimonial, regime de competência, depreciação e demonstrações contábeis.',
    source: 'Lei nº 6.404/1976 e pronunciamentos do CPC.',
    lessons: [
      {
        id: 'cg-m1',
        title: 'A equação que resolve tudo',
        minutes: 6,
        summary: 'Ativo, passivo e patrimônio líquido: como montar a conta em segundos.',
        sections: [
          {
            title: 'Balanço patrimonial',
            body: 'Ativo é o conjunto de bens e direitos; passivo exigível são as obrigações com terceiros; patrimônio líquido é o capital próprio, residual. A equação fundamental é Ativo = Passivo + PL. Se o ativo cresce sem aumento de passivo, o PL aumenta.',
          },
          {
            title: 'Partidas dobradas',
            body: 'Cada lançamento tem débito e crédito de igual valor. Contas do ativo aumentam por débito; do passivo e do PL, por crédito. Receitas aumentam o PL e despesas o reduzem, o que conecta a demonstração do resultado ao balanço.',
            points: ['PL = Ativo − Passivo.', 'Lucro eleva o PL; prejuízo reduz.'],
          },
        ],
      },
      {
        id: 'cg-m2',
        title: 'Competência e depreciação',
        minutes: 7,
        summary: 'O reconhecimento de receitas e o cálculo linear que cai em prova.',
        sections: [
          {
            title: 'Regime de competência',
            body: 'Receitas e despesas são reconhecidas no período do fato gerador, não no momento do caixa. Uma venda a prazo entra na receita do período da venda. O regime de caixa olha apenas o fluxo financeiro e é usado em controles gerenciais específicos.',
          },
          {
            title: 'Depreciação linear',
            body: 'Depreciação = (custo − valor residual) ÷ vida útil. A depreciação começa quando o ativo está disponível para uso. Terrenos, em regra, não são depreciados. A contrapartida é uma despesa que reduz o resultado.',
            points: ['Exemplo: (60.000 − 6.000) ÷ 5 = 10.800 por ano.', 'A depreciação não é um fluxo de caixa.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'logica',
    title: 'Raciocínio lógico na prática',
    intro: 'Proposições, equivalências e sequências com atalhos para ganhar tempo na prova.',
    source: 'Matemática e lógica para concursos.',
    lessons: [
      {
        id: 'rl-m1',
        title: 'Condicionais sem erro',
        minutes: 6,
        summary: 'A tabela do “se... então” e as duas equivalências que mais aparecem.',
        sections: [
          {
            title: 'p → q',
            body: 'A condicional só é falsa quando o antecedente é verdadeiro e o consequente é falso (V → F). Suas equivalências principais são a contrapositiva (¬q → ¬p) e a disjunção (¬p ∨ q). A recíproca (q → p) não é equivalente.',
          },
          {
            title: 'Negação',
            body: 'A negação de “p → q” é “p ∧ ¬q”. Cuidado: negar não é inverter. Na negação de “todo A é B”, usa-se “algum A não é B”. Na negação de “nenhum A é B”, usa-se “algum A é B”.',
            points: ['“Se estudo, passo” negação: “estudo e não passo”.', '“Todo” vira “algum... não” em vez de “nenhum”.'],
          },
        ],
      },
      {
        id: 'rl-m2',
        title: 'Sequências e padrões',
        minutes: 5,
        summary: 'Descubra a regra antes de tentar calcular termos distantes.',
        sections: [
          {
            title: 'Diferenças e múltiplos',
            body: 'Compare diferenças sucessivas, depois segundas diferenças. Verifique também multiplicações e potências. Em sequências alternadas, separe termos de posição ímpar e par antes de concluir que o padrão quebrou.',
          },
          {
            title: 'Método de prova',
            body: 'Escreva a sequência com os índices (1, 2, 3...) e teste hipóteses simples: soma fixa, multiplicação, quadrados, Fibonacci. Se a questão pede o 100º termo, procure uma fórmula em vez de continuar a lista.',
            points: ['2, 6, 12, 20, 30 → n(n+1).', '1, 1, 2, 3, 5, 8 → Fibonacci.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'estatistica',
    title: 'Estatística descritiva e probabilidade',
    intro: 'Média, mediana, dispersão e probabilidade sem fórmulas decoradas.',
    source: 'Estatística básica aplicada a concursos.',
    lessons: [
      {
        id: 'es-m1',
        title: 'Tendência central e dispersão',
        minutes: 7,
        summary: 'Escolha a medida certa e interprete o desvio padrão.',
        sections: [
          {
            title: 'Média, mediana e moda',
            body: 'A média usa todos os valores e é sensível a extremos. A mediana divide os dados ordenados ao meio e resiste melhor a outliers. A moda é o valor mais frequente. Em distribuições assimétricas, as três medidas se afastam.',
          },
          {
            title: 'Dispersão',
            body: 'Variância é a média dos quadrados dos desvios em relação à média. O desvio padrão é a raiz quadrada da variância, na mesma unidade dos dados. Quanto maior, mais dispersos os valores. O coeficiente de variação compara dispersões de escalas diferentes.',
            points: ['Mediana de 7 valores: 4º elemento.', 'Desvio padrão nunca é negativo.'],
          },
        ],
      },
      {
        id: 'es-m2',
        title: 'Probabilidade sem susto',
        minutes: 6,
        summary: 'Casos favoráveis, união, interseção e independência.',
        sections: [
          {
            title: 'Regras básicas',
            body: 'Probabilidade é casos favoráveis divididos por casos possíveis. P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Para eventos independentes, P(A ∩ B) = P(A) · P(B). A probabilidade condicional é P(A|B) = P(A ∩ B) / P(B).',
          },
          {
            title: 'Leitura do enunciado',
            body: '“E” costuma indicar interseção; “ou” costuma indicar união. “Dado que” indica condicional. Em sorteios sem reposição, o espaço amostral diminui a cada retirada, o que altera a probabilidade.',
            points: ['Com reposição: eventos independentes.', 'Sem reposição: recalcule o denominador.'],
          },
        ],
      },
    ],
  },
  {
    disciplineId: 'informatica',
    title: 'Informática que cai em prova',
    intro: 'Excel, segurança, redes e conceitos de banco de dados em resumos diretos.',
    source: 'Microsoft 365, boas práticas de segurança e fundamentos de redes.',
    lessons: [
      {
        id: 'in-m1',
        title: 'Excel: fórmulas essenciais',
        minutes: 6,
        summary: 'SOMA, MÉDIA, SE, CONT.SE e a diferença entre referência relativa e absoluta.',
        sections: [
          {
            title: 'Operadores e intervalos',
            body: 'Dois-pontos (:) cria intervalo contínuo; ponto e vírgula (;) separa argumentos de uma função. O cifrão ($) fixa linha ou coluna. Assim, A1:A5 é intervalo; A1;A5 são duas células separadas.',
          },
          {
            title: 'Funções que aparecem',
            body: 'SOMA, MÉDIA, MAIOR, MENOR, SE, CONT.SE, SOMASE e PROCV. A função SE recebe teste, valor se verdadeiro e valor se falso. Erros comuns: confundir CONT.SE (conta) com SOMASE (soma) e esquecer as aspas em critérios de texto.',
            points: ['$A$1 fixa célula; A$1 fixa linha.', '#DIV/0! indica divisão por zero.'],
          },
        ],
      },
      {
        id: 'in-m2',
        title: 'Segurança e redes',
        minutes: 5,
        summary: 'Phishing, 2FA, DNS e HTTPS na linguagem da prova.',
        sections: [
          {
            title: 'Ataques e proteção',
            body: 'Phishing engana o usuário para obter credenciais; ransomware cifra dados e pede resgate; spyware monitora atividades. A autenticação de dois fatores combina algo que você sabe com algo que você tem ou é. Senhas fortes e exclusivas continuam essenciais.',
          },
          {
            title: 'Redes',
            body: 'DNS traduz nomes em IPs. DHCP distribui endereços. HTTPS usa TLS para proteger a comunicação. SMTP envia e-mail; IMAP e POP3 recebem. VPN cria túnel criptografado, mas não substitui antivírus nem autenticação.',
            points: ['HTTPS protege confidencialidade e integridade em trânsito.', 'DNS não é protocolo de e-mail.'],
          },
        ],
      },
    ],
  },
]

export const materialByDiscipline = (disciplineId: string) =>
  materials.find((material) => material.disciplineId === disciplineId)

export const allLessons = materials.flatMap((material) =>
  material.lessons.map((lesson) => ({ ...lesson, disciplineId: material.disciplineId })),
)

export const totalLessonMinutes = (disciplineId: string) => {
  const material = materialByDiscipline(disciplineId)
  return material ? material.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0) : 0
}
