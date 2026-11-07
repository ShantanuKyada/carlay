import type { Availability } from '../../types'

const availStyles: Record<Availability, string> = {
  available: 'bg-ok-bg text-ok',
  reserved: 'bg-warn-bg text-warn',
  sold: 'bg-ink-900 text-paper',
}
const availText: Record<Availability, string> = { available: 'Available', reserved: 'Reserved', sold: 'Sold' }

export function AvailabilityBadge({ status, className = '' }: { status: Availability; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[3px] px-2 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase ${availStyles[status]} ${className}`}>
      {status === 'available' && <span className="size-1.5 rounded-full bg-ok" />}
      {availText[status]}
    </span>
  )
}

const tone: Record<string, string> = {
  // enquiries
  New: 'bg-info-bg text-info',
  Contacted: 'bg-paper-3 text-ink-800',
  Interested: 'bg-[#ece7f3] text-[#5b4a7a]',
  'Test Drive Scheduled': 'bg-warn-bg text-warn',
  Negotiation: 'bg-[#f3e6dc] text-[#8a4b22]',
  Converted: 'bg-ok-bg text-ok',
  Lost: 'bg-bad-bg text-bad',
  // test drives
  Pending: 'bg-warn-bg text-warn',
  Approved: 'bg-info-bg text-info',
  Completed: 'bg-ok-bg text-ok',
  Cancelled: 'bg-paper-3 text-steel-600',
  // sell / sourcing
  'Under Review': 'bg-warn-bg text-warn',
  Closed: 'bg-paper-3 text-steel-600',
  Searching: 'bg-warn-bg text-warn',
  'Match Shared': 'bg-ok-bg text-ok',
}

export function StatusPill({ status, className = '' }: { status: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tone[status] ?? 'bg-paper-3 text-ink-800'} ${className}`}>
      {status}
    </span>
  )
}

export function SampleChip({ dark = false }: { dark?: boolean }) {
  return (
    <span
      title="Sample listing for demonstration — not live inventory"
      className={`inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase ${
        dark ? 'bg-white/10 text-steel-200' : 'bg-paper-3 text-steel-600'
      }`}
    >
      Sample
    </span>
  )
}
