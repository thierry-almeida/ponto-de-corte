import type { Flashcard } from '../types'

export const flashcards: Flashcard[] = [
  { id: 'fc-lp-1', disciplineId: 'portugues', front: 'Quando o “cujo” recebe artigo depois de si?', back: 'Nunca. “Cujo” é pronome relativo que já exprime posse e liga dois substantivos sem artigo intermediário. Ex.: o candidato cujas provas foram corrigidas.', tag: 'pegadinha' },
  { id: 'fc-lp-2', disciplineId: 'portugues', front: '“Fazem dez anos” está correto?', back: 'Não. “Fazer” indicando tempo decorrido é impessoal: “Faz dez anos”. O mesmo vale para “haver”: “Há dez anos”.', tag: 'definição' },
  { id: 'fc-lp-3', disciplineId: 'portugues', front: 'Crase antes de nome de cidade: quando ocorre?', back: 'Só quando a cidade vem determinada: “voltei à Brasília que conheci”. Sem determinante, não há crase: “voltei a Brasília”.', tag: 'exceção' },

  { id: 'fc-da-1', disciplineId: 'administrativo', front: 'Quais são os atributos do ato administrativo?', back: 'Presunção de legitimidade, imperatividade, autoexecutoriedade e tipicidade. Discricionariedade não é atributo.', tag: 'definição' },
  { id: 'fc-da-2', disciplineId: 'administrativo', front: 'Quantas modalidades de licitação existem na Lei 14.133/2021?', back: 'Cinco: pregão, concorrência, concurso, leilão e diálogo competitivo. O convite não foi mantido.', tag: 'definição' },
  { id: 'fc-da-3', disciplineId: 'administrativo', front: 'Qual é a teoria adotada para a responsabilidade civil do Estado?', back: 'Em regra, a teoria do risco administrativo, com responsabilidade objetiva. O Estado pode afastá-la provando culpa exclusiva da vítima, caso fortuito ou força maior.', tag: 'definição' },

  { id: 'fc-dc-1', disciplineId: 'constitucional', front: 'Habeas data x mandado de segurança: qual protege informação pessoal?', back: 'Habeas data. Ele assegura conhecimento ou retificação de informações relativas à pessoa do impetrante em registros públicos.', tag: 'definição' },
  { id: 'fc-dc-2', disciplineId: 'constitucional', front: 'Qual a eficácia das normas de direitos fundamentais?', back: 'Aplicação imediata, nos termos do art. 5º, § 1º, da CF. Isso não elimina a necessidade de regulamentação em todos os casos.', tag: 'definição' },
  { id: 'fc-dc-3', disciplineId: 'constitucional', front: 'Legislar sobre direito penal é competência de quem?', back: 'Privativa da União (art. 22, I). Já proteger o meio ambiente é competência material comum (art. 23).', tag: 'pegadinha' },

  { id: 'fc-dp-1', disciplineId: 'penal', front: 'Peculato x concussão: qual exige vantagem indevida?', back: 'Concussão é exigir vantagem indevida. Peculato é apropriar-se ou desviar bem de que o funcionário tem posse em razão do cargo.', tag: 'definição' },
  { id: 'fc-dp-2', disciplineId: 'penal', front: 'Como se calcula a prescrição da pretensão punitiva em abstrato?', back: 'Com base na pena máxima cominada ao delito, aplicando-se os prazos do art. 109 do Código Penal.', tag: 'definição' },
  { id: 'fc-dp-3', disciplineId: 'penal', front: 'Uma só conduta, dois resultados típicos: qual concurso?', back: 'Concurso formal (art. 70 do CP). Se houver pluralidade de condutas, será concurso material ou crime continuado.', tag: 'pegadinha' },

  { id: 'fc-pp-1', disciplineId: 'processual-penal', front: 'O inquérito policial é indispensável para denunciar?', back: 'Não. O inquérito é dispensável; o Ministério Público pode se valer de outros elementos de informação.', tag: 'definição' },
  { id: 'fc-pp-2', disciplineId: 'processual-penal', front: 'Qual o prazo para a audiência de custódia?', back: 'Em regra, 24 horas após a prisão, com apresentação do preso ao juiz. A comunicação da prisão também deve ser imediata.', tag: 'definição' },
  { id: 'fc-pp-3', disciplineId: 'processual-penal', front: 'O que é a teoria dos frutos da árvore envenenada?', back: 'A prova derivada de prova ilícita também é inadmissível, salvo fonte independente ou descoberta inevitável.', tag: 'definição' },

  { id: 'fc-dh-1', disciplineId: 'humanos', front: 'A DUDH é um tratado internacional?', back: 'Não. Foi adotada por resolução da Assembleia Geral da ONU em 1948 e não passou por assinatura e ratificação.', tag: 'pegadinha' },
  { id: 'fc-dh-2', disciplineId: 'humanos', front: 'Qual é o órgão jurisdicional do sistema interamericano?', back: 'A Corte Interamericana de Direitos Humanos, com sede em San José. A Comissão não julga com caráter jurisdicional.', tag: 'definição' },
  { id: 'fc-dh-3', disciplineId: 'humanos', front: 'O que a Convenção 169 da OIT exige antes de medidas que afetem povos indígenas?', back: 'Consulta prévia, livre, informada e de boa-fé, com objetivo de obter consentimento ou acordo.', tag: 'definição' },

  { id: 'fc-cg-1', disciplineId: 'contabilidade', front: 'Qual é a equação fundamental do patrimônio?', back: 'Ativo = Passivo + Patrimônio Líquido. Logo, PL = Ativo − Passivo.', tag: 'definição' },
  { id: 'fc-cg-2', disciplineId: 'contabilidade', front: 'Regime de competência x regime de caixa', back: 'Competência reconhece receitas e despesas no período do fato gerador. Caixa considera o efetivo recebimento ou pagamento.', tag: 'definição' },
  { id: 'fc-cg-3', disciplineId: 'contabilidade', front: 'Fórmula da depreciação linear', back: '(Custo − valor residual) ÷ vida útil. A depreciação é uma despesa, não um fluxo de caixa.', tag: 'definição' },

  { id: 'fc-rl-1', disciplineId: 'logica', front: 'Qual é a negação de “todo A é B”?', back: '“Algum A não é B”. Não é “nenhum A é B”.', tag: 'pegadinha' },
  { id: 'fc-rl-2', disciplineId: 'logica', front: 'Qual é a contrapositiva de p → q?', back: '¬q → ¬p. É logicamente equivalente à condicional original. A recíproca q → p não é.', tag: 'definição' },
  { id: 'fc-rl-3', disciplineId: 'logica', front: '“Que dia é hoje?” é proposição lógica?', back: 'Não. Proposições são sentenças declarativas que podem ser verdadeiras ou falsas. Perguntas e ordens não entram.', tag: 'pegadinha' },

  { id: 'fc-es-1', disciplineId: 'estatistica', front: 'Média, mediana e moda: qual resiste a valores extremos?', back: 'A mediana. A média é sensível a outliers; a moda é o valor mais frequente.', tag: 'definição' },
  { id: 'fc-es-2', disciplineId: 'estatistica', front: 'O que mede o desvio padrão?', back: 'A dispersão dos dados em torno da média. É a raiz quadrada da variância e está na mesma unidade dos dados.', tag: 'definição' },
  { id: 'fc-es-3', disciplineId: 'estatistica', front: 'Fórmula da probabilidade condicional', back: 'P(A|B) = P(A ∩ B) / P(B), com P(B) > 0.', tag: 'definição' },

  { id: 'fc-in-1', disciplineId: 'informatica', front: 'Como somar o intervalo A1:A5 no Excel?', back: '=SOMA(A1:A5). Os dois-pontos indicam intervalo contínuo; o ponto e vírgula separa argumentos distintos.', tag: 'definição' },
  { id: 'fc-in-2', disciplineId: 'informatica', front: 'O que a autenticação de dois fatores acrescenta?', back: 'Uma segunda prova de identidade, além da senha — algo que você tem (app, token) ou é (biometria).', tag: 'definição' },
  { id: 'fc-in-3', disciplineId: 'informatica', front: 'DNS, DHCP e HTTPS: o que cada um faz?', back: 'DNS traduz nomes em IPs; DHCP distribui endereços IP; HTTPS protege a comunicação com TLS.', tag: 'definição' },
]

export const flashcardById = (id: string) => flashcards.find((card) => card.id === id) ?? flashcards[0]
