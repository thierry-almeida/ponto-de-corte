import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, Play, GraduationCap } from 'lucide-react'
import { useApp } from '../store'
import { courseById } from '../data/courses'
import { disciplineById } from '../data/disciplines'
import { percent } from '../lib/utils'
import { Card, Chip, ProgressBar } from '../components/ui'

export default function CourseDetailPage() {
  const { courseId = '' } = useParams()
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const course = courseById(courseId)

  if (!course) {
    return (
      <Card className="practice-empty">
        <h1>Curso não encontrado</h1>
        <Link to="/cursos" className="btn btn-primary">
          Ver cursos
        </Link>
      </Card>
    )
  }

  const discipline = disciplineById(course.disciplineId)
  const total = course.modules.reduce((sum, module) => sum + module.lessons.length, 0)
  const done = state.courseProgress.filter((key) => key.startsWith(`${course.id}:`)).length
  const progress = percent(done, total)
  const firstIncomplete = course.modules
    .flatMap((module, moduleIndex) =>
      module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        key: `${course.id}:${moduleIndex}:${lessonIndex}`,
        moduleIndex,
      })),
    )
    .find((lesson) => !state.courseProgress.includes(lesson.key))

  const markLesson = (key: string, title: string) => {
    const isDone = state.courseProgress.includes(key)
    actions.toggleCourseLesson(key)
    actions.notify(isDone ? 'Aula desmarcada.' : `“${title}” concluída.`)
  }

  return (
    <div className="course-detail page-stack">
      <div className="detail-breadcrumb">
        <Link to="/cursos" className="back-link">
          <ArrowLeft size={16} />
          Cursos
        </Link>
        <span>/</span>
        <span>{course.title}</span>
      </div>

      <div className="course-detail-hero">
        <div className="course-detail-cover" style={{ background: discipline.color }}>
          <span className="course-cover-grid" />
          <span className="course-cover-code">{discipline.short}</span>
          <span className="course-cover-level">{course.level}</span>
        </div>
        <div>
          <span className="eyebrow">{discipline.name} · {course.teacher}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-feature-meta">
            <span>
              <Play size={15} />
              {total} aulas
            </span>
            <span>
              <Clock3 size={15} />
              {course.hours} horas
            </span>
            <span>
              <GraduationCap size={15} />
              certificado ao concluir
            </span>
          </div>
          <div className="course-detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                document.getElementById('curso-conteudo')?.scrollIntoView({ behavior: 'smooth' })
                if (firstIncomplete) actions.notify(`Próxima aula: ${firstIncomplete.title}`)
              }}
            >
              <Play size={16} fill="currentColor" />
              {done ? 'Continuar curso' : 'Começar curso'}
            </button>
            <Chip tone="yellow">vídeo + material de apoio</Chip>
          </div>
        </div>
      </div>

      <div className="course-detail-layout">
        <div className="course-modules" id="curso-conteudo">
          <div className="course-detail-progress">
            <div>
              <strong>{progress}% concluído</strong>
              <span>
                {done} de {total} aulas
              </span>
            </div>
            <ProgressBar value={progress} color={discipline.color} />
          </div>
          {course.modules.map((module, moduleIndex) => {
            const lessonKeys = module.lessons.map((_, lessonIndex) => `${course.id}:${moduleIndex}:${lessonIndex}`)
            const moduleDone = lessonKeys.filter((key) => state.courseProgress.includes(key)).length
            return (
              <Card className="course-module" key={module.title}>
                <div className="course-module-head">
                  <span className="course-module-number">{String(moduleIndex + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{module.title}</h2>
                    <span>{moduleDone} de {module.lessons.length} aulas concluídas</span>
                  </div>
                  {moduleDone === module.lessons.length && (
                    <span className="course-module-done">
                      <Check size={14} strokeWidth={3} /> concluído
                    </span>
                  )}
                </div>
                <div className="course-lessons">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const key = `${course.id}:${moduleIndex}:${lessonIndex}`
                    const isDone = state.courseProgress.includes(key)
                    return (
                      <div className={`course-lesson ${isDone ? 'is-done' : ''}`} key={key}>
                        <button
                          type="button"
                          className="course-lesson-play"
                          onClick={() => actions.notify('Aula em vídeo disponível na versão completa do curso.')}
                          aria-label={`Assistir aula ${lesson.title}`}
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                        <div className="course-lesson-copy">
                          <strong>{lesson.title}</strong>
                          <span>
                            <Clock3 size={12} /> {lesson.minutes} min
                          </span>
                        </div>
                        <button
                          type="button"
                          className={`course-lesson-check ${isDone ? 'checked' : ''}`}
                          onClick={() => markLesson(key, lesson.title)}
                          aria-label={isDone ? 'Desmarcar aula como concluída' : 'Marcar aula como concluída'}
                          title={isDone ? 'Desmarcar aula' : 'Marcar como concluída'}
                        >
                          {isDone && <Check size={13} strokeWidth={3} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>

        <aside className="course-detail-side">
          <Card className="course-side-card">
            <span className="eyebrow">o que você recebe</span>
            <ul className="course-benefits">
              <li><Check size={14} /> {total} aulas em vídeo</li>
              <li><Check size={14} /> Material de apoio em PDF</li>
              <li><Check size={14} /> Questões comentadas por módulo</li>
              <li><Check size={14} /> Certificado de conclusão</li>
              <li><Check size={14} /> Acesso enquanto o curso existir</li>
            </ul>
            <Link to="/materiais" className="btn btn-ghost btn-block">
              Ver resumos relacionados
            </Link>
          </Card>
          <Card className="course-side-teacher">
            <span className="avatar teacher-avatar">{course.teacher.split(' ').map((part) => part[0]).join('')}</span>
            <div>
              <strong>{course.teacher}</strong>
              <span>Professor(a) de {discipline.name}</span>
            </div>
          </Card>
          <Card className="course-side-lock">
            <LockKeyhole size={18} />
            <p>
              O curso completo faz parte do plano anual. Neste protótipo, as aulas estão liberadas para você explorar a
              experiência.
            </p>
          </Card>
          <button type="button" className="btn btn-yellow btn-block" onClick={() => navigate('/conta#assinatura')}>
            Ver plano anual
            <ArrowRight size={15} />
          </button>
        </aside>
      </div>
    </div>
  )
}
