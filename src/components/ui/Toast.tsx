import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'

type Tone = 'success' | 'info' | 'error'
interface ToastItem {
  id: number
  title: string
  body?: string
  tone: Tone
}

const Ctx = createContext<(title: string, opts?: { body?: string; tone?: Tone }) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const dismiss = (id: number) => setItems((xs) => xs.filter((x) => x.id !== id))
  const toast = useCallback((title: string, opts?: { body?: string; tone?: Tone }) => {
    const id = Date.now() + Math.random()
    setItems((xs) => [...xs.slice(-2), { id, title, body: opts?.body, tone: opts?.tone ?? 'success' }])
    setTimeout(() => dismiss(id), 4200)
  }, [])

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end">
        {items.map((t) => {
          const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? AlertTriangle : Info
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-md border border-ink-700 bg-ink-900 px-4 py-3 text-paper shadow-2xl shadow-black/30"
            >
              <Icon className={`mt-0.5 size-4 shrink-0 ${t.tone === 'error' ? 'text-red-300' : 'text-steel-300'}`} strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                {t.body && <p className="mt-0.5 text-xs leading-relaxed text-steel-300">{t.body}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="text-steel-400 hover:text-paper" aria-label="Dismiss">
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(Ctx)
