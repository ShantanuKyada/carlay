import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { Instagram } from '../ui/Icons'
import { Wordmark } from './Wordmark'
import { siteConfig } from '../../config'

export const NAV = [
  { to: '/cars', label: 'Buy a car' },
  { to: '/sell', label: 'Sell your car' },
  { to: '/find-my-car', label: 'Find my car' },
  { to: '/test-drive', label: 'Test drive' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const { pathname } = useLocation()
  const overHero = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const transparent = overHero && !scrolled && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        transparent ? 'bg-transparent' : 'border-b border-white/5 bg-ink-950/92 backdrop-blur-md'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Wordmark light />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `relative py-1 text-[13px] tracking-[0.02em] transition-colors ${
                  isActive ? 'text-paper after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-paper' : 'text-steel-300 hover:text-paper'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="rounded p-2 text-steel-300 hover:text-paper" aria-label="Carlay on Instagram">
            <Instagram className="size-[18px]" strokeWidth={1.5} />
          </a>
          <Link
            to="/admin"
            className="inline-flex h-9 items-center gap-2 rounded-[4px] border border-white/15 px-3 text-[12px] tracking-[0.04em] text-steel-200 transition-colors hover:border-white/40 hover:text-paper"
          >
            <LayoutDashboard className="size-3.5" strokeWidth={1.75} />
            Team dashboard
          </Link>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="-mr-2 rounded p-2 text-paper lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <div className="h-[calc(100dvh-4rem)] animate-fade-in overflow-y-auto border-t border-white/5 bg-ink-950 lg:hidden">
          <nav className="container-x flex flex-col py-4" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => `border-b border-white/5 py-4 font-display text-2xl tracking-tight ${isActive ? 'text-paper' : 'text-steel-300'}`}
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/admin" className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border border-white/15 text-sm text-steel-200">
                <LayoutDashboard className="size-4" strokeWidth={1.75} /> Team dashboard (demo)
              </Link>
              <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 text-sm text-steel-300">
                <Instagram className="size-4" strokeWidth={1.5} /> {siteConfig.instagramHandle}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
