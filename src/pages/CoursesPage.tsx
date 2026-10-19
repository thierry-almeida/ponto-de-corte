import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Clock3, GraduationCap, Layers3, Play, Sparkles } from 'lucide-react'
import { useApp } from '../store'
import { courses } from '../data/courses'
import { disciplineById } from '../data/disciplines'
import { percent } from '../lib/utils'
import { Card, Chip, PageHeader, ProgressBar, SectionTitle } from '../components/ui'

const courseLessonCount = (course: (typeof courses)[number]) =>
  course.modules.reduce((total, module) => total + module.lessons.length, 0)

export default function CoursesPage() {
  const { state } = useApp()
  const navigate = useNavigate()
  const featured = courses.find((course) => course.featured) ?? courses[0]
  const others = courses.filter((course) => course.id !== featured.id)
  const featuredDiscipline = disciplineById(featured.disciplineId)
  const featuredTotal = courseLessonCount(featured)
  const featuredDone = state.courseProgress.filter((key) => key.startsWith(`${featured.id}:`)).length

  return (
    <div className="page-stack">
      <PageHeader
        title="Cursos completos"
        subtitle="Aulas em vídeo para quem quer a explicação antes da questão. Comece pelo módulo do seu edital ou retome de onde parou."
        actions={
          <Chip tone="blue" icon={Sparkles}>
            novo na plataforma
          </Chip>
        }
      />

      <Card className="course-feature">
        <div className="course-feature-cover" style={{ background: featuredDiscipline.color }}>
          <span className="course-cover-grid" />
          <span className="course-cover-code">{featuredDiscipline.short}</span>
          <span className="course-cover-label">curso em destaque</span>
        </div>
        <div className="course-feature-copy">
          <span className="eyebrow">{featured.level} · {featured.teacher}</span>
          <h2>{featured.title}</h2>
          <p>{featured.description}</p>
          <div className="course-feature-meta">
            <span>
              <Play size={15} />
              {featuredTotal} aulas
            </span>
            <span>
              <Clock3 size={15} />
              {featured.hours} horas
            </span>
            <span>
              <Layers3 size={15} />
              {featured.modules.length} módulos
            </span>
          </div>
          <div className="course-feature-progress">
            <div className="course-progress-label">
              <span>seu progresso</span>
              <strong>{percent(featuredDone, featuredTotal)}%</strong>
            </div>
            <ProgressBar value={percent(featuredDone, featuredTotal)} color={featuredDiscipline.color} />
          </div>
          <div className="course-feature-actions">
            <button type="button" className="btn btn-primary" onClick={() => navigate(`/cursos/${featured.id}`)}>
              <Play size={16} fill="currentColor" />
              {featuredDone ? 'Continuar curso' : 'Começar curso'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(`/cursos/${featured.id}`)}>
              Ver ementa
            </button>
          </div>
        </div>
      </Card>

      <SectionTitle
        title="Outros cursos"
        hint="Conteúdo em vídeo, material de apoio e questões comentadas no fim de cada módulo."
        action={
          <Chip tone="neutral" icon={GraduationCap}>
            {courses.length} cursos
          </Chip>
        }
      />

      <div className="courses-grid">
        {others.map((course) => {
          const discipline = disciplineById(course.disciplineId)
          const total = courseLessonCount(course)
          const done = state.courseProgress.filter((key) => key.startsWith(`${course.id}:`)).length
          return (
            <article className="course-card" key={course.id}>
              <Link to={`/cursos/${course.id}`} className="course-cover" style={{ background: discipline.color }}>
                <span className="course-cover-grid" />
                <span className="course-cover-code">{discipline.short}</span>
                <span className="course-cover-level">{course.level}</span>
              </Link>
              <div className="course-card-body">
                <span className="course-teacher">{course.teacher}</span>
                <h3>
                  <Link to={`/cursos/${course.id}`}>{course.title}</Link>
                </h3>
                <div className="course-meta">
                  <span>
                    <Play size={13} />
                    {total} aulas
                  </span>
                  <span>
                    <Clock3 size={13} />
                    {course.hours} h
                  </span>
                </div>
                <div className="course-card-progress">
                  <span>{done} de {total} aulas</span>
                  <strong>{percent(done, total)}%</strong>
                </div>
                <ProgressBar value={percent(done, total)} color={discipline.color} size="thin" />
                <Link to={`/cursos/${course.id}`} className="course-card-cta">
                  {done ? 'Continuar' : 'Começar curso'}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <Card className="courses-note">
        <span className="courses-note-icon">
          <Check size={20} strokeWidth={2.4} />
        </span>
        <div>
          <h3>Curso, resumo e questão no mesmo lugar.</h3>
          <p>
            Ao concluir uma aula, o material correspondente fica marcado na sua biblioteca. Ao errar uma questão do
            curso, ela entra automaticamente no caderno de erros.
          </p>
        </div>
        <Link to="/materiais" className="btn btn-ghost btn-sm">
          Ver materiais
          <ArrowRight size={15} />
        </Link>
      </Card>
    </div>
  )
}
