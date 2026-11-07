import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function EmptyState({ icon: Icon, title, body, action }: { icon: LucideIcon; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line px-6 py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-paper-2 text-steel-500">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      {body && <p className="mt-1 max-w-sm text-sm text-steel-500">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
