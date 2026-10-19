export type Difficulty = 'Fácil' | 'Média' | 'Difícil'

export type Discipline = {
  id: string
  name: string
  short: string
  color: string
  weight: number
}

export type Question = {
  id: string
  disciplineId: string
  topic: string
  difficulty: Difficulty
  board: string
  year: number
  statement: string
  options: string[]
  correct: number
  explanation: string
  tags: string[]
}

export type Attempt = {
  id: string
  questionId: string
  disciplineId: string
  correct: boolean
  chosen: number
  at: string
  seconds: number
  mode: 'avulso' | 'simulado' | 'caderno'
}

export type Lesson = {
  id: string
  title: string
  minutes: number
  summary: string
  sections: { title: string; body: string; points?: string[] }[]
}

export type Material = {
  disciplineId: string
  title: string
  intro: string
  source: string
  lessons: Lesson[]
}

export type Flashcard = {
  id: string
  disciplineId: string
  front: string
  back: string
  tag: string
}

export type FlashcardState = {
  cardId: string
  due: string
  interval: number
  reps: number
  lastGrade: 'errei' | 'difícil' | 'acertei' | null
}

export type Course = {
  id: string
  title: string
  teacher: string
  disciplineId: string
  level: string
  hours: number
  lessons: number
  description: string
  modules: { title: string; lessons: { title: string; minutes: number }[] }[]
  featured?: boolean
}

export type PlanSettings = {
  target: string
  days: number[]
  hoursPerDay: number
  startDate: string
}

export type Profile = {
  name: string
  email: string
  area: string
  target: string
  dailyGoal: number
  joinedAt: string
}

export type ViewMode = 'light' | 'dark'

export type AppState = {
  version: number
  profile: Profile
  loggedIn: boolean
  plan: PlanSettings
  attempts: Attempt[]
  favorites: string[]
  solved: Record<string, { correct: boolean; at: string; seconds: number }>
  flashcardStates: Record<string, FlashcardState>
  readLessons: string[]
  courseProgress: string[]
  planDone: string[]
  theme: ViewMode
  lastMaterial: { disciplineId: string; lessonId: string } | null
}
