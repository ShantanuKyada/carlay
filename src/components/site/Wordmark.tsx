import { Link } from 'react-router-dom'

/** Text-based placeholder wordmark — replace with Carlay's official vector logo. */
export function Wordmark({ light = false, to = '/', className = '' }: { light?: boolean; to?: string; className?: string }) {
  return (
    <Link to={to} aria-label="Carlay home" className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`font-mark text-[15px] tracking-[0.32em] sm:text-base ${light ? 'text-paper' : 'text-ink-900'}`}>CARLAY</span>
      <span className={`hidden text-[10px] font-medium tracking-[0.2em] uppercase sm:inline ${light ? 'text-steel-400' : 'text-steel-500'}`}>Pune</span>
    </Link>
  )
}
