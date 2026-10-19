import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Clock3, Layers3, LockKeyhole, Sparkles } from 'lucide-react'
import { useApp } from '../store'
import { materials } from '../data/materials'
import { disciplines, disciplineById, upcomingDisciplines } from '../data/disciplines'
import { formatMinutes, percent } from '../lib/utils'
import { Card, Chip, LinkArrow, PageHeader, ProgressBar, SectionTitle } from '../components/ui'

export default function MaterialsPage() {
  const { state } = useApp()
  const totalLessons = materials.reduce((total, material) => total + material.lessons.length, 0)
  const readCount = materials.reduce(
    (total, material) => total + material.lessons.filter((lesson) => state.readLessons.includes(lesson.id)).length,
    0,
  )
  const totalMinutes = materials.reduce(
    (total, material) => total + material.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0),
    0,
  )
  const lastMaterial = materials.find((material) => material.disciplineId === state.lastMaterial?.disciplineId)
  const lastLesson = lastMaterial?.lessons.find((lesson) => lesson.id === state.lastMaterial?.lessonId)

  return (
    <div className="page-stack">
      <PageHeader
        title="Materiais de estudo"
        subtitle="Resumos por disciplina, escritos para caber na sua semana. Marque a aula como lida e o progresso acompanha."
        actions={
          <Link
            to={lastMaterial && lastLesson ? `/materiais/${lastMaterial.disciplineId}/${lastLesson.id}` : `/materiais/${materials[0].disciplineId}`}
            className="btn btn-primary"
          >
            <BookOpen size={17} />
            {lastMaterial ? 'Continuar leitura' : 'Começar a estudar'}
          </Link>
        }
      />

      <Card className="materials-hero">
        <div className="materials-hero-copy">
          <span className="eyebrow">sua biblioteca</span>
          <h2>
            {readCount} de {totalLessons} aulas concluídas
          </h2>
          <p>
            {formatMinutes(totalMinutes)} de leitura organizada em {materials.length} disciplinas. Cada resumo tem
            definições, exceções e uma lista de pontos para revisar antes da prova.
          </p>
          <div className="materials-hero-stats">
            <span>
              <BookOpen size={15} />
              {materials.length} disciplinas
            </span>
            <span>
              <Clock3 size={15} />
              {formatMinutes(totalMinutes)} no total
            </span>
            <span>
              <Check size={15} />
              {percent(readCount, totalLessons)}% concluído
            </span>
          </div>
        </div>
        <div className="materials-hero-progress">
          <div className="materials-progress-head">
            <span>progresso geral</span>
            <strong>{percent(readCount, totalLessons)}%</strong>
          </div>
          <ProgressBar value={percent(readCount, totalLessons)} />
          {lastMaterial && lastLesson && (
            <Link to={`/materiais/${lastMaterial.disciplineId}/${lastLesson.id}`} className="materials-continue">
              <span className="materials-continue-icon">
                <BookOpen size={16} />
              </span>
              <span>
                <em>continuar de onde parou</em>
                <strong>{lastLesson.title}</strong>
              </span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </Card>

      <SectionTitle
        title="Por disciplina"
        hint="Dois resumos por disciplina, com o que mais aparece nas provas."
        action={
          <Chip tone="yellow" icon={Sparkles}>
            {totalLessons} aulas
          </Chip>
        }
      />

      <div className="materials-grid">
        {materials.map((material) => {
          const discipline = disciplineById(material.disciplineId)
          const read = material.lessons.filter((lesson) => state.readLessons.includes(lesson.id)).length
          const minutes = material.lessons.reduce((total, lesson) => total + lesson.minutes, 0)
          const progress = percent(read, material.lessons.length)
          return (
            <Link to={`/materiais/${material.disciplineId}`} className="material-card" key={material.disciplineId}>
              <div className="material-card-head">
                <span className="material-icon" style={{ background: discipline.color }}>
                  {discipline.short}
                </span>
                <div className="material-card-title">
                  <h3>{discipline.name}</h3>
                  <span>{material.lessons.length} aulas · {formatMinutes(minutes)}</span>
                </div>
                {progress === 100 && (
                  <span className="material-done" title="Concluído">
                    <Check size={15} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="material-card-intro">{material.intro}</p>
              <div className="material-card-lessons">
                {material.lessons.map((lesson) => (
                  <span key={lesson.id} className={state.readLessons.includes(lesson.id) ? 'is-read' : ''}>
                    {state.readLessons.includes(lesson.id) ? <Check size={13} /> : <i />}
                    {lesson.title}
                  </span>
                ))}
              </div>
              <div className="material-card-foot">
                <span>{read} de {material.lessons.length} concluídas</span>
                <strong>{progress}%</strong>
              </div>
              <ProgressBar value={progress} color={discipline.color} size="thin" />
            </Link>
          )
        })}
      </div>

      <Card className="materials-print">
        <div className="materials-print-icon">
          <Layers3 size={22} />
        </div>
        <div>
          <Chip tone="yellow">bônus</Chip>
          <h3>Apostilas para impressão</h3>
          <p>
            Uma seleção dos resumos em PDF para levar no caderno. Você pode baixar os materiais já lidos e montar seu
            próprio bloco de revisão.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => window.print()}
        >
          Imprimir materiais
          <ArrowRight size={15} />
        </button>
      </Card>

      <section className="upcoming">
        <SectionTitle
          title="Em produção"
          hint="Estas disciplinas entram na ordem do edital, conforme os resumos ficam prontos."
          action={
            <span className="text-link">
              <LockKeyhole size={13} />
              em breve
            </span>
          }
        />
        <div className="upcoming-list">
          {upcomingDisciplines.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>

      <p className="materials-footnote">
        <LinkArrow>Conteúdo autoral baseado em legislação e bibliografia de referência</LinkArrow>
      </p>
    </div>
  )
}
