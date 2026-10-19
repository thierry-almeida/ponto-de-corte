export const dateKey = (date: Date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const parseDateKey = (key: string) => new Date(`${key}T12:00:00`)

export const addDays = (date: Date, days: number) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

export const shortDate = (key: string) =>
  parseDateKey(key).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')

export const longDate = (key: string) =>
  parseDateKey(key).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

export const weekdayShort = (key: string) =>
  parseDateKey(key).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()

export const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes % 60)
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

export const formatSeconds = (seconds: number) => {
  if (!seconds) return '—'
  if (seconds < 60) return `${seconds} s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest ? `${minutes} min ${rest} s` : `${minutes} min`
}

export const formatTimer = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const plural = (value: number, singular: string, pluralForm: string) =>
  `${value} ${value === 1 ? singular : pluralForm}`

export const percent = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100)

export const trialDaysLeft = (joinedAt: string) => {
  const start = parseDateKey(joinedAt.slice(0, 10))
  const diff = Math.floor((new Date().setHours(12, 0, 0, 0) - start.getTime()) / 86400000)
  return Math.max(0, 7 - diff)
}

export const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const shuffle = <T,>(items: T[]) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
