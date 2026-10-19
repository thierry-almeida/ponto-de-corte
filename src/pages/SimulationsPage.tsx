import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Flame,
  ListChecks,
  Play,
  Shuffle,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react'
import { useApp } from '../store'
import { questions } from '../data/questions'
import { disciplineById } from '../data/disciplines'
import { shuffle, formatSeconds } from '../lib/utils'
import { Card, Chip, PageHeader, SectionTitle, StatCard } from '../components/ui'

type Focus = 'equilibrado' | 'fracos' | 'agil'

export default function SimulationsPage() {
  const { state, stats } = useApp()
  const navigate = useNavigate()
  const [count, setCount] = useState(20)
  const [minutes, setMinutes] = useState(40)
  const [focus, setFocus] = useState<Focus>('equilibrado')

  const simulationAttempts = state.attempts.filter((attempt) => attempt.mode === 'simulado')
  const simulationAccuracy = simulationAttempts.length
    ? Math.round((simulationAttempts.filter((attempt) => attempt.correct).length / simulationAttempts.length) * 100)
    : 0

  const startCustom = () => {
    let pool = [...questions]
    if (focus === 'fracos' && stats.weak.length) {
      const weakIds = stats.weak.map((item) => item.disciplineId)
      pool = [
        ...pool.filter((question) => weakIds.includes(question.disciplineId)),
        ...shuffle(pool.filter((question) => !weakIds.includes(question.disciplineId))),
      ]
    } else {
      pool = shuffle(pool)
    }
    const ids = pool.slice(0, Math.min(count, pool.length)).map((question) => question.id)
    navigate('/praticar', {
      state: {
        questionIds: ids,
        title: 'Simulado personalizado',
        subtitle: `${count} questões · ${minutes} minutos · correção ao final`,
        mode: 'simulado',
        limitMinutes: minutes,
      },
    })
  }

  const startPreset = (preset: 'diagnostico' | 'bancos' | 'fracos') => {
    if (preset === 'diagnostico') {
      const ids = shuffle(questions).slice(0, 10).map((question) => question.id)
      navigate('/praticar', {
        state: {
          questionIds: ids,
          title: 'Diagnóstico rápido',
          subtitle: '10 questões · 20 minutos',
          mode: 'simulado',
          limitMinutes: 20,
        },
      })
      return
    }
    if (preset === 'bancos') {
      const banking = ['portugues', 'administrativo', 'constitucional', 'contabilidade', 'logica', 'informatica']
      const pool = shuffle(questions.filter((question) => banking.includes(question.disciplineId)))
      navigate('/praticar', {
        state: {
          questionIds: pool.slice(0, 20).map((question) => question.id),
          title: 'Simulado Carreiras Bancárias',
          subtitle: '20 questões · 40 minutos · estilo Banco do Brasil',
          mode: 'simulado',
          limitMinutes: 40,
        },
      })
      return
    }
    const weakIds = stats.weak.map((item) => item.disciplineId)
    const pool = shuffle(questions.filter((question) => weakIds.includes(question.disciplineId)))
    const fallback = shuffle(questions.filter((question) => !weakIds.includes(question.disciplineId)))
    const ids = [...pool, ...fallback].slice(0, 15).map((question) => question.id)
    navigate('/praticar', {
      state: {
        questionIds: ids,
        title: 'Simulado dos pontos fracos',
        subtitle: '15 questões · 30 minutos',
        mode: 'simulado',
        limitMinutes: 30,
      },
    })
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Simulados"
        subtitle="Treine com tempo, sem correção imediata. No fim, veja o gabarito comentado e o que precisa voltar ao plano."
        actions={
          <Chip tone="yellow" icon={Timer}>
            correção ao final
          </Chip>
        }
      />

      <div className="simulation-stats">
        <StatCard
          label="Questões em simulados"
          value={String(simulationAttempts.length)}
          detail="respondidas no modo cronometrado"
          icon={ListChecks}
        />
        <StatCard
          label="Aproveitamento"
          value={simulationAttempts.length ? `${simulationAccuracy}%` : '—'}
          detail="nos simulados já feitos"
          icon={TrendingUp}
          tone="green"
        />
        <StatCard
          label="Tempo médio"
          value={formatSeconds(simAttemptsAverage(simulationAttempts))}
          detail="por questão em simulado"
          icon={Clock3}
        />
      </div>

      <Card className="simulation-builder">
        <div className="simulation-builder-copy">
          <span className="eyebrow">monte o seu</span>
          <h2>Um simulado do tamanho do seu tempo.</h2>
          <p>
            Escolha o número de questões, o limite de tempo e se quer priorizar seus pontos fracos. O cronômetro começa
            quando você clicar em começar.
          </p>
          <div className="builder-summary">
            <span>
              <FileText size={16} /> {count} questões
            </span>
            <span>
              <Timer size={16} /> {minutes} minutos
            </span>
            <span>
              <Target size={16} />
              {focus === 'equilibrado' ? 'todas as disciplinas' : focus === 'fracos' ? 'pontos fracos' : 'ritmo de prova'}
            </span>
          </div>
          <button type="button" className="btn btn-primary" onClick={startCustom}>
            <Play size={16} fill="currentColor" />
            Começar simulado
          </button>
        </div>
        <div className="builder-controls">
          <label className="builder-field" htmlFor="sim-count">
            <span>Questões</span>
            <select id="sim-count" className="input select" value={count} onChange={(event) => setCount(Number(event.target.value))}>
              <option value={10}>10 questões</option>
              <option value={20}>20 questões</option>
              <option value={30}>30 questões</option>
              <option value={40}>40 questões</option>
            </select>
          </label>
          <label className="builder-field" htmlFor="sim-time">
            <span>Tempo</span>
            <select id="sim-time" className="input select" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))}>
              <option value={20}>20 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={40}>40 minutos</option>
              <option value={60}>60 minutos</option>
              <option value={90}>90 minutos</option>
            </select>
          </label>
          <div className="builder-field">
            <span>Foco</span>
            <div className="segmented">
              <button type="button" className={focus === 'equilibrado' ? 'active' : ''} onClick={() => setFocus('equilibrado')}>
                Equilibrado
              </button>
              <button type="button" className={focus === 'fracos' ? 'active' : ''} onClick={() => setFocus('fracos')}>
                Pontos fracos
              </button>
              <button type="button" className={focus === 'agil' ? 'active' : ''} onClick={() => setFocus('agil')}>
                Ritmo
              </button>
            </div>
          </div>
          <p className="builder-note">
            {focus === 'agil'
              ? 'Ritmo de prova: prioriza questões rápidas e alterna disciplinas.'
              : focus === 'fracos'
                ? 'Usa suas três disciplinas com menor taxa de acerto para montar a prova.'
                : 'Mistura disciplinas com o peso do seu edital.'}
          </p>
        </div>
      </Card>

      <SectionTitle
        title="Prontos para começar"
        hint="Formatos rápidos para os dias em que você quer só apertar o play."
        action={
          <span className="text-link">
            <Shuffle size={14} />
            questões embaralhadas
          </span>
        }
      />

      <div className="simulation-presets">
        <button type="button" className="simulation-card" onClick={() => startPreset('diagnostico')}>
          <span className="simulation-card-tab" style={{ background: '#3157b7' }}>
            20 min
          </span>
          <div className="simulation-card-top">
            <span className="simulation-card-icon">
              <Flame size={20} />
            </span>
            <Chip tone="green">rápido</Chip>
          </div>
          <h3>Diagnóstico rápido</h3>
          <p>Dez questões variadas para medir onde você está antes de montar a semana.</p>
          <div className="simulation-card-meta">
            <span>10 questões</span>
            <span>20 minutos</span>
            <span>todas as disciplinas</span>
          </div>
          <span className="simulation-card-cta">
            Começar
            <ArrowRight size={16} />
          </span>
        </button>

        <button type="button" className="simulation-card simulation-featured" onClick={() => startPreset('bancos')}>
          <span className="simulation-card-tab" style={{ background: '#f3d34a', color: '#17221c' }}>
            edital
          </span>
          <div className="simulation-card-top">
            <span className="simulation-card-icon">
              <Target size={20} />
            </span>
            <Chip tone="yellow">carreiras bancárias</Chip>
          </div>
          <h3>Simulado Banco do Brasil</h3>
          <p>Uma prova no formato do seu concurso, com as disciplinas que mais pesam no edital.</p>
          <div className="simulation-card-meta">
            <span>20 questões</span>
            <span>40 minutos</span>
            <span>6 disciplinas</span>
          </div>
          <span className="simulation-card-cta">
            Começar
            <ArrowRight size={16} />
          </span>
        </button>

        <button type="button" className="simulation-card" onClick={() => startPreset('fracos')}>
          <span className="simulation-card-tab" style={{ background: '#e2563c' }}>
            15 q
          </span>
          <div className="simulation-card-top">
            <span className="simulation-card-icon">
              <TrendingUp size={20} />
            </span>
            <Chip tone="red">pontos fracos</Chip>
          </div>
          <h3>Simulado de recuperação</h3>
          <p>Foco nas disciplinas em que sua taxa de acerto está mais baixa. Sem esconder o problema.</p>
          <div className="simulation-card-meta">
            <span>15 questões</span>
            <span>30 minutos</span>
            <span>3 disciplinas</span>
          </div>
          <span className="simulation-card-cta">
            Começar
            <ArrowRight size={16} />
          </span>
        </button>
      </div>

      <div className="simulation-how">
        <Card>
          <span className="how-number">1</span>
          <div>
            <h3>Responda sem interrupção</h3>
            <p>As alternativas são registradas e você segue para a próxima. Não há comentário durante a prova.</p>
          </div>
        </Card>
        <Card>
          <span className="how-number">2</span>
          <div>
            <h3>Encare o gabarito</h3>
            <p>No fim, cada erro vem com a alternativa correta e o comentário. O caderno guarda tudo.</p>
          </div>
        </Card>
        <Card>
          <span className="how-number">3</span>
          <div>
            <h3>Volte ao plano</h3>
            <p>As disciplinas com pior desempenho ganham prioridade no seu plano da próxima semana.</p>
          </div>
        </Card>
      </div>

      <Card className="simulation-tip">
        <CheckCircle2 size={20} />
        <p>
          <strong>Dica de prova:</strong> marque as difíceis, siga em frente e volte no fim. O cronômetro é seu aliado,
          não seu inimigo.
        </p>
        <button type="button" className="text-link" onClick={() => navigate('/plano')}>
          ajustar plano
        </button>
      </Card>

      <p className="simulation-disclaimer">
        Os simulados usam a base demonstrativa de {questions.length} questões autorais. Cada disciplina aparece com o
        peso aproximado de um edital bancário.
      </p>
    </div>
  )
}

const simAttemptsAverage = (attempts: { seconds: number }[]) =>
  attempts.length ? Math.round(attempts.reduce((total, attempt) => total + attempt.seconds, 0) / attempts.length) : 0
