import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Layers3,
  ListChecks,
  NotebookPen,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../store'
import { materialByDiscipline, materials } from '../data/materials'
import { disciplineById } from '../data/disciplines'
import { questions } from '../data/questions'
import { formatMinutes, percent } from '../lib/utils'
import { Card, Chip, ProgressBar } from '../components/ui'

export default function MaterialDetailPage() {
  const { disciplineId = 'portugues', lessonId } = useParams()
  const navigate = useNavigate()
  const { state, actions } = useApp()
  const material = materialByDiscipline(disciplineId)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!material) {
    return (
      <Card className="practice-empty">
        <h1>Material não encontrado</h1>
        <Link to="/materiais" className="btn btn-primary">
          Voltar aos materiais
        </Link>
      </Card>
    )
  }

  const discipline = disciplineById(material.disciplineId)
  const selectedLesson = material.lessons.find((lesson) => lesson.id === lessonId) ?? material.lessons[0]
  const currentIndex = material.lessons.findIndex((lesson) => lesson.id === selectedLesson.id)
  const previous = material.lessons[currentIndex - 1]
  const next = material.lessons[currentIndex + 1]
  const read = material.lessons.filter((lesson) => state.readLessons.includes(lesson.id)).length
  const progress = percent(read, material.lessons.length)
  const isRead = state.readLessons.includes(selectedLesson.id)
  const practiceQuestions = questions.filter((question) => question.disciplineId === material.disciplineId)
  const otherMaterials = materials.filter((item) => item.disciplineId !== material.disciplineId)

  const goToLesson = (id: string) => {
    navigate(`/materiais/${material.disciplineId}/${id}`)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const practice = () => {
    navigate('/praticar', {
      state: {
        questionIds: practiceQuestions.map((question) => question.id),
        title: discipline.name,
        subtitle: 'Questões relacionadas ao resumo',
        mode: 'avulso',
      },
    })
  }

  return (
    <div className="material-detail page-stack">
      <div className="detail-breadcrumb">
        <Link to="/materiais" className="back-link">
          <ArrowLeft size={16} />
          Materiais
        </Link>
        <span>/</span>
        <span>{discipline.name}</span>
        <button type="button" className="mobile-lesson-toggle" onClick={() => setSidebarOpen((value) => !value)}>
          <Layers3 size={15} />
          aulas
        </button>
      </div>

      <header className="material-detail-head">
        <span className="material-icon large" style={{ background: discipline.color }}>
          {discipline.short}
        </span>
        <div>
          <span className="eyebrow">{material.title}</span>
          <h1>{selectedLesson.title}</h1>
          <div className="material-detail-meta">
            <span>
              <Clock3 size={14} />
              {selectedLesson.minutes} min de leitura
            </span>
            <span>
              <Bookmark size={14} />
              aula {currentIndex + 1} de {material.lessons.length}
            </span>
            <span className={isRead ? 'meta-read' : ''}>
              <Check size={14} />
              {isRead ? 'concluída' : 'não lida'}
            </span>
          </div>
        </div>
      </header>

      <div className="material-detail-layout">
        <div className="material-reader-column">
          <Card className="material-reader">
            <p className="material-summary">{selectedLesson.summary}</p>
            {selectedLesson.sections.map((section) => (
              <section className="material-section" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.points && (
                  <div className="key-points">
                    <span className="key-points-label">
                      <Sparkles size={14} />
                      guarde isto
                    </span>
                    <ul>
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}

            <div className="material-reader-actions">
              <button
                type="button"
                className={`btn ${isRead ? 'btn-ghost' : 'btn-primary'}`}
                onClick={() => {
                  actions.markLessonRead(selectedLesson.id, material.disciplineId)
                  actions.notify(isRead ? 'Aula marcada como não lida.' : 'Aula concluída. Uma a menos na fila.')
                }}
              >
                <Check size={16} />
                {isRead ? 'Marcar como não lida' : 'Marcar como lida'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={practice}>
                <ListChecks size={16} />
                Praticar {practiceQuestions.length} questões
              </button>
            </div>
          </Card>

          <div className="material-pager">
            {previous ? (
              <button type="button" className="material-pager-link" onClick={() => goToLesson(previous.id)}>
                <span>
                  <ChevronLeft size={15} /> aula anterior
                </span>
                <strong>{previous.title}</strong>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button type="button" className="material-pager-link next" onClick={() => goToLesson(next.id)}>
                <span>
                  próxima aula <ChevronRight size={15} />
                </span>
                <strong>{next.title}</strong>
              </button>
            ) : (
              <Link to="/materiais" className="material-pager-link next">
                <span>fim do material</span>
                <strong>Voltar para a biblioteca</strong>
              </Link>
            )}
          </div>
        </div>

        <aside className={`material-side ${sidebarOpen ? 'material-side-open' : ''}`}>
          <Card className="material-progress-card">
            <div className="material-progress-head">
              <span>seu progresso</span>
              <strong>{progress}%</strong>
            </div>
            <ProgressBar value={progress} color={discipline.color} />
            <p>
              {read} de {material.lessons.length} aulas ·{' '}
              {formatMinutes(material.lessons.reduce((total, lesson) => total + lesson.minutes, 0))} de leitura
            </p>
            <div className="material-lesson-list">
              {material.lessons.map((lesson, index) => {
                const lessonRead = state.readLessons.includes(lesson.id)
                const active = lesson.id === selectedLesson.id
                return (
                  <button
                    type="button"
                    key={lesson.id}
                    className={`material-lesson-item ${active ? 'active' : ''} ${lessonRead ? 'is-read' : ''}`}
                    onClick={() => goToLesson(lesson.id)}
                  >
                    <span className="material-lesson-check">
                      {lessonRead ? <Check size={12} strokeWidth={3} /> : index + 1}
                    </span>
                    <span>
                      <strong>{lesson.title}</strong>
                      <em>{lesson.minutes} min</em>
                    </span>
                    {active && <ChevronRight size={15} />}
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="material-source">
            <span className="eyebrow">fonte</span>
            <p>{material.source}</p>
            <span className="material-source-note">
              <NotebookPen size={14} />
              Resumo autoral. Consulte a norma original para detalhes.
            </span>
          </Card>

          <Card className="material-other">
            <span className="eyebrow">continue explorando</span>
            <div className="material-other-list">
              {otherMaterials.slice(0, 4).map((item) => {
                const itemDiscipline = disciplineById(item.disciplineId)
                return (
                  <Link to={`/materiais/${item.disciplineId}`} key={item.disciplineId}>
                    <i style={{ background: itemDiscipline.color }} />
                    <span>{itemDiscipline.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                )
              })}
            </div>
          </Card>

          <Link to="/flashcards" className="material-flash-cta">
            <Layers3 size={18} />
            <div>
              <strong>Revisar com flashcards</strong>
              <span>Fixe o que acabou de ler.</span>
            </div>
            <ChevronRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  )
}
