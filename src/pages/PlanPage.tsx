import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Layers3,
  ListChecks,
  RefreshCw,
  Settings2,
  Sparkles,
  Target,
} from 'lucide-react'
import { useApp } from '../store'
import { disciplines, disciplineById, targets } from '../data/disciplines'
import { generatePlan, planDateLabel, planDayLabel } from '../lib/plan'
import { addDays, dateKey, formatMinutes, parseDateKey, percent } from '../lib/utils'
import { Card, Chip, PageHeader, ProgressBar, Ring, SectionTitle } from '../components/ui'

const weekdays = [
  { value: 0, label: 'dom' },
  { value: 1, label: 'seg' },
  { value: 2, label: 'ter' },
  { value: 3, label: 'qua' },
  { value: 4, label: 'qui' },
  { value: 5, label: 'sex' },
  { value: 6, label: 'sáb' },
]

export default function PlanPage() {
  const { state, stats, actions } = useApp()
  const [weekOffset, setWeekOffset] = useState(0)
  const [draft, setDraft] = useState(state.plan)

  const weekStartDate = dateKey(addDays(parseDateKey(state.plan.startDate), weekOffset * 7))
  const weekStart = parseDateKey(weekStartDate)
  const weekDays = Array.from({ length: 7 }, (_, index) => dateKey(addDays(weekStart, index)))
  const blocks = useMemo(
    () => generatePlan({ ...state.plan, startDate: weekStartDate }, stats, state.planDone),
    [state.plan, state.planDone, stats, weekStartDate],
  )
  const doneCount = blocks.filter((block) => block.done).length
  const completion = percent(doneCount, blocks.length)
  const totalMinutes = blocks.reduce((total, block) => total + block.minutes, 0)
  const today = dateKey()

  const applyPlan = () => {
    actions.updatePlan({ ...draft, startDate: dateKey() })
    setWeekOffset(0)
    actions.notify('Plano atualizado. A semana foi recalculada.')
  }

  const toggleDay = (day: number) => {
    setDraft((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((value) => value !== day)
        : [...current.days, day].sort(),
    }))
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Plano de estudos"
        subtitle="Uma semana montada a partir do peso das disciplinas e dos seus erros. Marque cada bloco como feito e o painel acompanha."
        actions={
          <>
            <Chip tone="green" icon={Sparkles}>
              recalculado com seus dados
            </Chip>
            <Link to="/questoes" className="btn btn-ghost">
              <ListChecks size={16} />
              Praticar
            </Link>
          </>
        }
      />

      <div className="plan-layout">
        <div className="plan-main">
          <Card className="plan-toolbar">
            <div className="plan-week-nav">
              <button
                type="button"
                className="icon-button bordered"
                onClick={() => setWeekOffset((value) => value - 1)}
                aria-label="Semana anterior"
              >
                <ChevronLeft size={17} />
              </button>
              <div>
                <span>{weekOffset === 0 ? 'sua semana' : weekOffset > 0 ? `semana +${weekOffset}` : `semana ${weekOffset}`}</span>
                <strong>
                  {planDateLabel(weekDays[0])} — {planDateLabel(weekDays[6])}
                </strong>
              </div>
              <button
                type="button"
                className="icon-button bordered"
                onClick={() => setWeekOffset((value) => value + 1)}
                aria-label="Próxima semana"
              >
                <ChevronRight size={17} />
              </button>
              {weekOffset !== 0 && (
                <button type="button" className="text-button" onClick={() => setWeekOffset(0)}>
                  voltar para hoje
                </button>
              )}
            </div>
            <div className="plan-toolbar-right">
              <div className="plan-toolbar-stat">
                <span>concluído</span>
                <strong>{completion}%</strong>
              </div>
              <div className="plan-toolbar-progress">
                <ProgressBar value={completion} color="#2c7a5e" />
              </div>
            </div>
          </Card>

          <div className="plan-week">
            {weekDays.map((date) => {
              const dayBlocks = blocks.filter((block) => block.date === date)
              const isToday = date === today
              const isPast = date < today
              return (
                <div className={`plan-day ${isToday ? 'plan-day-today' : ''} ${isPast ? 'plan-day-past' : ''}`} key={date}>
                  <div className="plan-day-head">
                    <span className="plan-day-weekday">{planDayLabel(date)}</span>
                    <strong>{planDateLabel(date)}</strong>
                    {isToday && <em>hoje</em>}
                    <span className="plan-day-count">
                      {dayBlocks.filter((block) => block.done).length}/{dayBlocks.length}
                    </span>
                  </div>
                  <div className="plan-day-blocks">
                    {dayBlocks.length ? (
                      dayBlocks.map((block) => {
                        const discipline = disciplineById(block.disciplineId)
                        const Icon = block.kind === 'Questões' ? ListChecks : block.kind === 'Flashcards' ? Layers3 : BookOpen
                        return (
                          <button
                            type="button"
                            key={block.key}
                            className={`plan-block ${block.done ? 'is-done' : ''}`}
                            onClick={() => {
                              actions.togglePlanBlock(block.key)
                              if (!block.done) actions.notify('Bloco concluído. Um passo a menos até o corte.')
                            }}
                          >
                            <span className="plan-block-color" style={{ background: discipline.color }} />
                            <span className="plan-block-icon">
                              <Icon size={16} />
                            </span>
                            <span className="plan-block-copy">
                              <strong>{discipline.name}</strong>
                              <span>
                                {block.kind} · {block.detail}
                              </span>
                              <em>{block.minutes} min</em>
                            </span>
                            <span className={`plan-block-check ${block.done ? 'checked' : ''}`}>
                              {block.done ? <Check size={13} strokeWidth={3} /> : null}
                            </span>
                          </button>
                        )
                      })
                    ) : (
                      <div className="plan-day-free">
                        <span>dia livre</span>
                        <p>Sem bloco programado. Descanse ou revise flashcards.</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <Card className="plan-method">
            <div className="plan-method-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h3>Como este plano é montado</h3>
              <p>
                O gerador parte de três sinais: o peso de cada disciplina no seu concurso, a sua taxa de acerto por
                disciplina e o tempo disponível na semana. Quem está abaixo de 70% ganha mais blocos — não menos.
                Ao aplicar uma mudança, os blocos da semana são recalculados.
              </p>
            </div>
            <button type="button" className="text-button" onClick={applyPlan}>
              <RefreshCw size={14} />
              recalcular agora
            </button>
          </Card>
        </div>

        <aside className="plan-side">
          <Card className="plan-summary">
            <SectionTitle title="Resumo da semana" />
            <div className="plan-summary-ring">
              <Ring value={completion} size={104} stroke={8}>
                <strong>{completion}%</strong>
                <span>feito</span>
              </Ring>
              <div>
                <strong>
                  {doneCount}/{blocks.length}
                </strong>
                <span>blocos concluídos</span>
                <em>{formatMinutes(totalMinutes)} programados</em>
              </div>
            </div>
            <div className="plan-summary-stats">
              <span>
                <CalendarDays size={15} />
                {state.plan.days.length} dias ativos
              </span>
              <span>
                <Clock3 size={15} />
                {formatMinutes(state.plan.hoursPerDay * 60)} por dia
              </span>
              <span>
                <Target size={15} />
                {state.plan.target.split(' — ')[0]}
              </span>
            </div>
            <div className="plan-summary-actions">
              <a href="#configurar" className="btn btn-ghost btn-sm">
                <Settings2 size={15} />
                Ajustar plano
              </a>
            </div>
          </Card>

          <Card className="plan-focus">
            <SectionTitle title="Prioridades" hint="Seus menores índices de acerto." />
            <div className="plan-focus-list">
              {stats.weak.length ? (
                stats.weak.map((item) => {
                  const discipline = disciplineById(item.disciplineId)
                  return (
                    <div key={item.disciplineId}>
                      <div className="plan-focus-head">
                        <span>
                          <i style={{ background: discipline.color }} />
                          {discipline.name}
                        </span>
                        <strong>{item.accuracy}%</strong>
                      </div>
                      <ProgressBar value={item.accuracy} color={discipline.color} size="thin" />
                    </div>
                  )
                })
              ) : (
                <p className="muted">Responda mais questões para o plano identificar prioridades.</p>
              )}
            </div>
          </Card>

          <Card className="plan-config" id="configurar">
            <SectionTitle title="Configurar plano" hint="Muda o tamanho da semana." />
            <label className="field-label" htmlFor="plan-target">
              Concurso alvo
            </label>
            <select
              id="plan-target"
              className="input select"
              value={draft.target}
              onChange={(event) => setDraft((current) => ({ ...current, target: event.target.value }))}
            >
              {targets.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>

            <span className="field-label">Dias de estudo</span>
            <div className="weekday-picker">
              {weekdays.map((day) => (
                <button
                  type="button"
                  key={day.value}
                  className={draft.days.includes(day.value) ? 'active' : ''}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <label className="field-label" htmlFor="plan-hours">
              Horas por dia
            </label>
            <div className="hours-picker">
              {[1, 2, 3, 4, 5, 6].map((hours) => (
                <button
                  type="button"
                  key={hours}
                  className={draft.hoursPerDay === hours ? 'active' : ''}
                  onClick={() => setDraft((current) => ({ ...current, hoursPerDay: hours }))}
                >
                  {hours}h
                </button>
              ))}
            </div>

            <button type="button" className="btn btn-primary btn-block" onClick={applyPlan} disabled={!draft.days.length}>
              <RefreshCw size={15} />
              Gerar plano
            </button>
            <p className="plan-config-note">
              {draft.days.length
                ? `${formatMinutes(draft.hoursPerDay * 60)} em ${draft.days.length} ${draft.days.length === 1 ? 'dia' : 'dias'} por semana.`
                : 'Escolha pelo menos um dia de estudo.'}
            </p>
          </Card>

          <Card className="plan-weights">
            <SectionTitle title="Peso no edital" hint="Base para a distribuição." />
            <div className="plan-weights-list">
              {[...disciplines]
                .sort((a, b) => b.weight - a.weight)
                .slice(0, 6)
                .map((discipline) => (
                  <div key={discipline.id}>
                    <span>{discipline.name}</span>
                    <div className="weight-dots">
                      {Array.from({ length: 3 }, (_, index) => (
                        <i key={index} className={index < discipline.weight ? 'filled' : ''} style={{ background: index < discipline.weight ? discipline.color : undefined }} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            <Link to="/materiais" className="text-link">
              ir para os resumos
              <ArrowRight size={14} />
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
