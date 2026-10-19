import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Flame,
  Layers3,
  ListChecks,
  Play,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react'
import { useApp } from '../store'
import { disciplineById } from '../data/disciplines'
import { questions } from '../data/questions'
import { materialByDiscipline, allLessons } from '../data/materials'
import { flashcards } from '../data/flashcards'
import { dueFlashcards } from '../lib/stats'
import { generatePlan } from '../lib/plan'
import { dateKey, formatMinutes, formatSeconds, greeting, percent, trialDaysLeft, weekdayShort } from '../lib/utils'
import { ActivityChart, Card, Chip, LinkArrow, MiniMeter, PageHeader, ProgressBar, Ring, SectionTitle, StatCard } from '../components/ui'

function relativeWhen(iso: string) {
  const date = new Date(iso)
  const today = dateKey()
  const key = iso.slice(0, 10)
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (key === today) return `hoje, ${time}`
  if (key === dateKey(new Date(Date.now() - 86400000))) return `ontem, ${time}`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function Dashboard() {
  const { state, stats, actions } = useApp()
  const navigate = useNavigate()
  const firstName = state.profile.name.split(' ')[0]
  const goal = state.profile.dailyGoal
  const todayPercent = percent(stats.todayAttempts, goal)
  const due = dueFlashcards(state, flashcards.map((card) => card.id))
  const planBlocks = generatePlan(state.plan, stats, state.planDone).filter((block) => block.date === dateKey())
  const lastMaterial = state.lastMaterial
    ? materialByDiscipline(state.lastMaterial.disciplineId)
    : materialByDiscipline(state.plan.target.includes('Banco') ? 'administrativo' : 'portugues')
  const lastLesson = state.lastMaterial
    ? allLessons.find(
        (lesson) =>
          lesson.id === state.lastMaterial?.lessonId && lesson.disciplineId === state.lastMaterial?.disciplineId,
      )
    : lastMaterial?.lessons[0]
  const recent = [...state.attempts].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 5)
  const weak = stats.weak[0]
  const weakDiscipline = weak ? disciplineById(weak.disciplineId) : disciplineById('constitucional')
  const weakQuestions = questions.filter((question) => question.disciplineId === weakDiscipline.id)
  const dateLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })

  return (
    <div className="page-stack dashboard">
      <PageHeader
        eyebrow={dateLabel}
        title={`Olá, ${firstName}`}
        subtitle="Seu próximo ponto de corte começa no que você faz hoje."
        actions={
          <>
            <Link to="/questoes" className="btn btn-primary">
              <ListChecks size={17} />
              Praticar questões
            </Link>
            <Link to="/simulados" className="btn btn-ghost">
              <Timer size={17} />
              Simulados
            </Link>
          </>
        }
      />

      <div className="dashboard-top">
        <Card className="today-card">
          <div className="today-copy">
            <span className="eyebrow">meta de hoje</span>
            <h2>
              {stats.todayAttempts}
              <span className="today-goal">/{goal}</span> questões
            </h2>
            <p>
              {stats.todayAttempts === 0
                ? 'Ainda dá tempo. Comece com uma rodada curta de 10 questões.'
                : stats.todayAttempts >= goal
                  ? 'Meta batida. Se quiser, revise os erros antes de fechar o dia.'
                  : `Faltam ${goal - stats.todayAttempts} questões para bater a meta. Uma rodada de 10 resolve.`}
            </p>
            <div className="today-actions">
              <Link to="/questoes" className="btn btn-primary">
                <Play size={16} fill="currentColor" />
                Começar rodada
              </Link>
              <Link to="/flashcards/revisar/todos" className="btn btn-ghost">
                <Layers3 size={16} />
                {due.length} flashcards
              </Link>
            </div>
            <div className="today-footer">
              <span>
                <Flame size={15} />
                {stats.streak} {stats.streak === 1 ? 'dia seguido' : 'dias seguidos'}
              </span>
              <span>
                <Target size={15} />
                {todayPercent}% da meta
              </span>
            </div>
          </div>
          <Ring value={todayPercent} size={128}>
            <strong>{todayPercent}%</strong>
            <span>da meta</span>
          </Ring>
        </Card>

        <Card className="focus-card">
          <div className="focus-head">
            <div>
              <span className="eyebrow">onde focar</span>
              <h2>{weakDiscipline.name}</h2>
            </div>
            <span className="focus-mark" style={{ background: weakDiscipline.color }} />
          </div>
          <p className="focus-copy">
            {weak
              ? `Sua taxa de acerto aqui está em ${weak.accuracy}%. É o ponto que mais pode subir com pouco esforço.`
              : 'Responda algumas questões para o painel encontrar seus pontos fracos.'}
          </p>
          <div className="focus-score">
            <strong>{weak ? `${weak.accuracy}%` : '—'}</strong>
            <span>de acerto em {weak ? weak.attempts : 0} questões</span>
          </div>
          <ProgressBar value={weak?.accuracy ?? 0} color={weakDiscipline.color} />
          <div className="focus-list">
            {stats.weak.slice(0, 3).map((item) => {
              const discipline = disciplineById(item.disciplineId)
              return (
                <div key={item.disciplineId} className="focus-list-row">
                  <span>{discipline.name}</span>
                  <strong>{item.accuracy}%</strong>
                </div>
              )
            })}
          </div>
          <button
            type="button"
            className="focus-cta"
            onClick={() =>
              navigate('/praticar', {
                state: {
                  questionIds: weakQuestions.map((question) => question.id),
                  title: weakDiscipline.name,
                  subtitle: 'Rodada focada nos seus pontos fracos',
                  mode: 'avulso',
                },
              })
            }
          >
            Praticar este ponto
            <ArrowRight size={16} />
          </button>
        </Card>
      </div>

      <div className="stat-grid">
        <StatCard label="Questões hoje" value={`${stats.todayAttempts}/${goal}`} detail={`${goal - stats.todayAttempts > 0 ? `faltam ${goal - stats.todayAttempts}` : 'meta concluída'}`} icon={ListChecks} tone="yellow" />
        <StatCard label="Taxa de acerto" value={`${stats.accuracy}%`} detail={`${stats.totalAttempts} respostas registradas`} icon={TrendingUp} tone="green" />
        <StatCard label="Sequência" value={`${stats.streak} dias`} detail="estudando sem quebrar o ritmo" icon={Flame} tone="red" />
        <StatCard label="Tempo médio" value={formatSeconds(stats.avgSeconds)} detail="por questão respondida" icon={Clock3} />
      </div>

      <div className="dashboard-mid">
        <Card className="chart-card">
          <SectionTitle
            title="Ritmo dos últimos 30 dias"
            hint="Cada marca é um dia de estudo. A meta diária aparece como linha de referência."
            action={
              <Chip tone="yellow" icon={TrendingUp}>
                {stats.totalAttempts} no total
              </Chip>
            }
          />
          <ActivityChart data={stats.last30} goal={goal} />
        </Card>

        <Card className="discipline-card">
          <SectionTitle title="Por disciplina" hint="Onde você está acertando mais." />
          <div className="discipline-list">
            {stats.byDiscipline
              .slice()
              .sort((a, b) => b.attempts - a.attempts)
              .slice(0, 6)
              .map((item) => {
                const discipline = disciplineById(item.disciplineId)
                return (
                  <MiniMeter
                    key={item.disciplineId}
                    label={discipline.name}
                    value={item.accuracy}
                    right={`${item.accuracy}%`}
                    color={discipline.color}
                  />
                )
              })}
          </div>
          <Link to="/questoes" className="text-link">
            <LinkArrow>Abrir banco de questões</LinkArrow>
          </Link>
        </Card>
      </div>

      <div className="dashboard-bottom">
        <Card className="continue-card">
          <SectionTitle title="Continue de onde parou" hint="Leitura curta para manter o assunto vivo." />
          {lastLesson && lastMaterial ? (
            <div className="continue-body">
              <div className="continue-icon" style={{ background: disciplineById(lastMaterial.disciplineId).color }}>
                <BookOpen size={20} />
              </div>
              <div className="continue-copy">
                <span className="continue-discipline">{disciplineById(lastMaterial.disciplineId).name}</span>
                <h3>{lastLesson.title}</h3>
                <p>{lastLesson.summary}</p>
                <div className="continue-meta">
                  <span>
                    <Clock3 size={14} />
                    {lastLesson.minutes} min de leitura
                  </span>
                  <span>
                    <CircleCheck size={14} />
                    {state.readLessons.includes(lastLesson.id) ? 'já lida' : 'não lida'}
                  </span>
                </div>
              </div>
              <Link
                to={`/materiais/${lastMaterial.disciplineId}/${lastLesson.id}`}
                className="btn btn-dark btn-sm"
              >
                Abrir aula
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <p className="muted">Escolha um material para começar.</p>
          )}
        </Card>

        <Card className="plan-today-card">
          <SectionTitle
            title="Plano de hoje"
            hint={`Semana de ${formatMinutes(state.plan.hoursPerDay * 60)} por dia.`}
            action={
              <Link to="/plano" className="text-link">
                ver plano
              </Link>
            }
          />
          {planBlocks.length ? (
            <div className="plan-today-list">
              {planBlocks.map((block) => {
                const discipline = disciplineById(block.disciplineId)
                const done = state.planDone.includes(block.key)
                return (
                  <button
                    type="button"
                    key={block.key}
                    className={`plan-today-item ${done ? 'is-done' : ''}`}
                    onClick={() => {
                      actions.togglePlanBlock(block.key)
                      if (!done) actions.notify('Bloco concluído. Bom ritmo.')
                    }}
                  >
                    <span className="plan-check">{done ? <Check size={14} strokeWidth={3} /> : null}</span>
                    <span className="plan-color" style={{ background: discipline.color }} />
                    <span className="plan-today-copy">
                      <strong>{discipline.name}</strong>
                      <em>
                        {block.kind} · {block.detail}
                      </em>
                    </span>
                    <span className="plan-today-time">{block.minutes} min</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="plan-rest">
              <CalendarDays size={20} />
              <p>Hoje é dia de descanso no seu plano. Aproveite para revisar flashcards.</p>
              <Link to="/plano" className="text-link">
                Ajustar dias
              </Link>
            </div>
          )}
        </Card>

        <Card className="recent-card">
          <SectionTitle
            title="Atividade recente"
            hint="Suas últimas respostas."
            action={
              <Link to="/cadernos" className="text-link">
                caderno
              </Link>
            }
          />
          <div className="recent-list">
            {recent.map((attempt) => {
              const question = questions.find((item) => item.id === attempt.questionId)
              const discipline = disciplineById(attempt.disciplineId)
              if (!question) return null
              return (
                <div className="recent-row" key={attempt.id}>
                  <span className={`recent-status ${attempt.correct ? 'is-right' : 'is-wrong'}`}>
                    {attempt.correct ? <Check size={13} strokeWidth={3} /> : '×'}
                  </span>
                  <div className="recent-copy">
                    <strong>{question.topic}</strong>
                    <span>
                      {discipline.name} · {relativeWhen(attempt.at)}
                    </span>
                  </div>
                  <ChevronRight size={15} className="recent-arrow" />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="dashboard-callout">
        <span className="callout-icon">
          <Sparkles size={18} />
        </span>
        <p>
          <strong>Seu teste tem {trialDaysLeft(state.profile.joinedAt)} dias.</strong> O plano anual libera todos os
          resumos, flashcards ilimitados e o plano de estudos completo.
        </p>
        <Link to="/conta#assinatura" className="btn btn-yellow btn-sm">
          Ver planos
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
