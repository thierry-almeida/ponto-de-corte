import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, BookmarkX, ListChecks, NotebookPen, RotateCcw, Sparkles } from 'lucide-react'
import { useApp } from '../store'
import { questionById } from '../data/questions'
import { disciplines, disciplineById } from '../data/disciplines'
import { errorQuestionIds } from '../lib/stats'
import { Card, Chip, EmptyState, PageHeader, ProgressBar } from '../components/ui'
import QuestionRow from '../components/QuestionRow'

export default function NotebooksPage() {
  const { state, stats } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'erros' | 'favoritas'>('erros')

  const errorIds = useMemo(() => errorQuestionIds(state), [state])
  const errorQuestions = errorIds.map(questionById)
  const favoriteQuestions = state.favorites.map(questionById)
  const list = tab === 'erros' ? errorQuestions : favoriteQuestions

  const practice = () => {
    if (!list.length) return
    navigate('/praticar', {
      state: {
        questionIds: list.map((question) => question.id),
        title: tab === 'erros' ? 'Caderno de erros' : 'Questões favoritas',
        subtitle: 'Rodada montada a partir do seu caderno',
        mode: 'caderno',
      },
    })
  }

  const disciplineCounts = disciplines
    .map((discipline) => ({
      ...discipline,
      count: list.filter((question) => question.disciplineId === discipline.id).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <div className="page-stack">
      <PageHeader
        title="Cadernos"
        subtitle="O caderno de erros se monta sozinho: toda questão que você errou por último fica aqui até acertar de novo. As favoritas são suas para revisar quando quiser."
        actions={
          <button type="button" className="btn btn-primary" onClick={practice} disabled={!list.length}>
            <RotateCcw size={16} />
            Revisar {list.length} {list.length === 1 ? 'questão' : 'questões'}
          </button>
        }
      />

      <div className="notebook-summary">
        <Card className="notebook-stat">
          <span className="notebook-stat-icon red">
            <NotebookPen size={19} />
          </span>
          <div>
            <strong>{errorQuestions.length}</strong>
            <span>questões para corrigir</span>
          </div>
          <p>Elas voltam até você acertar.</p>
        </Card>
        <Card className="notebook-stat">
          <span className="notebook-stat-icon yellow">
            <Bookmark size={19} />
          </span>
          <div>
            <strong>{favoriteQuestions.length}</strong>
            <span>questões favoritas</span>
          </div>
          <p>Salvas por você durante os estudos.</p>
        </Card>
        <Card className="notebook-stat notebook-stat-wide">
          <span className="notebook-stat-icon green">
            <Sparkles size={19} />
          </span>
          <div>
            <strong>
              {errorQuestions.length ? `${Math.max(5, errorQuestions.length * 2)} min` : '0 min'}
            </strong>
            <span>para limpar o caderno hoje</span>
          </div>
          <p>Uma rodada curta resolve boa parte.</p>
        </Card>
      </div>

      <div className="notebook-tabs" role="tablist" aria-label="Cadernos">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'erros'}
          className={tab === 'erros' ? 'active' : ''}
          onClick={() => setTab('erros')}
        >
          <NotebookPen size={16} />
          Caderno de erros
          <em>{errorQuestions.length}</em>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'favoritas'}
          className={tab === 'favoritas' ? 'active' : ''}
          onClick={() => setTab('favoritas')}
        >
          <Bookmark size={16} />
          Favoritas
          <em>{favoriteQuestions.length}</em>
        </button>
      </div>

      {disciplineCounts.length > 0 && (
        <div className="notebook-breakdown">
          <span className="notebook-breakdown-label">onde estão:</span>
          <div className="notebook-breakdown-list">
            {disciplineCounts.slice(0, 6).map((item) => (
              <Chip key={item.id} tone="neutral">
                <i className="dot" style={{ background: item.color }} />
                {item.name} · {item.count}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {list.length ? (
        <div className="question-feed-list">
          {list.map((question) => (
            <QuestionRow question={question} key={question.id} />
          ))}
        </div>
      ) : (
        <Card className="notebook-empty">
          <EmptyState
            icon={tab === 'erros' ? NotebookPen : BookmarkX}
            title={tab === 'erros' ? 'Nenhum erro pendente' : 'Nenhuma questão favorita ainda'}
            text={
              tab === 'erros'
                ? 'Quando você errar uma questão, ela aparece aqui automaticamente. Continue praticando.'
                : 'Use o marcador nas questões para montar seu próprio caderno de revisão.'
            }
            action={
              tab === 'erros' ? (
                <button type="button" className="btn btn-primary" onClick={() => navigate('/questoes')}>
                  <ListChecks size={16} />
                  Praticar questões
                </button>
              ) : (
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/questoes')}>
                  Explorar banco
                </button>
              )
            }
          />
        </Card>
      )}

      {list.length > 0 && (
        <Card className="notebook-strategy">
          <div>
            <Chip tone="green">estratégia</Chip>
            <h3>Errar é dado, não sentença.</h3>
            <p>
              Revise o caderno de erros antes de começar uma rodada nova. Reacertar o que estava errado vale mais do
              que acumular questões inéditas.
            </p>
          </div>
          <div className="notebook-progress">
            <div className="notebook-progress-head">
              <span>Questões corrigidas</span>
              <strong>
                {stats.uniqueQuestions - errorQuestions.length}/{stats.uniqueQuestions}
              </strong>
            </div>
            <ProgressBar
              value={stats.uniqueQuestions ? ((stats.uniqueQuestions - errorQuestions.length) / stats.uniqueQuestions) * 100 : 0}
              color="#2c7a5e"
            />
          </div>
        </Card>
      )}
    </div>
  )
}
