import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Filter, ListChecks, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { questions } from '../data/questions'
import { disciplines, disciplineById } from '../data/disciplines'
import { useApp } from '../store'
import { Card, Chip, EmptyState, PageHeader } from '../components/ui'
import QuestionRow from '../components/QuestionRow'

const PAGE_SIZE = 6

export default function QuestionsPage() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [disciplineId, setDisciplineId] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [board, setBoard] = useState('all')
  const [onlyUnsolved, setOnlyUnsolved] = useState(false)
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)

  const boards = useMemo(() => Array.from(new Set(questions.map((question) => question.board))).sort(), [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const list = questions.filter((question) => {
      if (disciplineId !== 'all' && question.disciplineId !== disciplineId) return false
      if (difficulty !== 'all' && question.difficulty !== difficulty) return false
      if (board !== 'all' && question.board !== board) return false
      if (onlyUnsolved && state.solved[question.id]) return false
      if (term) {
        const haystack = `${question.statement} ${question.topic} ${question.tags.join(' ')}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
    if (sort === 'recent') return [...list].sort((a, b) => b.year - a.year)
    if (sort === 'difficulty') {
      const weight = { Fácil: 1, Média: 2, Difícil: 3 }
      return [...list].sort((a, b) => weight[b.difficulty] - weight[a.difficulty])
    }
    if (sort === 'discipline') {
      return [...list].sort((a, b) => disciplineById(a.disciplineId).name.localeCompare(disciplineById(b.disciplineId).name))
    }
    return list
  }, [search, disciplineId, difficulty, board, onlyUnsolved, sort, state.solved])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const answered = filtered.filter((question) => state.solved[question.id]).length

  const reset = () => {
    setSearch('')
    setDisciplineId('all')
    setDifficulty('all')
    setBoard('all')
    setOnlyUnsolved(false)
    setSort('recent')
    setPage(1)
  }

  const practice = () => {
    if (!filtered.length) return
    const selectedDiscipline = disciplineId !== 'all' ? disciplineById(disciplineId).name : 'Todas as disciplinas'
    navigate('/praticar', {
      state: {
        questionIds: filtered.map((question) => question.id),
        title: selectedDiscipline,
        subtitle: 'Rodada montada a partir dos seus filtros',
        mode: 'avulso',
      },
    })
  }

  const setFilter = (setter: (value: string) => void, value: string) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Questões"
        subtitle="Escolha por disciplina, banca ou dificuldade. Toda questão tem comentário e mostra o que a alternativa errada tentou fazer."
        actions={
          <button type="button" className="btn btn-primary" onClick={practice} disabled={!filtered.length}>
            <ListChecks size={17} />
            Praticar {filtered.length} {filtered.length === 1 ? 'questão' : 'questões'}
          </button>
        }
      />

      <div className="questions-layout">
        <aside className="filter-panel">
          <Card className="filter-card">
            <div className="filter-head">
              <span>
                <SlidersHorizontal size={16} />
                Filtros
              </span>
              <button type="button" className="text-button" onClick={reset}>
                <RotateCcw size={13} />
                limpar
              </button>
            </div>

            <label className="field-label" htmlFor="question-search">
              Buscar
            </label>
            <div className="input-with-icon">
              <Search size={16} />
              <input
                id="question-search"
                className="input"
                placeholder="Palavra, tema ou código"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </div>

            <label className="field-label" htmlFor="question-discipline">
              Disciplina
            </label>
            <div className="discipline-filter">
              <button
                type="button"
                className={disciplineId === 'all' ? 'active' : ''}
                onClick={() => setFilter(setDisciplineId, 'all')}
              >
                <span className="discipline-filter-dot all" />
                Todas
                <em>{questions.length}</em>
              </button>
              {disciplines.map((discipline) => {
                const count = questions.filter((question) => question.disciplineId === discipline.id).length
                return (
                  <button
                    type="button"
                    key={discipline.id}
                    className={disciplineId === discipline.id ? 'active' : ''}
                    onClick={() => setFilter(setDisciplineId, discipline.id)}
                  >
                    <span className="discipline-filter-dot" style={{ background: discipline.color }} />
                    {discipline.name}
                    <em>{count}</em>
                  </button>
                )
              })}
            </div>

            <label className="field-label" htmlFor="question-difficulty">
              Dificuldade
            </label>
            <select
              id="question-difficulty"
              className="input select"
              value={difficulty}
              onChange={(event) => setFilter(setDifficulty, event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="Fácil">Fácil</option>
              <option value="Média">Média</option>
              <option value="Difícil">Difícil</option>
            </select>

            <label className="field-label" htmlFor="question-board">
              Banca
            </label>
            <select
              id="question-board"
              className="input select"
              value={board}
              onChange={(event) => setFilter(setBoard, event.target.value)}
            >
              <option value="all">Todas as bancas</option>
              {boards.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label className="toggle-line">
              <input
                type="checkbox"
                checked={onlyUnsolved}
                onChange={(event) => {
                  setOnlyUnsolved(event.target.checked)
                  setPage(1)
                }}
              />
              <span className="toggle-box" />
              Só questões que ainda não respondi
            </label>
          </Card>

          <div className="filter-note">
            <Filter size={15} />
            <p>
              Base demonstrativa com {questions.length} questões autorais, escritas no estilo das principais bancas.
            </p>
          </div>
        </aside>

        <section className="question-feed">
          <div className="feed-head">
            <div>
              <strong>
                {filtered.length} {filtered.length === 1 ? 'questão' : 'questões'} no filtro
              </strong>
              <span>
                {answered} já respondidas · {filtered.length - answered} inéditas
              </span>
            </div>
            <label className="inline-select">
              Ordenar
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="recent">Mais recentes</option>
                <option value="difficulty">Mais difíceis</option>
                <option value="discipline">Por disciplina</option>
              </select>
            </label>
          </div>

          {visible.length ? (
            <div className="question-feed-list">
              {visible.map((question) => (
                <QuestionRow question={question} key={question.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Nenhuma questão com esses filtros"
              text="Tente outra palavra ou remova um dos filtros para ver a base inteira."
              action={
                <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                  Limpar filtros
                </button>
              }
            />
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="icon-button bordered"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft size={17} />
              </button>
              <span>
                página <strong>{safePage}</strong> de {totalPages}
              </span>
              <button
                type="button"
                className="icon-button bordered"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePage === totalPages}
                aria-label="Próxima página"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}

          <div className="feed-cta">
            <div>
              <Chip tone="yellow">rodada inteligente</Chip>
              <h3>Praticar o filtro inteiro</h3>
              <p>Responda em sequência, com correção imediata e tempo por questão.</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={practice} disabled={!filtered.length}>
              Começar rodada
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
