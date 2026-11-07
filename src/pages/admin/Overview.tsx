import { Link } from 'react-router-dom'
import { ArrowRight, CarFront, CheckCircle2, Clock3, Inbox, CalendarClock, BellRing, BadgeCheck, HandCoins, Search, Activity as ActivityIcon } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { Panel } from '../../components/admin/Kit'
import { StatusPill } from '../../components/ui/Badges'
import { CarImage } from '../../components/ui/CarImage'
import { ENQUIRY_STATUSES, type ActivityKind } from '../../types'
import { formatDate, formatLakh, timeAgo, vehicleTitle } from '../../lib/format'
import { todayYmd } from '../../lib/dates'

const OPEN = (s: string) => s !== 'Converted' && s !== 'Lost'

export default function Overview() {
  const { state, vehicleById } = useDemo()
  const today = todayYmd()
  const v = state.vehicles
  const e = state.enquiries

  const followUpsDue = e.filter((x) => OPEN(x.status) && x.followUp && x.followUp <= today)
  const newEnq = e.filter((x) => x.status === 'New')
  const upcomingTD = state.testDrives.filter((t) => t.date >= today && (t.status === 'Pending' || t.status === 'Approved')).sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot))

  const kpis = [
    { label: 'Total vehicles', value: v.length, icon: CarFront, to: '/admin/inventory' },
    { label: 'Available', value: v.filter((x) => x.status === 'available').length, icon: CheckCircle2, to: '/admin/inventory?status=available' },
    { label: 'Reserved', value: v.filter((x) => x.status === 'reserved').length, icon: Clock3, to: '/admin/inventory?status=reserved' },
    { label: 'Sold', value: v.filter((x) => x.status === 'sold').length, icon: BadgeCheck, to: '/admin/inventory?status=sold' },
    { label: 'New enquiries', value: newEnq.length, icon: Inbox, to: '/admin/enquiries?status=New', accent: true },
    { label: 'Follow-ups due', value: followUpsDue.length, icon: BellRing, to: '/admin/enquiries?due=1', accent: followUpsDue.length > 0 },
    { label: 'Upcoming test drives', value: upcomingTD.length, icon: CalendarClock, to: '/admin/test-drives' },
  ]

  // Urgency: overdue follow-ups, then new (uncontacted) enquiries — newest first — then follow-ups due today
  const rank = (x: (typeof e)[number]) => (x.followUp && x.followUp < today ? 0 : x.status === 'New' ? 1 : 2)
  const urgent = e
    .filter((x) => OPEN(x.status) && (x.status === 'New' || (x.followUp && x.followUp <= today)))
    .map((x) => ({ x, overdue: !!x.followUp && x.followUp < today, due: !!x.followUp && x.followUp <= today }))
    .sort((a, b) => rank(a.x) - rank(b.x) || b.x.receivedAt.localeCompare(a.x.receivedAt))
    .slice(0, 7)

  const pipeline = ENQUIRY_STATUSES.map((s) => ({ s, n: e.filter((x) => x.status === s).length }))
  const maxP = Math.max(1, ...pipeline.map((p) => p.n))
  const inventoryValue = v.filter((x) => x.status !== 'sold').reduce((sum, x) => sum + x.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-steel-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Good {greeting()}, team.</h2>
        </div>
        <p className="text-sm text-steel-500">
          Listed stock value <span className="font-semibold text-ink-900 tnum">{formatLakh(inventoryValue)}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className={`group rounded-md p-4 ring-1 transition-shadow hover:shadow-md ${k.accent ? 'bg-ink-950 text-paper ring-ink-950' : 'bg-white ring-line/80'}`}>
            <div className="flex items-center justify-between">
              <k.icon className={`size-4 ${k.accent ? 'text-steel-400' : 'text-steel-400'}`} strokeWidth={1.5} />
              <ArrowRight className={`size-3.5 opacity-0 transition-opacity group-hover:opacity-100 ${k.accent ? 'text-steel-400' : 'text-steel-500'}`} />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight tnum">{k.value}</p>
            <p className={`mt-0.5 text-xs ${k.accent ? 'text-steel-300' : 'text-steel-500'}`}>{k.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          pad={false}
          title="Needs attention"
          action={
            <Link to="/admin/enquiries" className="text-xs font-medium text-steel-600 hover:text-ink-900">
              All enquiries →
            </Link>
          }
        >
          {urgent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-steel-500">You’re all caught up. No new or overdue enquiries.</p>
          ) : (
            <ul className="divide-y divide-line/70">
              {urgent.map(({ x, overdue, due }) => {
                const veh = vehicleById(x.vehicleId)
                return (
                  <li key={x.id}>
                    <Link to={`/admin/enquiries?open=${x.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-paper/60">
                      <CarImage image={veh?.images[0]} className="hidden h-11 w-16 shrink-0 rounded-[3px] sm:block" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {x.name} <span className="font-normal text-steel-500">· {x.type}</span>
                        </p>
                        <p className="truncate text-xs text-steel-500">{veh ? `${vehicleTitle(veh)} ${veh.variant}` : 'No specific vehicle'}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusPill status={x.status} />
                        <span className={`text-[11px] ${overdue ? 'font-medium text-bad' : due ? 'font-medium text-warn' : 'text-steel-500'}`}>
                          {overdue ? `Follow-up overdue · ${formatDate(x.followUp, false)}` : due ? 'Follow-up today' : `Received ${timeAgo(x.receivedAt)}`}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Recent activity" pad={false}>
          <ul className="max-h-[420px] divide-y divide-line/70 overflow-y-auto">
            {state.activity.slice(0, 12).map((a) => {
              const I = activityIcon[a.kind]
              const inner = (
                <>
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-paper-2 text-steel-600">
                    <I className="size-3.5" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="mt-0.5 text-xs text-steel-500">{timeAgo(a.at)}</p>
                  </div>
                </>
              )
              return (
                <li key={a.id}>
                  {a.link ? (
                    <Link to={a.link} className="flex gap-3 px-5 py-3 hover:bg-paper/60">
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex gap-3 px-5 py-3">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Enquiry pipeline">
          <ul className="space-y-3">
            {pipeline.map((p) => (
              <li key={p.s}>
                <Link to={`/admin/enquiries?status=${encodeURIComponent(p.s)}`} className="group block">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-steel-600 group-hover:text-ink-900">{p.s}</span>
                    <span className="font-medium tnum">{p.n}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
                    <div className="h-full rounded-full bg-ink-900 transition-all duration-500" style={{ width: `${(p.n / maxP) * 100}%` }} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Upcoming test drives"
          pad={false}
          action={
            <Link to="/admin/test-drives" className="text-xs font-medium text-steel-600 hover:text-ink-900">
              View all →
            </Link>
          }
        >
          {upcomingTD.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-steel-500">No upcoming test drives.</p>
          ) : (
            <ul className="divide-y divide-line/70">
              {upcomingTD.slice(0, 5).map((t) => {
                const veh = vehicleById(t.vehicleId)
                return (
                  <li key={t.id}>
                    <Link to={`/admin/test-drives?open=${t.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-paper/60">
                      <div className="w-12 shrink-0 text-center">
                        <p className="text-[10px] tracking-wider text-steel-500 uppercase">{new Date(t.date + 'T00:00').toLocaleDateString('en-IN', { month: 'short' })}</p>
                        <p className="font-display text-lg leading-none font-semibold tnum">{new Date(t.date + 'T00:00').getDate()}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.name}</p>
                        <p className="truncate text-xs text-steel-500">
                          {t.slot} · {veh ? vehicleTitle(veh) : '—'}
                        </p>
                      </div>
                      <StatusPill status={t.status} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Requests">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/sell-requests" className="rounded-[4px] border border-line p-4 hover:border-ink-900">
              <HandCoins className="size-4 text-steel-400" strokeWidth={1.5} />
              <p className="mt-3 font-display text-2xl font-semibold tnum">{state.sellRequests.filter((s) => s.status === 'New' || s.status === 'Under Review').length}</p>
              <p className="text-xs text-steel-500">Sell requests open</p>
            </Link>
            <Link to="/admin/sourcing" className="rounded-[4px] border border-line p-4 hover:border-ink-900">
              <Search className="size-4 text-steel-400" strokeWidth={1.5} />
              <p className="mt-3 font-display text-2xl font-semibold tnum">{state.sourcingRequests.filter((s) => s.status !== 'Closed').length}</p>
              <p className="text-xs text-steel-500">Sourcing requests open</p>
            </Link>
          </div>
          <ul className="mt-4 space-y-2.5">
            {state.sellRequests.slice(0, 3).map((s) => (
              <li key={s.id}>
                <Link to={`/admin/sell-requests?open=${s.id}`} className="flex items-center justify-between gap-3 text-sm hover:underline">
                  <span className="truncate">
                    {s.mfgYear} {s.brand} {s.model}
                  </span>
                  <StatusPill status={s.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

const activityIcon: Record<ActivityKind, typeof Inbox> = {
  enquiry: Inbox,
  testdrive: CalendarClock,
  sell: HandCoins,
  sourcing: Search,
  inventory: ActivityIcon,
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}
