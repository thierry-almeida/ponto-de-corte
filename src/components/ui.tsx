import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight, Check, Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { percent } from '../lib/utils'

export function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  eyebrow?: string
}) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="page-title">
          {title}
          <span className="title-dot">.</span>
        </h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {hint && <p>{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({
  children,
  className = '',
  as = 'div',
  id,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
  id?: string
}) {
  const Tag = as
  return (
    <Tag className={`card ${className}`} id={id}>
      {children}
    </Tag>
  )
}

export function ProgressBar({
  value,
  color,
  size = 'normal',
  label,
}: {
  value: number
  color?: string
  size?: 'normal' | 'thin'
  label?: string
}) {
  return (
    <div
      className={`progress ${size === 'thin' ? 'progress-thin' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progresso'}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  )
}

export type ChipTone = 'neutral' | 'yellow' | 'green' | 'red' | 'blue' | 'purple' | 'outline'

export function Chip({
  children,
  tone = 'neutral',
  icon: Icon,
}: {
  children: ReactNode
  tone?: ChipTone
  icon?: LucideIcon
}) {
  return (
    <span className={`chip chip-${tone}`}>
      {Icon && <Icon size={12} strokeWidth={2.2} />}
      {children}
    </span>
  )
}

export function Ring({
  value,
  size = 112,
  stroke = 9,
  children,
}: {
  value: number
  size?: number
  stroke?: number
  children?: ReactNode
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, value) / 100) * circumference
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} />
        <circle
          className="ring-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  )
}

export function EmptyState({
  title,
  text,
  icon: Icon = Inbox,
  action,
}: {
  title: string
  text: string
  icon?: LucideIcon
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        {action && <div className="empty-action">{action}</div>}
      </div>
    </div>
  )
}

export function LinkArrow({ children }: { children: ReactNode }) {
  return (
    <span className="link-arrow">
      {children}
      <ArrowUpRight size={15} strokeWidth={2.2} />
    </span>
  )
}

export function ActivityChart({
  data,
  goal,
}: {
  data: { date: string; count: number; correct: number }[]
  goal: number
}) {
  const max = Math.max(goal, ...data.map((day) => day.count), 1)
  return (
    <div className="activity-chart">
      <div className="chart-legend">
        <span className="legend-item">
          <i className="legend-swatch legend-studied" /> respondidas
        </span>
        <span className="legend-item">
          <i className="legend-swatch legend-correct" /> corretas
        </span>
      </div>
      <div
        className="chart-bars"
        role="img"
        aria-label="Questões respondidas nos últimos 30 dias"
        style={{ '--goal-line': `${Math.round((Math.min(goal, max) / max) * 160)}px` } as CSSProperties}
      >
        {data.map((day, index) => {
          const height = (day.count / max) * 100
          const correctShare = day.count ? (day.correct / day.count) * 100 : 0
          const isToday = index === data.length - 1
          return (
            <div className={`chart-col ${isToday ? 'chart-today' : ''}`} key={day.date}>
              <div className="chart-bar-wrap">
                <div className="chart-bar" style={{ height: `${height}%` }}>
                  <div className="chart-bar-correct" style={{ height: `${correctShare}%` }} />
                </div>
              </div>
              <span className="chart-label">
                {index === 0 ? '30d' : isToday ? 'hoje' : index % 7 === 0 ? `${30 - index}d` : ''}
              </span>
              <span className="chart-tooltip">
                {new Date(`${day.date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} ·{' '}
                {day.count} questões · {day.correct} certas
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'plain',
}: {
  label: string
  value: string
  detail: string
  icon?: LucideIcon
  tone?: 'plain' | 'yellow' | 'green' | 'red'
}) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {Icon && <Icon size={17} strokeWidth={1.9} />}
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </div>
  )
}

export function MiniMeter({
  label,
  value,
  right,
  color,
}: {
  label: string
  value: number
  right?: string
  color?: string
}) {
  return (
    <div className="mini-meter">
      <div className="mini-meter-head">
        <span>{label}</span>
        <strong>{right ?? `${Math.round(value)}%`}</strong>
      </div>
      <ProgressBar value={value} color={color} size="thin" label={`${label}: ${percent(value, 100)}%`} />
    </div>
  )
}

export function CheckIcon() {
  return <Check size={15} strokeWidth={3} />
}
