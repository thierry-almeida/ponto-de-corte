import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronLeft,
  CircleAlert,
  Clock3,
  Flame,
  Flag,
  ListChecks,
  RotateCcw,
  Timer,
  Trophy,
  X,
} from 'lucide-react'
import type { Attempt, Question } from '../types'
import { questions as allQuestions } from '../data/questions'
import { disciplineById } from '../data/disciplines'
import { useApp } from '../store'
import { formatSeconds, formatTimer, percent, shuffle } from '../lib/utils'
import { Card, Chip, ProgressBar, Ring } from '../components/ui'
import { QuestionMeta } from '../components/QuestionRow'

type SessionConfig = {
  questionIds: string[]
  title: string
  subtitle?: string
  mode: Attempt['mode']
  limitMinutes?: number
}

type AnswerRecord = {
  questionId: string
  chosen: number
  correct: boolean
  seconds: number
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

export default function PracticePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state, actions } = useApp()

  const config = useMemo<SessionConfig>(() => {
    const incoming = location.state as SessionConfig | null
    if (incoming && incoming.questionIds?.length) return incoming
    return {
      questionIds: allQuestions.slice(0, 10).map((question) => question.id),
      title: 'Rodada rápida',
      subtitle: 'Dez questões para aquecer',
      mode: 'avulso',
    }
  }, [location.state])

  const initialQuestions = useMemo(
    () =>
      config.questionIds
        .map((id) => allQuestions.find((question) => question.id === id))
        .filter((question): question is Question => Boolean(question)),
    [config],
  )

  useEffect(() => {
    setOverride(null)
  }, [config])

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(initialQuestions)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [phase, setPhase] = useState<'running' | 'done'>('running')
  const [elapsed, setElapsed] = useState(0)
  const [showQuit, setShowQuit] = useState(false)
  const [override, setOverride] = useState<{ title: string; subtitle?: string } | null>(null)
  const questionStart = useRef(Date.now())
  const autoFinished = useRef(false)
  const topRef = useRef<HTMLDivElement>(null)
  const isSimulation = config.mode === 'simulado'
  const limitSeconds = config.limitMinutes ? config.limitMinutes * 60 : 0
  const current = sessionQuestions[index]
  const remaining = limitSeconds ? Math.max(0, limitSeconds - elapsed) : 0

  useEffect(() => {
    if (phase !== 'running') return
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  const finish = useCallback(() => {
    setPhase('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (phase === 'running' && limitSeconds > 0 && elapsed >= limitSeconds && !autoFinished.current) {
      autoFinished.current = true
      finish()
    }
  }, [elapsed, limitSeconds, phase, finish])

  const moveTo = (nextIndex: number) => {
    setIndex(nextIndex)
    setSelected(null)
    setConfirmed(false)
    questionStart.current = Date.now()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = () => {
    if (selected === null || !current) return
    const seconds = Math.max(1, Math.round((Date.now() - questionStart.current) / 1000))
    const correct = actions.answer({
      questionId: current.id,
      chosen: selected,
      seconds,
      mode: config.mode,
    })
    setAnswers((currentAnswers) => [
      ...currentAnswers,
      { questionId: current.id, chosen: selected, correct, seconds },
    ])

    if (isSimulation) {
      if (index + 1 >= sessionQuestions.length) {
        finish()
      } else {
        moveTo(index + 1)
      }
      return
    }
    setConfirmed(true)
  }

  const next = () => {
    if (index + 1 >= sessionQuestions.length) {
      finish()
    } else {
      moveTo(index + 1)
    }
  }

  const selectOption = (optionIndex: number) => {
    if (confirmed) return
    setSelected(optionIndex)
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (phase !== 'running') return
      const numeric = Number(event.key)
      if (numeric >= 1 && numeric <= (current?.options.length ?? 0) && !confirmed) {
        event.preventDefault()
        setSelected(numeric - 1)
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        if (!confirmed) submit()
        else next()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const restart = (ids: string[], label?: { title: string; subtitle?: string }) => {
    const nextQuestions = ids
      .map((id) => allQuestions.find((question) => question.id === id))
      .filter((question): question is Question => Boolean(question))
    setOverride(label ?? null)
    setSessionQuestions(nextQuestions)
    setIndex(0)
    setSelected(null)
    setConfirmed(false)
    setAnswers([])
    setElapsed(0)
    setPhase('running')
    autoFinished.current = false
    questionStart.current = Date.now()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!sessionQuestions.length) {
    return (
      <Card className="practice-empty">
        <h1>Nada para praticar por aqui</h1>
        <p>Volte ao banco de questões e escolha uma disciplina.</p>
        <Link to="/questoes" className="btn btn-primary">
          Ir para questões
        </Link>
      </Card>
    )
  }

  if (phase === 'done') {
    const answered = answers.length
    const correct = answers.filter((answer) => answer.correct).length
    const score = percent(correct, answered || sessionQuestions.length)
    const wrongAnswers = answers.filter((answer) => !answer.correct)
    const totalSeconds = answers.reduce((total, answer) => total + answer.seconds, 0)
    return (
      <div className="results-page" ref={topRef}>
        <div className="result-head">
          <Chip tone={isSimulation ? 'blue' : 'yellow'}>{isSimulation ? 'simulado concluído' : 'rodada concluída'}</Chip>
          <h1>{score >= 70 ? 'Você está no corte.' : 'Ainda dá para virar o jogo.'}</h1>
          <p>
            {answered} de {sessionQuestions.length}{' '}
            {sessionQuestions.length === 1 ? 'questão respondida' : 'questões respondidas'} ·{' '}
            {formatTimer(totalSeconds)} de estudo
          </p>
        </div>

        <Card className="result-score-card">
          <Ring value={score} size={148} stroke={11}>
            <strong>{score}%</strong>
            <span>de acerto</span>
          </Ring>
          <div className="result-stats">
            <div>
              <strong className="text-green">{correct}</strong>
              <span>acertos</span>
            </div>
            <div>
              <strong className="text-red">{answered - correct}</strong>
              <span>erros</span>
            </div>
            <div>
              <strong>{sessionQuestions.length - answered}</strong>
              <span>em branco</span>
            </div>
            <div>
              <strong>{formatSeconds(answered ? Math.round(totalSeconds / answered) : 0)}</strong>
              <span>por questão</span>
            </div>
          </div>
          <div className="result-actions">
            {wrongAnswers.length > 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  restart(
                    wrongAnswers.map((answer) => answer.questionId),
                    {
                      title: 'Revisão dos erros',
                      subtitle:
                        wrongAnswers.length === 1
                          ? 'Refazendo a questão errada'
                          : `Refazendo as ${wrongAnswers.length} questões erradas`,
                    },
                  )
                }
              >
                <RotateCcw size={16} />
                Refazer as {wrongAnswers.length} erradas
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => restart(sessionQuestions.map((question) => question.id))}
            >
              Refazer a rodada
            </button>
            <button type="button" className="btn btn-dark" onClick={() => navigate(isSimulation ? '/simulados' : '/questoes')}>
              Voltar
            </button>
          </div>
        </Card>

        {wrongAnswers.length > 0 && (
          <Card className="review-card">
            <div className="section-title">
              <div>
                <h2>Revisão dos erros</h2>
                <p>Leia o comentário e siga para o próximo. O caderno guarda essas questões.</p>
              </div>
              <Link to="/cadernos" className="text-link">
                abrir caderno
              </Link>
            </div>
            <div className="review-list">
              {wrongAnswers.map((answer) => {
                const question = allQuestions.find((item) => item.id === answer.questionId)
                if (!question) return null
                const discipline = disciplineById(question.disciplineId)
                return (
                  <article className="review-item" key={answer.questionId}>
                    <div className="review-item-head">
                      <Chip tone="red" icon={X}>
                        erro
                      </Chip>
                      <span className="review-discipline">
                        <i style={{ background: discipline.color }} />
                        {discipline.name}
                      </span>
                      <span className="review-topic">{question.topic}</span>
                    </div>
                    <p className="review-statement">{question.statement}</p>
                    <p className="review-answer">
                      Sua resposta: <strong>{letters[answer.chosen]})</strong>{' '}
                      {question.options[answer.chosen]}
                    </p>
                    <p className="review-answer review-correct">
                      Correta: <strong>{letters[question.correct]})</strong> {question.options[question.correct]}
                    </p>
                    <p className="review-explanation">{question.explanation}</p>
                  </article>
                )
              })}
            </div>
          </Card>
        )}

        {wrongAnswers.length === 0 && answered > 0 && (
          <Card className="perfect-card">
            <Trophy size={28} />
            <div>
              <h2>Rodada limpa.</h2>
              <p>Você acertou todas as questões respondidas. Aumente a dificuldade ou vá para um simulado cronometrado.</p>
            </div>
            <Link to="/simulados" className="btn btn-primary">
              Fazer um simulado
            </Link>
          </Card>
        )}
      </div>
    )
  }

  if (!current) return null
  const isFavorite = state.favorites.includes(current.id)
  const discipline = disciplineById(current.disciplineId)
  const progress = ((index + (confirmed ? 1 : 0)) / sessionQuestions.length) * 100

  return (
    <div className="practice-page">
      <div className="practice-top">
        <button type="button" className="back-link" onClick={() => setShowQuit(true)}>
          <ArrowLeft size={16} />
          Sair da rodada
        </button>
        <div className="practice-title">
          <span>{override?.title ?? config.title}</span>
          {(override?.subtitle ?? config.subtitle) && <em>{override?.subtitle ?? config.subtitle}</em>}
        </div>
        <div className={`practice-timer ${limitSeconds && remaining < 300 ? 'timer-low' : ''}`}>
          {limitSeconds ? <Timer size={16} /> : <Clock3 size={16} />}
          <strong>{formatTimer(limitSeconds ? remaining : elapsed)}</strong>
          <span>{limitSeconds ? 'restantes' : 'de estudo'}</span>
        </div>
      </div>

      <div className="practice-progress">
        <div className="practice-progress-meta">
          <span>
            questão <strong>{index + 1}</strong> de {sessionQuestions.length}
          </span>
          <span>{isSimulation ? 'correção ao final' : `${correctSoFar(answers)} acertos até aqui`}</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {isSimulation && (
        <div className="simulation-note">
          <CircleAlert size={15} />
          Modo simulado: as respostas não são corrigidas na hora. Você verá o gabarito no final.
        </div>
      )}

      <Card className="question-card">
        <div className="question-card-head">
          <QuestionMeta question={current} />
          <div className="question-tools">
            <button
              type="button"
              className={`bookmark-button ${isFavorite ? 'is-favorite' : ''}`}
              onClick={() => {
                actions.toggleFavorite(current.id)
                actions.notify(isFavorite ? 'Questão removida dos favoritos.' : 'Questão salva no caderno de favoritas.')
              }}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              {isFavorite ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
            </button>
            <button
              type="button"
              className="bookmark-button"
              onClick={() => actions.notify('Obrigado. A questão foi enviada para revisão.')}
              aria-label="Reportar problema na questão"
            >
              <Flag size={17} />
            </button>
          </div>
        </div>

        <div className="question-body">
          <div className="question-topic-line">
            <span style={{ background: discipline.color }} />
            {current.topic}
          </div>
          <p className="question-statement">{current.statement}</p>

          <div className="options" role="radiogroup" aria-label="Alternativas">
            {current.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex
              const isCorrect = confirmed && optionIndex === current.correct
              const isWrong = confirmed && isSelected && optionIndex !== current.correct
              return (
                <button
                  type="button"
                  key={option}
                  className={`option ${isSelected ? 'option-selected' : ''} ${isCorrect ? 'option-correct' : ''} ${
                    isWrong ? 'option-wrong' : ''
                  }`}
                  onClick={() => selectOption(optionIndex)}
                  aria-pressed={isSelected}
                  disabled={confirmed}
                >
                  <span className="option-letter">
                    {isCorrect ? <Check size={15} strokeWidth={3} /> : isWrong ? <X size={15} strokeWidth={3} /> : letters[optionIndex]}
                  </span>
                  <span className="option-text">{option}</span>
                </button>
              )
            })}
          </div>

          {!confirmed && (
            <div className="question-actions">
              <span className="keyboard-hint">
                use <kbd>1</kbd>–<kbd>{current.options.length}</kbd> e <kbd>Enter</kbd>
              </span>
              <button type="button" className="btn btn-primary" onClick={submit} disabled={selected === null}>
                {isSimulation ? (index + 1 >= sessionQuestions.length ? 'Confirmar e ver resultado' : 'Confirmar e avançar') : 'Confirmar resposta'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {confirmed && (
            <div className={`feedback ${selected === current.correct ? 'feedback-right' : 'feedback-wrong'}`}>
              <div className="feedback-head">
                <span className="feedback-icon">
                  {selected === current.correct ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                </span>
                <div>
                  <strong>{selected === current.correct ? 'Resposta correta' : 'Não foi essa'}</strong>
                  <p>
                    Gabarito: <b>{letters[current.correct]})</b> {current.options[current.correct]}
                  </p>
                </div>
                <Chip tone="green" icon={Flame}>
                  comentário
                </Chip>
              </div>
              <p className="feedback-explanation">{current.explanation}</p>
              <div className="feedback-actions">
                <span className="feedback-discipline">
                  <i style={{ background: discipline.color }} />
                  {discipline.name}
                </span>
                <button type="button" className="btn btn-primary" onClick={next}>
                  {index + 1 >= sessionQuestions.length ? 'Ver resultado' : 'Próxima questão'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="practice-foot">
        <Link to="/questoes" className="back-link">
          <ChevronLeft size={15} />
          Banco de questões
        </Link>
        <span>
          <ListChecks size={14} />
          Seu progresso é salvo a cada resposta
        </span>
      </div>

      {showQuit && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="quit-title">
          <div className="dialog">
            <h2 id="quit-title">Sair agora?</h2>
            <p>
              As questões já respondidas ficam salvas. As que faltam continuam em aberto e você pode recomeçar depois.
            </p>
            <div className="dialog-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowQuit(false)}>
                Continuar estudando
              </button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => navigate(isSimulation ? '/simulados' : '/questoes')}
              >
                Sair da rodada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const correctSoFar = (answers: AnswerRecord[]) => answers.filter((answer) => answer.correct).length
