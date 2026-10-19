import type { AppState, Attempt } from '../types'
import { addDays, dateKey, parseDateKey, percent } from './utils'

export type DisciplineStats = {
  disciplineId: string
  attempts: number
  correct: number
  accuracy: number
  seconds: number
}

export type AppStats = {
  todayAttempts: number
  todayCorrect: number
  totalAttempts: number
  uniqueQuestions: number
  accuracy: number
  streak: number
  avgSeconds: number
  last30: { date: string; count: number; correct: number }[]
  byDiscipline: DisciplineStats[]
  weak: DisciplineStats[]
  strongest: DisciplineStats[]
}

export const computeStats = (state: AppState): AppStats => {
  const attempts = state.attempts
  const today = dateKey()
  const todayAttemptsList = attempts.filter((attempt) => attempt.at.slice(0, 10) === today)
  const correct = attempts.filter((attempt) => attempt.correct).length

  const daysWithActivity = new Set(attempts.map((attempt) => attempt.at.slice(0, 10)))
  let streak = 0
  let cursor = new Date()
  if (!daysWithActivity.has(dateKey(cursor))) cursor = addDays(cursor, -1)
  while (daysWithActivity.has(dateKey(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  const last30 = Array.from({ length: 30 }, (_, index) => {
    const date = dateKey(addDays(new Date(), index - 29))
    const dayAttempts = attempts.filter((attempt) => attempt.at.slice(0, 10) === date)
    return { date, count: dayAttempts.length, correct: dayAttempts.filter((a) => a.correct).length }
  })

  const grouped = new Map<string, Attempt[]>()
  attempts.forEach((attempt) => {
    const list = grouped.get(attempt.disciplineId) ?? []
    list.push(attempt)
    grouped.set(attempt.disciplineId, list)
  })
  const byDiscipline = Array.from(grouped.entries()).map(([disciplineId, list]) => ({
    disciplineId,
    attempts: list.length,
    correct: list.filter((attempt) => attempt.correct).length,
    accuracy: percent(list.filter((attempt) => attempt.correct).length, list.length),
    seconds: list.reduce((total, attempt) => total + attempt.seconds, 0),
  }))

  const weak = byDiscipline
    .filter((item) => item.attempts >= 2)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)

  const strongest = [...byDiscipline].filter((item) => item.attempts >= 2).sort((a, b) => b.accuracy - a.accuracy).slice(0, 3)

  const totalSeconds = attempts.reduce((total, attempt) => total + attempt.seconds, 0)

  return {
    todayAttempts: todayAttemptsList.length,
    todayCorrect: todayAttemptsList.filter((attempt) => attempt.correct).length,
    totalAttempts: attempts.length,
    uniqueQuestions: new Set(attempts.map((attempt) => attempt.questionId)).size,
    accuracy: percent(correct, attempts.length),
    streak,
    avgSeconds: attempts.length ? Math.round(totalSeconds / attempts.length) : 0,
    last30,
    byDiscipline,
    weak,
    strongest,
  }
}

export const errorQuestionIds = (state: AppState) =>
  Object.entries(state.solved)
    .filter(([, value]) => !value.correct)
    .sort((a, b) => (a[1].at < b[1].at ? 1 : -1))
    .map(([id]) => id)

export const todayErrors = (state: AppState) => {
  const today = dateKey()
  return errorQuestionIds(state).filter((id) => {
    const solved = state.solved[id]
    return solved && solved.at.slice(0, 10) === today
  })
}

export const last30Days = (state: AppState, days = 7) => {
  const result: { date: string; count: number; correct: number }[] = []
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = dateKey(addDays(new Date(), -index))
    const attempts = state.attempts.filter((attempt) => attempt.at.slice(0, 10) === date)
    result.push({
      date,
      count: attempts.length,
      correct: attempts.filter((attempt) => attempt.correct).length,
    })
  }
  return result
}

export const dueFlashcards = (state: AppState, allIds: string[]) => {
  const today = dateKey()
  return allIds.filter((id) => {
    const cardState = state.flashcardStates[id]
    return !cardState || cardState.due <= today
  })
}

export const reviewedCount = (state: AppState) =>
  Object.values(state.flashcardStates).filter((card) => card.reps > 0).length

export const lastStudyLabel = (state: AppState) => {
  if (!state.lastMaterial) return null
  return state.lastMaterial
}

export const weekStart = () => {
  const now = new Date()
  const day = now.getDay()
  return addDays(now, -day)
    .toISOString()
    .slice(0, 10)
}

export const planWeekDays = (startDate: string) =>
  Array.from({ length: 7 }, (_, index) => dateKey(addDays(parseDateKey(startDate), index)))
