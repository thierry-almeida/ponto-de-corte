import type { Discipline } from '../types'

export const disciplines: Discipline[] = [
  { id: 'portugues', name: 'Língua Portuguesa', short: 'LP', color: '#3157b7', weight: 3 },
  { id: 'administrativo', name: 'Direito Administrativo', short: 'DA', color: '#2c7a5e', weight: 3 },
  { id: 'constitucional', name: 'Direito Constitucional', short: 'DC', color: '#9a4f9a', weight: 3 },
  { id: 'penal', name: 'Direito Penal', short: 'DP', color: '#b3452f', weight: 2 },
  { id: 'processual-penal', name: 'Direito Processual Penal', short: 'PP', color: '#87632a', weight: 2 },
  { id: 'humanos', name: 'Direitos Humanos', short: 'DH', color: '#2f6f8f', weight: 2 },
  { id: 'contabilidade', name: 'Contabilidade Geral', short: 'CG', color: '#58633f', weight: 2 },
  { id: 'logica', name: 'Raciocínio Lógico', short: 'RL', color: '#7a5bb5', weight: 2 },
  { id: 'estatistica', name: 'Estatística', short: 'ES', color: '#a15a34', weight: 1 },
  { id: 'informatica', name: 'Informática', short: 'IN', color: '#3f6f73', weight: 1 },
]

export const disciplineById = (id: string) =>
  disciplines.find((discipline) => discipline.id === id) ?? disciplines[0]

export const upcomingDisciplines = [
  'Legislação Penal Especial',
  'Criminologia',
  'Medicina Legal',
  'Direito Penal Militar',
  'Direito Processual Penal Militar',
  'Direito da Criança e do Adolescente',
  'Matemática',
  'Administração Geral',
  'Administração Pública',
  'Arquivologia',
  'Código de Trânsito Brasileiro',
  'Resoluções do Contran',
  'Ética no Serviço Público',
]

export const areas = [
  'Carreiras bancárias — Banco do Brasil, Caixa, Banestes e outros',
  'Carreiras policiais — Polícias, bombeiros, perícia e segurança',
  'Carreiras fiscais — Receita Federal, SEFAZ e tribunais de contas',
  'Carreiras administrativas — Tribunais, prefeituras e autarquias',
  'Carreiras jurídicas — Magistratura, MP, defensoria e procuradorias',
]

export const targets = [
  'Banco do Brasil — Escriturário',
  'Caixa Econômica Federal — Técnico Bancário',
  'Banestes — Escriturário',
  'Receita Federal — Auditor Fiscal',
  'Polícia Federal — Agente',
  'Tribunal de Justiça — Analista Judiciário',
  'Ainda não decidi',
]
