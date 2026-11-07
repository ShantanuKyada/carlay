import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

export function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

/** Dark band at the top of inner pages (sits under the fixed header). */
export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-ink-950 pt-28 pb-12 text-paper lg:pt-36 lg:pb-16">
      <div className="container-x">
        {eyebrow && <p className="eyebrow animate-fade-up text-steel-400">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl animate-fade-up font-display text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl animate-fade-up text-[17px] leading-relaxed text-steel-300">{intro}</div>}
        {children}
      </div>
    </section>
  )
}

export function SectionTitle({ eyebrow, title, intro, light = false, className = '' }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; light?: boolean; className?: string }) {
  return (
    <div className={className}>
      {eyebrow && <p className={`eyebrow ${light ? 'text-steel-400' : 'text-steel-500'}`}>{eyebrow}</p>}
      <h2 className={`mt-3 font-display text-3xl leading-[1.1] font-semibold tracking-[-0.02em] sm:text-4xl lg:text-[44px] ${light ? 'text-paper' : 'text-ink-900'}`}>{title}</h2>
      {intro && <p className={`mt-4 max-w-xl text-[16px] leading-relaxed ${light ? 'text-steel-300' : 'text-steel-600'}`}>{intro}</p>}
    </div>
  )
}
