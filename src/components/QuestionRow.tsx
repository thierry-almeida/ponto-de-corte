import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, ChevronRight, CircleCheck, CircleDashed } from 'lucide-react'
import type { Question } from '../types'
import { disciplineById } from '../data/disciplines'
import { useApp } from '../store'

export function QuestionMeta({ question }: { question: Question }) {
  const discipline = disciplineById(question.disciplineId)
  return (
    <div className="question-meta">
      <span className="meta-discipline">
        <i style={{ background: discipline.color }} />
        {discipline.name}
      </span>
      <span className="meta-dot">·</span>
      <span>
        {question.board} {question.year}
      </span>
      <span className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
    </div>
  )
}

export default function QuestionRow({ question, mode = 'feed' }: { question: Question; mode?: 'feed' | 'compact' }) {
  const { state, actions } = useApp()
  const discipline = disciplineById(question.disciplineId)
  const isFavorite = state.favorites.includes(question.id)
  const solved = state.solved[question.id]

  return (
    <article className={`question-row ${mode === 'compact' ? 'question-row-compact' : ''}`}>
      <div className="question-row-main">
        <QuestionMeta question={question} />
        <h3>{question.topic}</h3>
        <p className="question-snippet">{question.statement}</p>
        <div className="question-row-foot">
          <span className={`solved-tag ${solved ? (solved.correct ? 'solved-right' : 'solved-wrong') : ''}`}>
            {solved ? (
              solved.correct ? (
                <CircleCheck size={14} />
              ) : (
                <CircleDashed size={14} />
              )
            ) : (
              <CircleDashed size={14} />
            )}
            {solved ? (solved.correct ? 'já acertou' : 'revisar erro') : 'não respondida'}
          </span>
          <span className="tag-list">
            {question.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="mini-tag">
                {tag}
              </span>
            ))}
          </span>
        </div>
      </div>
      <div className="question-row-side">
        <button
          type="button"
          className={`bookmark-button ${isFavorite ? 'is-favorite' : ''}`}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          onClick={() => {
            actions.toggleFavorite(question.id)
            actions.notify(isFavorite ? 'Questão removida dos favoritos.' : 'Questão salva nos favoritos.')
          }}
        >
          {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
        <Link
          to="/praticar"
          state={{
            questionIds: [question.id],
            title: discipline.name,
            subtitle: question.topic,
            mode: 'avulso',
          }}
          className="question-open"
          aria-label={`Responder questão de ${question.topic}`}
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </article>
  )
}
