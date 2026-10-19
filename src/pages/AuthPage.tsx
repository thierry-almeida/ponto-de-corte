import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, Moon, ShieldCheck, Sparkles, Sun } from 'lucide-react'
import { useApp } from '../store'
import { areas, targets } from '../data/disciplines'
import { Brand } from '../components/Brand'

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const isSignup = mode === 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    area: areas[0],
    target: targets[0],
    password: '',
    confirm: '',
    terms: false,
  })

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setError('Confira o e-mail. Ele precisa ter o formato nome@dominio.com.')
      return
    }
    if (form.password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (isSignup) {
      if (!form.name.trim()) {
        setError('Diga como você quer ser chamado.')
        return
      }
      if (form.password !== form.confirm) {
        setError('As duas senhas não conferem.')
        return
      }
      if (!form.terms) {
        setError('Aceite os termos para criar sua conta de teste.')
        return
      }
    }
    setLoading(true)
    window.setTimeout(() => {
      if (isSignup) {
        actions.signup({
          name: form.name.trim(),
          email: form.email,
          area: form.area,
          target: form.target,
        })
        actions.notify(`Bem-vindo, ${form.name.split(' ')[0]}. Seus 7 dias começam agora.`)
      } else {
        actions.login(form.email)
        actions.notify('Bom te ver de novo. Vamos estudar.')
      }
      navigate('/painel')
    }, 450)
  }

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-panel-top">
          <Brand />
          <span className="auth-panel-tag">concursos públicos</span>
        </div>

        <div className="auth-panel-copy">
          <span className="auth-kicker">estudo com direção</span>
          <h1>
            Aprovação não é sorte. É <span className="auth-highlight">sequência</span>.
          </h1>
          <p>
            Questões comentadas, resumos que cabem na semana e um plano que aprende com os seus erros. Menos ansiedade,
            mais direção.
          </p>
          <div className="auth-benefits">
            <span>
              <Check size={15} strokeWidth={3} /> Questões com comentário do gabarito
            </span>
            <span>
              <Check size={15} strokeWidth={3} /> Plano semanal ajustado ao seu desempenho
            </span>
            <span>
              <Check size={15} strokeWidth={3} /> Flashcards com revisão espaçada
            </span>
          </div>
        </div>

        <div className="auth-stage" aria-hidden="true">
          <div className="auth-sheet auth-sheet-back" />
          <div className="auth-sheet auth-sheet-middle" />
          <div className="auth-sheet auth-sheet-front">
            <div className="auth-sheet-meta">
              <span>questão 07</span>
              <span>direito administrativo</span>
            </div>
            <p>O princípio que veda a promoção pessoal de agentes públicos é o da:</p>
            <div className="auth-sheet-options">
              <span>A) legalidade</span>
              <span className="selected">B) impessoalidade</span>
              <span>C) publicidade</span>
            </div>
            <div className="auth-sheet-answer">
              <Check size={13} /> resposta certa
            </div>
          </div>
          <div className="auth-stamp">
            <strong>7</strong>
            <span>dias grátis</span>
          </div>
        </div>

        <div className="auth-panel-foot">
          <p>“A aprovação é a soma de pequenas decisões repetidas.”</p>
          <Link to="/materiais" className="auth-ghost-link">
            conhecer a plataforma
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-top">
          <Link to="/entrar" className="back-link">
            <ArrowLeft size={15} />
            início
          </Link>
          <span className="auth-form-brand">
            <Brand compact />
          </span>
          <button
            type="button"
            className="icon-button bordered"
            onClick={actions.toggleTheme}
            aria-label="Alternar tema"
          >
            {state.theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>

        <div className="auth-form-card">
          <div className="auth-form-heading">
            <span className="eyebrow">{isSignup ? 'teste grátis · 7 dias' : 'que bom te ver'}</span>
            <h2>{isSignup ? 'Crie sua conta e comece agora' : 'Entre para continuar de onde parou'}</h2>
            <p>
              {isSignup
                ? 'Sem cartão. Questões comentadas ilimitadas e uma aula nova de resumo por dia durante o teste.'
                : 'Seu progresso, plano e caderno de erros estão exatamente como você deixou.'}
            </p>
          </div>

          <form onSubmit={submit} noValidate>
            {isSignup && (
              <label className="auth-field">
                <span>Nome</span>
                <input
                  className="input"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  placeholder="Como quer ser chamado"
                  autoComplete="name"
                />
              </label>
            )}

            <label className="auth-field">
              <span>E-mail</span>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="email"
              />
            </label>

            {isSignup && (
              <>
                <label className="auth-field">
                  <span>WhatsApp <em>opcional</em></span>
                  <input
                    className="input"
                    value={form.whatsapp}
                    onChange={(event) => update('whatsapp', event.target.value)}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                  />
                </label>
                <label className="auth-field">
                  <span>Área do seu concurso</span>
                  <select className="input select" value={form.area} onChange={(event) => update('area', event.target.value)}>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="auth-field">
                  <span>Concurso alvo</span>
                  <select className="input select" value={form.target} onChange={(event) => update('target', event.target.value)}>
                    {targets.map((target) => (
                      <option key={target} value={target}>
                        {target}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <label className="auth-field">
              <span>Senha</span>
              <div className="password-field">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  placeholder={isSignup ? 'mínimo de 8 caracteres' : 'sua senha'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {isSignup && <em>Mínimo de 8 caracteres. Use algo que você lembre.</em>}
            </label>

            {isSignup && (
              <>
                <label className="auth-field">
                  <span>Confirmar senha</span>
                  <input
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={(event) => update('confirm', event.target.value)}
                    placeholder="repita a senha"
                    autoComplete="new-password"
                  />
                </label>
                <label className="auth-check">
                  <input type="checkbox" checked={form.terms} onChange={(event) => update('terms', event.target.checked)} />
                  <span className="auth-check-box">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>
                    Li e aceito os <a href="#termos">Termos de Uso</a> e a{' '}
                    <a href="#privacidade">Política de Privacidade</a>, inclusive a regra de acesso válido enquanto a
                    plataforma estiver em operação.
                  </span>
                </label>
              </>
            )}

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={loading}>
              {loading ? <Loader2 size={17} className="spin" /> : null}
              {isSignup ? 'Começar meus 7 dias grátis' : 'Entrar na minha conta'}
              {!loading && <ArrowRight size={16} />}
            </button>

            {!isSignup && (
              <p className="auth-helper">
                <Sparkles size={14} />
                Demonstração: use qualquer e-mail e uma senha com 8 caracteres ou mais.
              </p>
            )}

            <p className="auth-switch">
              {isSignup ? (
                <>
                  Já tem conta ou comprou um plano? <Link to="/entrar">Entrar</Link>
                </>
              ) : (
                <>
                  Ainda não tem conta? <Link to="/cadastro">Começar teste de 7 dias</Link>
                </>
              )}
            </p>
          </form>

          <div className="auth-security">
            <ShieldCheck size={15} />
            Seus dados ficam salvos apenas neste navegador neste protótipo.
          </div>
        </div>

        <footer className="auth-footer">
          <span>Ponto de Corte · estudo com direção</span>
          <span>© {new Date().getFullYear()} · Termos e privacidade</span>
        </footer>
      </section>
    </div>
  )
}
