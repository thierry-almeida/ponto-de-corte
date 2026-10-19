import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Layers3, RotateCcw, Sparkles, X } from 'lucide-react'
import type { Flashcard } from '../types'
import { flashcards } from '../data/flashcards'
import { disciplineById } from '../data/disciplines'
import { useApp } from '../store'
import { dateKey, percent } from '../lib/utils'
import { Card, Chip, EmptyState, ProgressBar, Ring } from '../components/ui'

type Grade = 'errei' | 'difícil' | 'acertei'

export default function FlashcardReviewPage() {
  const { disciplineId = 'todos' } = useParams()
  const navigate = useNavigate()
  const { state, actions } = useApp()
  const discipline = disciplineId === 'todos' ? null : disciplineById(disciplineId)
  const today = dateKey()

  const pool = useMemo(
    () => (disciplineId === 'todos' ? flashcards : flashcards.filter((card) => card.disciplineId === disciplineId)),
    [disciplineId],
  )

  const dueCards = useMemo(
    () =>
      pool.filter((card) => {
        const cardState = state.flashcardStates[card.id]
        return !cardState || cardState.due <= today
      }),
    // The session queue is intentionally captured when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disciplineId],
  )

  const [cards, setCards] = useState<Flashcard[]>(dueCards)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState<{ cardId: string; grade: Grade }[]>([])
  const [phase, setPhase] = useState<'review' | 'done'>('review')

  useEffect(() => {
    setCards(dueCards)
    setIndex(0)
    setFlipped(false)
    setResults([])
    setPhase('review')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disciplineId])

  const nextDue = useMemo(() => {
    const dates = pool
      .map((card) => state.flashcardStates[card.id]?.due)
      .filter((due): due is string => Boolean(due) && due! > today)
      .sort()
    return dates[0]
  }, [pool, state.flashcardStates, today])

  const rate = (grade: Grade) => {
    const card = cards[index]
    if (!card || !flipped) return
    actions.reviewFlashcard(card.id, grade)
    setResults((current) => [...current, { cardId: card.id, grade }])
    if (index + 1 >= cards.length) {
      setPhase('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setIndex((current) => current + 1)
    setFlipped(false)
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (phase !== 'review') return
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        if (!flipped) setFlipped(true)
        else rate('acertei')
        return
      }
      if (!flipped) return
      if (event.key === '1') rate('errei')
      if (event.key === '2') rate('difícil')
      if (event.key === '3') rate('acertei')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const reset = () => {
    setCards(pool)
    setIndex(0)
    setFlipped(false)
    setResults([])
    setPhase('review')
  }

  if (phase === 'done') {
    const right = results.filter((result) => result.grade === 'acertei').length
    const difficult = results.filter((result) => result.grade === 'difícil').length
    const wrong = results.filter((result) => result.grade === 'errei').length
    const score = percent(right, results.length)
    return (
      <div className="flash-summary page-stack">
        <div className="result-head">
          <Chip tone="green" icon={Sparkles}>
            revisão concluída
          </Chip>
          <h1>{score >= 70 ? 'Memória afiada.' : 'Revisão feita. É assim que fixa.'}</h1>
          <p>
            {results.length} {results.length === 1 ? 'cartão revisado' : 'cartões revisados'} em{' '}
            {discipline?.name ?? 'todas as disciplinas'}.
          </p>
        </div>
        <Card className="flash-summary-card">
          <Ring value={score} size={136} stroke={10}>
            <strong>{score}%</strong>
            <span>acertei</span>
          </Ring>
          <div className="flash-summary-breakdown">
            <div>
              <span className="grade-dot grade-wrong" />
              <strong>{wrong}</strong>
              <span>errei · volta em 1 dia</span>
            </div>
            <div>
              <span className="grade-dot grade-hard" />
              <strong>{difficult}</strong>
              <span>difícil · volta em 3 dias</span>
            </div>
            <div>
              <span className="grade-dot grade-right" />
              <strong>{right}</strong>
              <span>acertei · intervalo maior</span>
            </div>
          </div>
          <div className="flash-summary-actions">
            <button type="button" className="btn btn-primary" onClick={reset}>
              <RotateCcw size={16} />
              Revisar de novo
            </button>
            <Link to="/flashcards" className="btn btn-ghost">
              Voltar aos baralhos
            </Link>
            <Link to="/painel" className="btn btn-dark">
              Ir para o painel
            </Link>
          </div>
        </Card>
        <Card className="flash-next">
          <span className="flash-next-icon">
            <Layers3 size={19} />
          </span>
          <p>
            A fila de amanhã é montada automaticamente. Volte quando quiser — os cartões que você errou estarão
            esperando.
          </p>
          <Link to="/flashcards" className="text-link">
            Ver fila
            <ChevronRight size={15} />
          </Link>
        </Card>
      </div>
    )
  }

  if (!cards.length) {
    return (
      <div className="page-stack">
        <div className="practice-top">
          <Link to="/flashcards" className="back-link">
            <ArrowLeft size={16} />
            Flashcards
          </Link>
          <div className="practice-title">
            <span>{discipline?.name ?? 'Todos os baralhos'}</span>
            <em>revisão espaçada</em>
          </div>
          <span />
        </div>
        <Card className="flash-empty-card">
          <EmptyState
            icon={Sparkles}
            title="Nada vencido por aqui"
            text={
              nextDue
                ? `Seu próximo cartão volta em ${new Date(`${nextDue}T12:00:00`).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                  })}. Você pode rever o baralho inteiro agora, se quiser.`
                : 'Você ainda não tem cartões neste baralho.'
            }
            action={
              <button type="button" className="btn btn-primary" onClick={() => setCards(pool)}>
                Revisar o baralho inteiro
              </button>
            }
          />
        </Card>
      </div>
    )
  }

  const card = cards[index]
  const cardDiscipline = disciplineById(card.disciplineId)
  const progress = (index / cards.length) * 100
  const counts = {
    errei: results.filter((result) => result.grade === 'errei').length,
    difícil: results.filter((result) => result.grade === 'difícil').length,
    acertei: results.filter((result) => result.grade === 'acertei').length,
  }

  return (
    <div className="flash-review page-stack">
      <div className="practice-top">
        <Link to="/flashcards" className="back-link">
          <ArrowLeft size={16} />
          Flashcards
        </Link>
        <div className="practice-title">
          <span>{discipline?.name ?? 'Todos os baralhos'}</span>
          <em>revisão espaçada</em>
        </div>
        <span className="flash-counter">
          <strong>{index + 1}</strong> / {cards.length}
        </span>
      </div>

      <div className="flash-progress">
        <ProgressBar value={progress} color={cardDiscipline.color} />
        <div className="flash-progress-meta">
          <span>
            <i style={{ background: cardDiscipline.color }} />
            {cardDiscipline.name}
          </span>
          <span>{cards.length - index} restantes</span>
        </div>
      </div>

      <div className="flash-stage">
        <button
          type="button"
          className={`flash-card ${flipped ? 'is-flipped' : ''}`}
          onClick={() => setFlipped((value) => !value)}
          aria-label={flipped ? 'Ocultar resposta' : 'Mostrar resposta'}
        >
          <span className="flash-card-tab">{card.tag}</span>
          <span className="flash-card-index">
            {String(index + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
          </span>
          <span className="flash-card-discipline">{cardDiscipline.name}</span>
          <span className="flash-card-question">{card.front}</span>
          {flipped ? (
            <span className="flash-card-answer">
              <span>resposta</span>
              <strong>{card.back}</strong>
            </span>
          ) : (
            <span className="flash-card-hint">
              Clique ou pressione <kbd>espaço</kbd> para ver a resposta
            </span>
          )}
        </button>

        <div className={`flash-rating ${flipped ? 'is-visible' : ''}`}>
          <button type="button" className="flash-rate rate-wrong" onClick={() => rate('errei')} disabled={!flipped}>
            <X size={17} />
            Errei
            <em>1</em>
          </button>
          <button type="button" className="flash-rate rate-hard" onClick={() => rate('difícil')} disabled={!flipped}>
            <span className="rate-dash">~</span>
            Difícil
            <em>2</em>
          </button>
          <button type="button" className="flash-rate rate-right" onClick={() => rate('acertei')} disabled={!flipped}>
            <Check size={17} />
            Acertei
            <em>3</em>
          </button>
        </div>
      </div>

      <div className="flash-review-foot">
        <span className="flash-tally">
          <span className="tally-wrong">{counts.errei}</span>
          <span>errei</span>
          <span className="tally-hard">{counts['difícil']}</span>
          <span>difícil</span>
          <span className="tally-right">{counts.acertei}</span>
          <span>acertei</span>
        </span>
        <span className="keyboard-hint">
          <kbd>espaço</kbd> vira · <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> avaliam
        </span>
      </div>

      <Card className="flash-discipline-note">
        <span className="flash-note-icon">
          <ArrowRight size={16} />
        </span>
        <p>
          <strong>Intervalo atual:</strong>{' '}
          {state.flashcardStates[card.id]?.interval
            ? `${state.flashcardStates[card.id].interval} dias, com ${state.flashcardStates[card.id].reps} revisões`
            : 'primeiro contato. Acertei começa em 7 dias; errei volta amanhã.'}
        </p>
        <button type="button" className="text-button" onClick={() => navigate('/materiais')}>
          abrir resumo
        </button>
      </Card>
    </div>
  )
}
