import { Link } from 'react-router-dom'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/painel" className={`brand ${compact ? 'brand-compact' : ''}`} aria-label="Ponto de Corte — início">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-mark-cut" />
        pc
      </span>
      <span className="brand-words">
        <span className="brand-word">ponto de</span>
        <span className="brand-word brand-accent">corte</span>
      </span>
    </Link>
  )
}
