import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarClock, CheckCircle2, Layers3, Sparkles, Timer } from 'lucide-react'
import { useApp } from '../store'
import { flashcards } from '../data/flashcards'
import { disciplines, disciplineById } from '../data/disciplines'
import { dateKey, percent } from '../lib/utils'
import { dueFlashcards, reviewedCount } from '../lib/stats'
import { Card, Chip, PageHeader, ProgressBar, SectionTitle } from '../components/ui'

export default function FlashcardsPage() {
  const { state } = useApp()
  const navigate = useNavigate()
  const allIds = flashcards.map((card) => card.id)
  const due = dueFlashcards(state, allIds)
  const reviewed = reviewedCount(state)
  const today = dateKey()

  const start = (disciplineId: string) => {
    navigate(`/flashcards/revisar/${disciplineId}`)
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Flashcards"
        subtitle="Revisão espaçada: o que você erra volta logo; o que acerta se afasta. Sem planilha, sem decidir o que estudar."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => start('todos')}>
            <Sparkles size={17} />
            Revisar {due.length} {due.length === 1 ? 'cartão' : 'cartões'}
          </button>
        }
      />

      <div className="flash-hero">
        <Card className="flash-hero-main">
          <div className="flash-hero-copy">
            <span className="eyebrow">para revisar hoje</span>
            <h2>
              {due.length} <span>{due.length === 1 ? 'cartão na fila' : 'cartões na fila'}</span>
            </h2>
            <p>
              {reviewed} cartões já passaram pela revisão. O intervalo cresce conforme você acerta:{' '}
              <strong>1 · 3 · 7 · 14 · 30 dias</strong>.
            </p>
            <div className="flash-hero-actions">
              <button type="button" className="btn btn-primary" onClick={() => start('todos')} disabled={!due.length}>
                Começar revisão
                <ArrowRight size={16} />
              </button>
              <Link to="/materiais" className="btn btn-ghost">
                Revisar resumo antes
              </Link>
            </div>
          </div>
          <div className="flash-intervals" aria-label="Intervalos da revisão espaçada">
            {[1, 3, 7, 14, 30].map((days, index) => (
              <div className="flash-interval" key={days}>
                <span className="flash-interval-line" />
                <strong>{days}d</strong>
                <em>{index === 0 ? 'errei' : index < 3 ? 'difícil' : 'acertei'}</em>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flash-hero-side">
          <div className="flash-side-row">
            <span className="flash-side-icon green">
              <CheckCircle2 size={18} />
            </span>
            <div>
              <strong>{reviewed}</strong>
              <span>já estudados</span>
            </div>
          </div>
          <div className="flash-side-row">
            <span className="flash-side-icon yellow">
              <CalendarClock size={18} />
            </span>
            <div>
              <strong>{due.filter((id) => !state.flashcardStates[id]).length}</strong>
              <span>{due.filter((id) => !state.flashcardStates[id]).length === 1 ? 'cartão novo' : 'cartões novos'}</span>
            </div>
          </div>
          <div className="flash-side-row">
            <span className="flash-side-icon ink">
              <Timer size={18} />
            </span>
            <div>
              <strong>{Math.max(3, Math.ceil(due.length * 0.4))} min</strong>
              <span>estimativa da fila</span>
            </div>
          </div>
          <p className="flash-side-note">
            Estude no seu ritmo. A fila de hoje é só uma sugestão — os cartões de amanhã não somem.
          </p>
        </Card>
      </div>

      <SectionTitle
        title="Por disciplina"
        hint="Cada baralho mistura definições, pegadinhas e exceções dos resumos."
        action={
          <Chip tone="neutral" icon={Layers3}>
            {flashcards.length} cartões
          </Chip>
        }
      />

      <div className="flash-grid">
        {disciplines.map((discipline) => {
          const cards = flashcards.filter((card) => card.disciplineId === discipline.id)
          const dueCount = cards.filter((card) => {
            const cardState = state.flashcardStates[card.id]
            return !cardState || cardState.due <= today
          }).length
          const studied = cards.filter((card) => (state.flashcardStates[card.id]?.reps ?? 0) > 0).length
          const mastery = percent(studied, cards.length)
          return (
            <button
              type="button"
              key={discipline.id}
              className="flash-discipline-card"
              onClick={() => start(discipline.id)}
            >
              <div className="flash-discipline-head">
                <span className="flash-discipline-mark" style={{ background: discipline.color }} />
                <div>
                  <h3>{discipline.name}</h3>
                  <span>
                    {dueCount} para revisar · {cards.length - studied} novos
                  </span>
                </div>
                <span className="flash-go">
                  <ArrowRight size={17} />
                </span>
              </div>
              <div className="flash-discipline-foot">
                <span>{studied} dominados de {cards.length}</span>
                <strong>{mastery}%</strong>
              </div>
              <ProgressBar value={mastery} color={discipline.color} size="thin" />
            </button>
          )
        })}
      </div>

      <div className="flash-explainer">
        <div>
          <h3>Como a fila é montada</h3>
          <p>
            Cada avaliação muda o próximo encontro com o cartão. “Errei” volta em 1 dia; “difícil” em 3; “acertei”
            começa em 7 e cresce até 30 dias. O objetivo é lembrar na prova, não decorar na véspera.
          </p>
        </div>
        <div className="flash-explainer-steps">
          <span>
            <b>1</b> leia a frente
          </span>
          <span>
            <b>2</b> tente responder
          </span>
          <span>
            <b>3</b> vire e avalie
          </span>
        </div>
      </div>
    </div>
  )
}
