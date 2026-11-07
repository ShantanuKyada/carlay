import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

function useLockScroll(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])
}

/** Right-hand side panel (full screen on mobile). */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-xl',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  useLockScroll(open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fade-in bg-ink-950/50 backdrop-blur-[2px]" onClick={onClose} />
      <aside role="dialog" aria-modal="true" className={`absolute inset-y-0 right-0 flex w-full ${width} animate-slide-in flex-col bg-paper shadow-2xl`}>
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
            {subtitle && <div className="mt-0.5 text-[13px] text-steel-500">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="-mr-1 rounded p-1.5 text-steel-500 hover:bg-ink-900/5 hover:text-ink-900" aria-label="Close">
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <footer className="border-t border-line bg-paper-2/60 px-5 py-3.5 sm:px-6">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  )
}

/** Centered modal (bottom sheet on mobile). */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  useLockScroll(open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink-950/60 backdrop-blur-[2px]" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative max-h-[92vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-lg bg-paper shadow-2xl sm:rounded-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-5 py-4">
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          <button onClick={onClose} className="rounded p-1.5 text-steel-500 hover:bg-ink-900/5 hover:text-ink-900" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
