import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  NotebookPen,
  Settings,
  Sun,
  Timer,
  X,
} from 'lucide-react'
import { Brand } from './Brand'
import { useApp } from '../store'
import { trialDaysLeft } from '../lib/utils'

const studyNav = [
  { to: '/painel', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/questoes', label: 'Questões', icon: ListChecks },
  { to: '/simulados', label: 'Simulados', icon: Timer },
  { to: '/flashcards', label: 'Flashcards', icon: Layers3 },
]

const organizeNav = [
  { to: '/cadernos', label: 'Cadernos', icon: NotebookPen },
  { to: '/plano', label: 'Plano de estudos', icon: CalendarRange },
  { to: '/materiais', label: 'Materiais', icon: BookOpen },
  { to: '/cursos', label: 'Cursos completos', icon: GraduationCap, badge: 'novo' },
]

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  badge,
  onClick,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  badge?: string
  onClick?: () => void
}) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
      <Icon size={18} strokeWidth={1.9} />
      <span>{label}</span>
      {badge && <em className="nav-badge">{badge}</em>}
    </NavLink>
  )
}

function TrialBar() {
  const { state } = useApp()
  const days = trialDaysLeft(state.profile.joinedAt)
  return (
    <div className="trial-bar">
      <div className="trial-inner">
        <span className="trial-pulse" aria-hidden="true" />
        <p>
          {days > 0 ? (
            <>
              <strong>Teste grátis</strong> · {days} {days === 1 ? 'dia restante' : 'dias restantes'}
            </>
          ) : (
            <>
              Seu teste terminou. <strong>Continue estudando com o plano anual.</strong>
            </>
          )}
          <span className="trial-sep">·</span>
          <span className="trial-offer">R$ 97/ano, sem renovação automática.</span>
        </p>
        <Link to="/conta#assinatura" className="trial-link">
          Ver meu plano
          <ArrowUpRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const firstName = state.profile.name.split(' ')[0]
  const initials = state.profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const logout = () => {
    actions.logout()
    navigate('/entrar')
  }

  return (
    <div className="sidebar-inner">
      <div className="sidebar-brand">
        <Brand />
        <span className="brand-sub">concursos públicos</span>
      </div>

      <nav className="sidebar-nav" aria-label="Navegação principal">
        <div className="nav-group">
          <span className="nav-group-label">estudar</span>
          {studyNav.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavigate} />
          ))}
        </div>
        <div className="nav-group">
          <span className="nav-group-label">organizar</span>
          {organizeNav.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-note">
          <span className="sidebar-note-mark">“</span>
          <p>Quem revisa o erro chega mais perto do corte.</p>
        </div>
        <div className="sidebar-user">
          <span className="avatar">{initials}</span>
          <div className="sidebar-user-copy">
            <strong>{state.profile.name}</strong>
            <span>Teste grátis · {firstName}</span>
          </div>
        </div>
        <div className="sidebar-actions">
          <Link to="/conta" className="sidebar-action" onClick={onNavigate}>
            <Settings size={15} />
            Conta
          </Link>
          <button type="button" className="sidebar-action" onClick={logout}>
            <LogOut size={15} />
            Sair
          </button>
          <button
            type="button"
            className="theme-button"
            onClick={actions.toggleTheme}
            aria-label={state.theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            title={state.theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {state.theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </div>
    </div>
  )
}

function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div className="toast" role="status">
      <span className="toast-icon">
        <CheckCircle2 size={18} strokeWidth={2.2} />
      </span>
      {toast}
    </div>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-mobile-head">
          <Brand compact />
          <button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>
        <Sidebar onNavigate={() => setMenuOpen(false)} />
      </aside>

      {menuOpen && <button type="button" className="sidebar-overlay" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />}

      <div className="app-main">
        <TrialBar />
        <header className="mobile-bar">
          <button type="button" className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <Brand compact />
          <Link to="/questoes" className="mobile-practice">
            Praticar
            <ArrowRight size={15} />
          </Link>
        </header>
        <main className="page">
          <Outlet />
        </main>
        <footer className="site-footer">
          <span>Ponto de Corte · estudo com direção</span>
          <span>Protótipo demonstrativo. Seu progresso fica salvo neste navegador.</span>
        </footer>
      </div>
      <Toast />
    </div>
  )
}
