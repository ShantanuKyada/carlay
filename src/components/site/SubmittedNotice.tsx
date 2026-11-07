import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, LayoutDashboard } from 'lucide-react'

/** Confirmation panel shown after any simulated public submission. */
export function SubmittedNotice({
  title,
  reference,
  children,
  dashboardLink,
  actions,
}: {
  title: string
  reference: string
  children?: ReactNode
  dashboardLink?: string
  actions?: ReactNode
}) {
  return (
    <div className="animate-fade-up">
      <div className="flex size-12 items-center justify-center rounded-full bg-ink-900 text-paper">
        <Check className="size-5" strokeWidth={2} />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-4 inline-flex items-center gap-3 rounded-[4px] border border-line bg-white px-4 py-2.5">
        <span className="eyebrow text-steel-500">Reference</span>
        <span className="font-mono text-sm font-semibold tracking-wide">{reference}</span>
      </div>
      {children && <div className="mt-4 space-y-2 text-[15px] leading-relaxed text-steel-600">{children}</div>}
      <p className="mt-5 rounded-[4px] bg-paper-2 px-4 py-3 text-[13px] leading-relaxed text-steel-600">
        <strong className="font-semibold text-ink-800">Demo mode:</strong> this is a simulated request stored only in this browser. Nothing has been sent to Carlay
        and no appointment or offer has been confirmed.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {actions}
        {dashboardLink && (
          <Link to={dashboardLink} className="inline-flex h-11 items-center gap-2 rounded-[4px] px-1 text-sm font-medium text-ink-900 underline-offset-4 hover:underline">
            <LayoutDashboard className="size-4" strokeWidth={1.75} />
            See it in the team dashboard
          </Link>
        )}
      </div>
    </div>
  )
}
