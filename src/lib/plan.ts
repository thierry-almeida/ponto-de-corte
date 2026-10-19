import type { PlanSettings } from '../types'
import { disciplines } from '../data/disciplines'
import { addDays, dateKey, parseDateKey } from './utils'
import type { AppStats } from './stats'

export type PlanBlock = {
  key: string
  date: string
  disciplineId: string
  kind: 'Questões' | 'Resumo' | 'Flashcards'
  detail: string
  minutes: number
  index: number
  done: boolean
}

const KINDS: PlanBlock['kind'][] = ['Questões', 'Resumo', 'Questões', 'Flashcards']

export const generatePlan = (settings: PlanSettings, stats: AppStats, done: string[]): PlanBlock[] => {
  const blocks: PlanBlock[] = []
  const start = parseDateKey(settings.startDate)
  const blocksPerDay = Math.max(1, Math.min(6, Math.round((settings.hoursPerDay * 60) / 50)))
  const weights = disciplines
    .map((discipline) => {
      const stat = stats.byDiscipline.find((item) => item.disciplineId === discipline.id)
      const weakBoost = stat && stat.attempts >= 2 && stat.accuracy < 70 ? 2.4 : 0
      return { discipline, score: discipline.weight * 2 + weakBoost }
    })
    .sort((a, b) => b.score - a.score)

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const date = addDays(start, dayIndex)
    const key = dateKey(date)
    if (!settings.days.includes(date.getDay())) continue
    for (let slot = 0; slot < blocksPerDay; slot += 1) {
      const pick = weights[(dayIndex * 3 + slot) % weights.length].discipline
      const kind = KINDS[(dayIndex + slot) % KINDS.length]
      const detail =
        kind === 'Questões'
          ? `${10 + ((dayIndex + slot) % 3) * 5} questões`
          : kind === 'Resumo'
            ? '1 aula + anotações'
            : `${15 + ((dayIndex + slot) % 3) * 5} cartões`
      blocks.push({
        key: `${key}-${pick.id}-${slot}`,
        date: key,
        disciplineId: pick.id,
        kind,
        detail,
        minutes: 50,
        index: slot,
        done: done.includes(`${key}-${pick.id}-${slot}`),
      })
    }
  }
  return blocks
}

export const planDayLabel = (date: string) =>
  parseDateKey(date).toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '')

export const planDateLabel = (date: string) =>
  parseDateKey(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
