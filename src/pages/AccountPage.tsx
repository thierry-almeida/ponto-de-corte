import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CreditCard,
  Flame,
  KeyRound,
  LogOut,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  Target,
  UserRound,
} from 'lucide-react'
import { useApp } from '../store'
import { areas, targets } from '../data/disciplines'
import { dateKey, addDays, longDate, trialDaysLeft } from '../lib/utils'
import { Card, Chip, PageHeader, ProgressBar, SectionTitle } from '../components/ui'

export default function AccountPage() {
  const { state, stats, actions } = useApp()
  const navigate = useNavigate()
  const [draft, setDraft] = useState(state.profile)
  const daysLeft = trialDaysLeft(state.profile.joinedAt)
  const trialEnd = dateKey(addDays(new Date(`${state.profile.joinedAt}T12:00:00`), 7))
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [resetOpen, setResetOpen] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const saveProfile = () => {
    actions.saveProfile(draft)
    if (draft.target !== state.plan.target) actions.updatePlan({ target: draft.target })
    actions.notify('Preferências salvas.')
  }

  const changePassword = () => {
    setPasswordError('')
    if (passwords.next.length < 8) {
      setPasswordError('A nova senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError('A confirmação não confere com a nova senha.')
      return
    }
    setPasswords({ current: '', next: '', confirm: '' })
    actions.notify('Senha alterada. Use a nova senha no próximo acesso.')
  }

  const logout = () => {
    actions.logout()
    navigate('/entrar')
  }

  return (
    <div className="page-stack account-page">
      <PageHeader
        title="Minha conta"
        subtitle="Preferências do seu estudo, assinatura e segurança. Tudo fica salvo neste navegador."
        actions={
          <Chip tone={daysLeft > 0 ? 'yellow' : 'red'} icon={Flame}>
            {daysLeft > 0 ? `${daysLeft} dias de teste` : 'teste encerrado'}
          </Chip>
        }
      />

      <div className="account-layout">
        <div className="account-main">
          <Card className="account-section" id="assinatura">
            <SectionTitle title="Assinatura" hint="Seu acesso e o que está incluído." />
            <div className="subscription-row">
              <div>
                <span className="subscription-email">{state.profile.email}</span>
                <div className="subscription-status">
                  <Chip tone="green" icon={Check}>
                    {daysLeft > 0 ? 'teste grátis' : 'acesso encerrado'}
                  </Chip>
                  <span>acesso até {longDate(trialEnd)}</span>
                </div>
              </div>
              <div className="subscription-action">
                <span>
                  <strong>R$ 97</strong>/ano
                </span>
                <button
                  type="button"
                  className="btn btn-yellow btn-sm"
                  onClick={() => actions.notify('Checkout demonstrativo. Nenhuma cobrança foi feita.')}
                >
                  Assinar plano anual
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className="subscription-benefits">
              <span><Check size={14} /> Todos os resumos liberados</span>
              <span><Check size={14} /> Flashcards sem limite</span>
              <span><Check size={14} /> Plano de estudos completo</span>
              <span><Check size={14} /> Simulados ilimitados</span>
            </div>
            <div className="subscription-progress">
              <div>
                <span>Tempo de teste</span>
                <strong>{Math.min(7, 7 - daysLeft)} de 7 dias usados</strong>
              </div>
              <ProgressBar value={((7 - daysLeft) / 7) * 100} color="#f3d34a" />
            </div>
          </Card>

          <Card className="account-section">
            <SectionTitle title="Preferências" hint="Ajuste o que o painel e o plano usam como base." />
            <div className="form-grid">
              <label className="form-field">
                <span>Nome</span>
                <input
                  className="input"
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Como quer ser chamado"
                />
              </label>
              <label className="form-field">
                <span>E-mail</span>
                <input
                  className="input"
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                  placeholder="voce@exemplo.com"
                />
              </label>
              <label className="form-field form-field-full">
                <span>Área de membros</span>
                <select
                  className="input select"
                  value={draft.area}
                  onChange={(event) => setDraft((current) => ({ ...current, area: event.target.value }))}
                >
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <em>Ao trocar de área, conteúdos e recomendações passam a seguir essa escolha.</em>
              </label>
              <label className="form-field">
                <span>Concurso alvo</span>
                <select
                  className="input select"
                  value={draft.target}
                  onChange={(event) => setDraft((current) => ({ ...current, target: event.target.value }))}
                >
                  {targets.map((target) => (
                    <option key={target} value={target}>
                      {target}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Meta diária de questões</span>
                <input
                  className="input"
                  type="number"
                  min={5}
                  max={100}
                  value={draft.dailyGoal}
                  onChange={(event) => setDraft((current) => ({ ...current, dailyGoal: Number(event.target.value) }))}
                />
                <em>Sua média atual é de {Math.round((stats.totalAttempts / 30) * 10) / 10} questões por dia.</em>
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={saveProfile} disabled={!draft.name.trim()}>
                Salvar preferências
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setDraft(state.profile)}>
                Descartar
              </button>
            </div>
          </Card>

          <Card className="account-section">
            <SectionTitle title="Senha" hint="Troque com calma. Não pedimos sua senha por e-mail." />
            <div className="form-grid">
              <label className="form-field form-field-full">
                <span>Senha atual</span>
                <input
                  className="input"
                  type="password"
                  value={passwords.current}
                  onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))}
                  placeholder="••••••••"
                />
              </label>
              <label className="form-field">
                <span>Nova senha</span>
                <input
                  className="input"
                  type="password"
                  value={passwords.next}
                  onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))}
                  placeholder="mínimo de 8 caracteres"
                />
              </label>
              <label className="form-field">
                <span>Confirmar nova senha</span>
                <input
                  className="input"
                  type="password"
                  value={passwords.confirm}
                  onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))}
                  placeholder="repita a nova senha"
                />
              </label>
            </div>
            {passwordError && (
              <p className="form-error" role="alert">
                <AlertTriangle size={14} />
                {passwordError}
              </p>
            )}
            <div className="form-actions">
              <button type="button" className="btn btn-dark" onClick={changePassword}>
                <KeyRound size={15} />
                Alterar senha
              </button>
            </div>
          </Card>

          <Card className="account-section">
            <SectionTitle title="Aparência" hint="O modo escuro vale para todo o app." />
            <div className="theme-choice">
              <button
                type="button"
                className={state.theme === 'light' ? 'active' : ''}
                onClick={() => actions.setTheme('light')}
              >
                <span className="theme-preview theme-preview-light">
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <Sun size={16} />
                  Papel
                </span>
              </button>
              <button
                type="button"
                className={state.theme === 'dark' ? 'active' : ''}
                onClick={() => actions.setTheme('dark')}
              >
                <span className="theme-preview theme-preview-dark">
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  <Moon size={16} />
                  Tinta
                </span>
              </button>
            </div>
          </Card>

          <Card className="account-section danger-section">
            <SectionTitle title="Zona de cuidado" hint="Ações irreversíveis neste navegador." />
            <div className="danger-row">
              <div>
                <h3>Apagar meu progresso</h3>
                <p>Remove respostas, flashcards, leituras e o plano. Seu perfil e assinatura continuam.</p>
              </div>
              <button type="button" className="btn btn-danger-ghost" onClick={() => setResetOpen(true)}>
                Apagar progresso
              </button>
            </div>
            <div className="danger-row">
              <div>
                <h3>Sair da conta</h3>
                <p>Seu progresso fica salvo. Você pode entrar de novo quando quiser.</p>
              </div>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                <LogOut size={15} />
                Sair
              </button>
            </div>
          </Card>
        </div>

        <aside className="account-side">
          <Card className="account-profile-card">
            <span className="avatar account-avatar">
              {state.profile.name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </span>
            <h2>{state.profile.name}</h2>
            <p>{state.profile.email}</p>
            <Chip tone="green" icon={Check}>
              membro desde {new Date(`${state.profile.joinedAt}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
            </Chip>
            <div className="account-facts">
              <div>
                <Target size={16} />
                <span>
                  <em>concurso alvo</em>
                  <strong>{state.profile.target}</strong>
                </span>
              </div>
              <div>
                <UserRound size={16} />
                <span>
                  <em>área</em>
                  <strong>{state.profile.area.split(' — ')[0]}</strong>
                </span>
              </div>
              <div>
                <Flame size={16} />
                <span>
                  <em>sequência</em>
                  <strong>{stats.streak} dias estudando</strong>
                </span>
              </div>
            </div>
          </Card>

          <Card className="account-help">
            <ShieldCheck size={20} />
            <h3>Seus dados</h3>
            <p>
              Este protótipo salva tudo no armazenamento local do navegador. Nenhuma informação é enviada para
              servidores.
            </p>
            <button type="button" className="text-link" onClick={() => actions.notify('Você pode limpar os dados nas configurações do navegador.')}>
              como funciona
            </button>
          </Card>

          <Card className="account-side-plan">
            <CreditCard size={20} />
            <h3>Plano anual</h3>
            <p>97 reais por ano. Sem renovação automática, com acesso enquanto a plataforma existir.</p>
            <button
              type="button"
              className="btn btn-yellow btn-block"
              onClick={() => actions.notify('Checkout demonstrativo. Nenhuma cobrança foi feita.')}
            >
              Quero assinar
              <ArrowRight size={15} />
            </button>
          </Card>
        </aside>
      </div>

      {resetOpen && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="dialog">
            <span className="dialog-warning">
              <AlertTriangle size={20} />
            </span>
            <h2 id="reset-title">Apagar todo o progresso?</h2>
            <p>
              Respostas, erros, favoritas, leituras, flashcards e blocos do plano serão removidos. Essa ação não pode
              ser desfeita.
            </p>
            <div className="dialog-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setResetOpen(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  actions.resetProgress()
                  setResetOpen(false)
                  actions.notify('Progresso apagado. Começando de novo.')
                }}
              >
                Sim, apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
