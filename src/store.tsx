import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AppState, Attempt, FlashcardState, PlanSettings, Profile, ViewMode } from './types'
import { questions } from './data/questions'
import { flashcards } from './data/flashcards'
import { addDays, dateKey, parseDateKey } from './lib/utils'
import { computeStats, type AppStats } from './lib/stats'

const STORAGE_KEY = 'ponto-de-corte:v2'

const seedAttempts = (): Attempt[] => {
  const today = new Date()
  const activeDays = [0, 1, 2, 3, 4, 5, 8, 9, 10, 12, 15, 18, 20, 22, 25, 27]
  const weakDisciplines = new Set(['constitucional', 'processual-penal', 'contabilidade', 'estatistica'])
  const attempts: Attempt[] = []
  activeDays.forEach((offset) => {
    const date = addDays(today, -offset)
    const count = offset === 0 ? 11 : 3 + (offset % 5)
    for (let index = 0; index < count; index += 1) {
      const question = questions[(offset * 7 + index * 3 + 2) % questions.length]
      const hash = (offset * 37 + index * 19 + question.id.length * 11) % 100
      const threshold = weakDisciplines.has(question.disciplineId) ? 55 : 79
      const correct = hash < threshold
      const chosen = correct ? question.correct : (question.correct + 1 + (index % (question.options.length - 1))) % question.options.length
      const at = new Date(date)
      at.setHours(8 + ((index * 2 + offset) % 11), (offset * 13 + index * 7) % 60, 0, 0)
      attempts.push({
        id: `seed-${offset}-${index}`,
        questionId: question.id,
        disciplineId: question.disciplineId,
        correct,
        chosen,
        at: at.toISOString(),
        seconds: 38 + ((offset * 13 + index * 17) % 74),
        mode: offset % 5 === 0 ? 'simulado' : 'avulso',
      })
    }
  })
  return attempts
}

const seedFlashcardStates = (): Record<string, FlashcardState> => {
  const states: Record<string, FlashcardState> = {}
  flashcards.forEach((card, index) => {
    if (index % 3 !== 0) return
    const interval = [1, 3, 7, 14][index % 4]
    const dueOffset = (index % 5) - 1
    states[card.id] = {
      cardId: card.id,
      due: dateKey(addDays(new Date(), dueOffset)),
      interval,
      reps: 1 + (index % 3),
      lastGrade: index % 2 === 0 ? 'acertei' : 'difícil',
    }
  })
  return states
}

const seedSolved = (attempts: Attempt[]): AppState['solved'] => {
  const solved: AppState['solved'] = {}
  attempts.forEach((attempt) => {
    solved[attempt.questionId] = {
      correct: attempt.correct,
      at: attempt.at,
      seconds: attempt.seconds,
    }
  })
  return solved
}

const createInitialState = (): AppState => {
  const attempts = seedAttempts()
  return {
    version: 2,
    profile: {
      name: 'Thierry de Almeida',
      email: 'thierryalmeidas@gmail.com',
      area: 'Carreiras bancárias — Banco do Brasil, Caixa, Banestes e outros',
      target: 'Banco do Brasil — Escriturário',
      dailyGoal: 20,
      joinedAt: dateKey(),
    },
    loggedIn: true,
    plan: {
      target: 'Banco do Brasil — Escriturário',
      days: [1, 2, 3, 4, 5],
      hoursPerDay: 3,
      startDate: dateKey(),
    },
    attempts,
    favorites: ['lp-01', 'da-04', 'dh-02'],
    solved: seedSolved(attempts),
    flashcardStates: seedFlashcardStates(),
    readLessons: ['lp-m1', 'da-m1', 'cg-m1', 'in-m1'],
    courseProgress: ['curso-adm:0:0', 'curso-adm:0:1', 'curso-adm:0:2'],
    planDone: [],
    theme: 'light',
    lastMaterial: { disciplineId: 'portugues', lessonId: 'lp-m2' },
  }
}

const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw) as AppState
    if (!parsed || parsed.version !== 2) return createInitialState()
    return parsed
  } catch {
    return createInitialState()
  }
}

type AnswerInput = {
  questionId: string
  chosen: number
  seconds: number
  mode: Attempt['mode']
}

type Actions = {
  answer: (input: AnswerInput) => boolean
  toggleFavorite: (questionId: string) => void
  markLessonRead: (lessonId: string, disciplineId: string) => void
  reviewFlashcard: (cardId: string, grade: 'errei' | 'difícil' | 'acertei') => void
  toggleCourseLesson: (key: string) => void
  saveProfile: (patch: Partial<Profile>) => void
  updatePlan: (patch: Partial<PlanSettings>) => void
  togglePlanBlock: (key: string) => void
  setTheme: (theme: ViewMode) => void
  toggleTheme: () => void
  login: (email: string) => void
  logout: () => void
  signup: (data: { name: string; email: string; area: string; target: string; dailyGoal?: number }) => void
  resetProgress: () => void
  notify: (message: string) => void
}

type AppContextValue = {
  state: AppState
  stats: AppStats
  actions: Actions
  toast: string | null
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.documentElement.style.colorScheme = state.theme
  }, [state.theme])

  const notify = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }, [])

  const answer = useCallback((input: AnswerInput) => {
    const question = questions.find((item) => item.id === input.questionId)
    if (!question) return false
    const correct = question.correct === input.chosen
    const attempt: Attempt = {
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      questionId: question.id,
      disciplineId: question.disciplineId,
      correct,
      chosen: input.chosen,
      at: new Date().toISOString(),
      seconds: Math.max(1, Math.round(input.seconds)),
      mode: input.mode,
    }
    setState((current) => ({
      ...current,
      attempts: [...current.attempts, attempt],
      solved: {
        ...current.solved,
        [question.id]: { correct, at: attempt.at, seconds: attempt.seconds },
      },
    }))
    return correct
  }, [])

  const toggleFavorite = useCallback((questionId: string) => {
    setState((current) => {
      const exists = current.favorites.includes(questionId)
      return {
        ...current,
        favorites: exists
          ? current.favorites.filter((id) => id !== questionId)
          : [...current.favorites, questionId],
      }
    })
  }, [])

  const markLessonRead = useCallback((lessonId: string, disciplineId: string) => {
    setState((current) => ({
      ...current,
      readLessons: current.readLessons.includes(lessonId)
        ? current.readLessons.filter((id) => id !== lessonId)
        : [...current.readLessons, lessonId],
      lastMaterial: { disciplineId, lessonId },
    }))
  }, [])

  const reviewFlashcard = useCallback((cardId: string, grade: 'errei' | 'difícil' | 'acertei') => {
    setState((current) => {
      const previous = current.flashcardStates[cardId]
      let interval = 1
      if (grade === 'difícil') interval = Math.max(3, Math.round((previous?.interval || 1) * 1.5))
      if (grade === 'acertei') interval = Math.min(30, Math.max(7, Math.round((previous?.interval || 1) * 2.5)))
      if (grade === 'errei') interval = 1
      return {
        ...current,
        flashcardStates: {
          ...current.flashcardStates,
          [cardId]: {
            cardId,
            due: dateKey(addDays(new Date(), interval)),
            interval,
            reps: Math.max(0, (previous?.reps || 0) + (grade === 'errei' ? 0 : 1)),
            lastGrade: grade,
          },
        },
      }
    })
  }, [])

  const toggleCourseLesson = useCallback((key: string) => {
    setState((current) => ({
      ...current,
      courseProgress: current.courseProgress.includes(key)
        ? current.courseProgress.filter((item) => item !== key)
        : [...current.courseProgress, key],
    }))
  }, [])

  const saveProfile = useCallback((patch: Partial<Profile>) => {
    setState((current) => ({ ...current, profile: { ...current.profile, ...patch } }))
  }, [])

  const updatePlan = useCallback((patch: Partial<PlanSettings>) => {
    setState((current) => ({ ...current, plan: { ...current.plan, ...patch }, planDone: [] }))
  }, [])

  const togglePlanBlock = useCallback((key: string) => {
    setState((current) => ({
      ...current,
      planDone: current.planDone.includes(key)
        ? current.planDone.filter((item) => item !== key)
        : [...current.planDone, key],
    }))
  }, [])

  const setTheme = useCallback((theme: ViewMode) => {
    setState((current) => ({ ...current, theme }))
  }, [])

  const toggleTheme = useCallback(() => {
    setState((current) => ({ ...current, theme: current.theme === 'light' ? 'dark' : 'light' }))
  }, [])

  const login = useCallback((email: string) => {
    setState((current) => ({
      ...current,
      loggedIn: true,
      profile: { ...current.profile, email: email || current.profile.email },
    }))
  }, [])

  const logout = useCallback(() => {
    setState((current) => ({ ...current, loggedIn: false }))
  }, [])

  const signup = useCallback(
    (data: { name: string; email: string; area: string; target: string; dailyGoal?: number }) => {
      setState((current) => ({
        ...createInitialState(),
        theme: current.theme,
        loggedIn: true,
        profile: {
          name: data.name,
          email: data.email,
          area: data.area,
          target: data.target,
          dailyGoal: data.dailyGoal || 20,
          joinedAt: dateKey(),
        },
        plan: { ...current.plan, target: data.target, startDate: dateKey() },
        attempts: [],
        solved: {},
        favorites: [],
        flashcardStates: {},
        readLessons: [],
        courseProgress: [],
        planDone: [],
        lastMaterial: null,
      }))
    },
    [],
  )

  const resetProgress = useCallback(() => {
    setState((current) => ({
      ...createInitialState(),
      profile: current.profile,
      plan: { ...current.plan, startDate: dateKey() },
      theme: current.theme,
      loggedIn: current.loggedIn,
      joinedAt: current.profile.joinedAt,
      attempts: [],
      solved: {},
      favorites: [],
      flashcardStates: {},
      readLessons: [],
      courseProgress: [],
      planDone: [],
      lastMaterial: null,
    }))
  }, [])

  const actions = useMemo<Actions>(
    () => ({
      answer,
      toggleFavorite,
      markLessonRead,
      reviewFlashcard,
      toggleCourseLesson,
      saveProfile,
      updatePlan,
      togglePlanBlock,
      setTheme,
      toggleTheme,
      login,
      logout,
      signup,
      resetProgress,
      notify,
    }),
    [
      answer,
      toggleFavorite,
      markLessonRead,
      reviewFlashcard,
      toggleCourseLesson,
      saveProfile,
      updatePlan,
      togglePlanBlock,
      setTheme,
      toggleTheme,
      login,
      logout,
      signup,
      resetProgress,
      notify,
    ],
  )

  const stats = useMemo(() => computeStats(state), [state])

  return (
    <AppContext.Provider value={{ state, stats, actions, toast }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export const parseStoredDate = parseDateKey
