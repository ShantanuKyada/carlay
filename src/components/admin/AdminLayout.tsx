import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutGrid, CarFront, Inbox, CalendarClock, HandCoins, Search, ExternalLink, RotateCcw, Menu, X } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../ui/Toast'
import { Modal } from '../ui/Overlay'
import { Button } from '../ui/Button'
import { todayYmd } from '../../lib/dates'

export function AdminLayout() {
  const { state, resetDemo } = useDemo()
  const toast = useToast()
  const { pathname } = useLocation()
  const [confirm, setConfirm] = useState(false)
  const [menu, setMenu] = useState(false)

  const today = todayYmd()
  const nav = [
    { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/admin/inventory', label: 'Inventory', icon: CarFront, count: state.vehicles.filter((v) => v.status === 'available').length, countTone: 'muted' },
    { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, count: state.enquiries.filter((e) => e.status === 'New').length },
    { to: '/admin/test-drives', label: 'Test Drives', icon: CalendarClock, count: state.testDrives.filter((t) => t.status === 'Pending' && t.date >= today).length },
    { to: '/admin/sell-requests', label: 'Sell Your Car Requests', short: 'Sell Your Car Requests', icon: HandCoins, count: state.sellRequests.filter((s) => s.status === 'New').length },
    { to: '/admin/sourcing', label: 'Vehicle Sourcing Requests', short: 'Sourcing Requests', icon: Search, count: state.sourcingRequests.filter((s) => s.status === 'New').length },
  ]

  const navList = (
    <nav className="space-y-0.5" aria-label="Dashboard">
      {nav.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          onClick={() => setMenu(false)}
          className={({ isActive }) =>
            `flex h-10 items-center gap-3 rounded-[4px] px-3 text-[13px] transition-colors ${isActive ? 'bg-white/10 text-paper' : 'text-steel-300 hover:bg-white/5 hover:text-paper'}`
          }
        >
          <n.icon className="size-4 shrink-0" strokeWidth={1.5} />
          <span className="flex-1 truncate" title={n.label}>{n.short ?? n.label}</span>
          {!!n.count && (
            <span className={`rounded-full px-1.5 py-px text-[11px] font-medium tnum ${n.countTone === 'muted' ? 'text-steel-400' : 'bg-paper text-ink-900'}`}>{n.count}</span>
          )}
        </NavLink>
      ))}
    </nav>
  )

  const current = nav.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))

  return (
    <div className="min-h-dvh bg-[#f3f1ec] lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col bg-ink-950 px-3 py-5 text-paper lg:flex">
        <div className="px-3">
          <Link to="/admin" className="font-mark text-[14px] tracking-[0.32em]">
            CARLAY
          </Link>
          <p className="mt-1 text-[11px] tracking-[0.14em] text-steel-500 uppercase">Team dashboard</p>
        </div>
        <div className="mt-8 flex-1">{navList}</div>
        <div className="space-y-1 border-t border-white/10 pt-4">
          <Link to="/" className="flex h-10 items-center gap-3 rounded-[4px] px-3 text-[13px] text-steel-300 hover:bg-white/5 hover:text-paper">
            <ExternalLink className="size-4" strokeWidth={1.5} /> View website
          </Link>
          <button onClick={() => setConfirm(true)} className="flex h-10 w-full items-center gap-3 rounded-[4px] px-3 text-[13px] text-steel-300 hover:bg-white/5 hover:text-paper">
            <RotateCcw className="size-4" strokeWidth={1.5} /> Reset demo data
          </button>
          <div className="mt-3 flex items-center gap-3 rounded-[4px] bg-white/5 px-3 py-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-steel-600 text-[11px] font-semibold">DU</span>
            <div className="min-w-0 text-xs">
              <p className="text-paper">Demo user</p>
              <p className="text-steel-500">No sign-in required</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-ink-950 px-4 text-paper lg:hidden">
        <button onClick={() => setMenu(true)} aria-label="Open dashboard menu" className="-ml-1 p-1.5">
          <Menu className="size-5" strokeWidth={1.5} />
        </button>
        <span className="font-mark text-[13px] tracking-[0.3em]">CARLAY</span>
        <span className="rounded-[3px] border border-white/20 px-1.5 py-0.5 text-[10px] tracking-wider text-steel-300 uppercase">Demo</span>
      </div>
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/60" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-fade-in flex-col bg-ink-950 px-3 py-4 text-paper">
            <div className="mb-6 flex items-center justify-between px-3">
              <span className="font-mark text-[13px] tracking-[0.3em]">CARLAY</span>
              <button onClick={() => setMenu(false)} aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1">{navList}</div>
            <div className="border-t border-white/10 pt-3">
              <Link to="/" className="flex h-10 items-center gap-3 px-3 text-[13px] text-steel-300">
                <ExternalLink className="size-4" strokeWidth={1.5} /> View website
              </Link>
              <button onClick={() => { setMenu(false); setConfirm(true) }} className="flex h-10 items-center gap-3 px-3 text-[13px] text-steel-300">
                <RotateCcw className="size-4" strokeWidth={1.5} /> Reset demo data
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-14 z-20 border-b border-line bg-[#f3f1ec]/90 backdrop-blur lg:top-0">
          <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:h-16 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <h1 className="truncate font-display text-[15px] font-semibold tracking-tight sm:text-base">{current?.label ?? 'Dashboard'}</h1>
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-steel-300 px-2.5 py-0.5 text-[11px] font-medium text-steel-600 sm:inline-flex">
                <span className="size-1.5 rounded-full bg-warn" /> Demo Preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" className="hidden h-9 items-center gap-2 rounded-[4px] px-3 text-[13px] text-steel-600 hover:bg-ink-900/5 hover:text-ink-900 sm:inline-flex">
                <ExternalLink className="size-3.5" strokeWidth={1.75} /> Website
              </Link>
              <Button size="sm" variant="secondary" onClick={() => setConfirm(true)} className="hidden sm:inline-flex">
                <RotateCcw className="size-3.5" strokeWidth={1.75} /> Reset demo data
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
        <footer className="px-4 pb-8 text-xs text-steel-500 sm:px-6 lg:px-8">
          Demo interface with sample data stored in this browser. Not a live production system — no real customer data, messages or bookings.
        </footer>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Reset demo data?">
        <p className="text-[15px] leading-relaxed text-steel-600">
          This restores the original sample inventory, enquiries, test drives and requests. Anything added or changed during this demo will be removed from this browser.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              resetDemo()
              setConfirm(false)
              toast('Demo data reset', { body: 'Sample data restored.' })
            }}
          >
            Reset data
          </Button>
        </div>
      </Modal>
    </div>
  )
}
