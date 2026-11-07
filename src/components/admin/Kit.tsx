import { useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, Search } from 'lucide-react'
import type { Note } from '../../types'
import { formatDateTime } from '../../lib/format'
import { Button } from '../ui/Button'

/** ?open=<id> deep-link support for drawers. */
export function useOpenParam() {
  const [params, setParams] = useSearchParams()
  const openId = params.get('open')
  const setOpen = (id: string | null) => {
    const p = new URLSearchParams(params)
    if (id) p.set('open', id)
    else p.delete('open')
    setParams(p, { replace: true })
  }
  return [openId, setOpen] as const
}

export function Panel({ title, action, children, className = '', pad = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={`rounded-md bg-white ring-1 ring-line/80 ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className={pad ? 'p-5' : ''}>{children}</div>
    </section>
  )
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex h-9 w-full items-center gap-2 rounded-[4px] border border-line bg-white px-3 focus-within:border-ink-900 sm:w-64">
      <Search className="size-4 text-steel-400" strokeWidth={1.5} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="w-full bg-transparent text-sm focus:outline-none" />
    </label>
  )
}

export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 appearance-none rounded-[4px] border bg-white pr-8 pl-3 text-[13px] focus:border-ink-900 focus:outline-none ${value ? 'border-ink-900 font-medium' : 'border-line text-steel-600'}`}
      >
        <option value="">{label}: All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-steel-500" />
    </div>
  )
}

export function InlineSelect({ value, onChange, options, label, className = '' }: { value: string; onChange: (v: string) => void; options: readonly string[]; label: string; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`} onClick={(e) => e.stopPropagation()}>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-full appearance-none rounded-[4px] border border-line bg-white pr-7 pl-2.5 text-[13px] hover:border-steel-400 focus:border-ink-900 focus:outline-none">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-steel-500" />
    </div>
  )
}

export const th = 'px-4 py-3 text-left text-[11px] font-semibold tracking-[0.08em] text-steel-500 uppercase whitespace-nowrap'
export const td = 'px-4 py-3 align-middle'

export function Table({ head, children, minWidth = 860 }: { head: ReactNode; children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-hidden rounded-md bg-white ring-1 ring-line/80">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead className="border-b border-line bg-paper/60">{head}</thead>
          <tbody className="divide-y divide-line/70">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function DetailGrid({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-xs text-steel-500">{k}</dt>
          <dd className="mt-0.5 font-medium break-words">{v || '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

export function NotesPanel({ notes, onAdd }: { notes: Note[]; onAdd: (text: string) => void }) {
  const [text, setText] = useState('')
  return (
    <div>
      <p className="eyebrow mb-3 text-steel-500">Internal notes</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          onAdd(text.trim())
          setText('')
        }}
        className="flex flex-col gap-2"
      >
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Add a note for the team…" className="w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-sm focus:border-ink-900 focus:outline-none" />
        <Button type="submit" size="sm" variant="secondary" className="self-end" disabled={!text.trim()}>
          Add note
        </Button>
      </form>
      {notes.length === 0 ? (
        <p className="mt-4 text-sm text-steel-500">No notes yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-[4px] border border-line bg-paper/50 px-3.5 py-3">
              <p className="text-sm leading-relaxed">{n.text}</p>
              <p className="mt-1.5 text-xs text-steel-500">
                {n.author} · {formatDateTime(n.at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SimulatedTag() {
  return <span className="ml-1.5 inline-block whitespace-nowrap rounded-[3px] bg-info-bg px-1.5 py-px text-[10px] font-semibold tracking-wider text-info uppercase">New in demo</span>
}
