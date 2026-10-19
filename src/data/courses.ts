import type { Course } from '../types'

export const courses: Course[] = [
  {
    id: 'curso-adm',
    title: 'Direito Administrativo do zero ao edital',
    teacher: 'Marina Prado',
    disciplineId: 'administrativo',
    level: 'Fundamentos',
    hours: 8,
    lessons: 24,
    description:
      'Um percurso direto pelos princípios, atos, licitações e responsabilidade civil, com mapas de prova e questões comentadas ao final de cada módulo.',
    featured: true,
    modules: [
      {
        title: 'Base constitucional',
        lessons: [
          { title: 'Administração pública na CF', minutes: 32 },
          { title: 'Princípios expressos e implícitos', minutes: 28 },
          { title: 'Regime jurídico-administrativo', minutes: 24 },
        ],
      },
      {
        title: 'Atos e poderes',
        lessons: [
          { title: 'Elementos do ato administrativo', minutes: 35 },
          { title: 'Poderes administrativos', minutes: 30 },
          { title: 'Extinção dos atos', minutes: 22 },
        ],
      },
      {
        title: 'Licitações e contratos',
        lessons: [
          { title: 'Lei 14.133/2021: visão geral', minutes: 40 },
          { title: 'Modalidades e critérios', minutes: 34 },
          { title: 'Dispensa e inexigibilidade', minutes: 31 },
        ],
      },
    ],
  },
  {
    id: 'curso-portugues',
    title: 'Português para bancas: interpretação e gramática',
    teacher: 'Rafael Nunes',
    disciplineId: 'portugues',
    level: 'Intermediário',
    hours: 6,
    lessons: 18,
    description:
      'Leia o enunciado como a banca escreveu. Um método para interpretar textos, resolver questões de gramática e não cair nas alternativas quase certas.',
    featured: true,
    modules: [
      {
        title: 'Interpretação',
        lessons: [
          { title: 'O que a banca quer dizer', minutes: 26 },
          { title: 'Inferência x extrapolação', minutes: 30 },
          { title: 'Coesão e referenciação', minutes: 28 },
        ],
      },
      {
        title: 'Gramática de prova',
        lessons: [
          { title: 'Concordância verbal', minutes: 33 },
          { title: 'Regência e crase', minutes: 36 },
          { title: 'Pontuação', minutes: 29 },
        ],
      },
      {
        title: 'Revisão',
        lessons: [
          { title: 'Erros que mais derrubam', minutes: 25 },
          { title: 'Simulado comentado', minutes: 45 },
        ],
      },
    ],
  },
  {
    id: 'curso-rlm',
    title: 'Raciocínio lógico com método',
    teacher: 'Camila Torres',
    disciplineId: 'logica',
    level: 'Fundamentos',
    hours: 5,
    lessons: 16,
    description:
      'Proposições, tabelas-verdade, equivalências e sequências. Aprenda a montar o esquema antes de olhar para as alternativas.',
    modules: [
      {
        title: 'Lógica proposicional',
        lessons: [
          { title: 'Proposição e conectivos', minutes: 28 },
          { title: 'Tabela-verdade sem medo', minutes: 32 },
          { title: 'Equivalências e negações', minutes: 30 },
        ],
      },
      {
        title: 'Raciocínio quantitativo',
        lessons: [
          { title: 'Sequências e padrões', minutes: 26 },
          { title: 'Problemas de contagem', minutes: 34 },
          { title: 'Probabilidade básica', minutes: 31 },
        ],
      },
    ],
  },
  {
    id: 'curso-contabilidade',
    title: 'Contabilidade bancária na prática',
    teacher: 'André Lopes',
    disciplineId: 'contabilidade',
    level: 'Intermediário',
    hours: 7,
    lessons: 20,
    description:
      'Balanço, DRE, regime de competência e os indicadores que aparecem nas provas de bancos públicos.',
    modules: [
      {
        title: 'Demonstrações',
        lessons: [
          { title: 'Balanço patrimonial', minutes: 38 },
          { title: 'DRE passo a passo', minutes: 34 },
          { title: 'Fluxo de caixa', minutes: 30 },
        ],
      },
      {
        title: 'Tópicos cobrados',
        lessons: [
          { title: 'Depreciação e amortização', minutes: 27 },
          { title: 'Provisões e contingências', minutes: 29 },
          { title: 'Análise de indicadores', minutes: 36 },
        ],
      },
    ],
  },
]

export const courseById = (id: string) => courses.find((course) => course.id === id)
