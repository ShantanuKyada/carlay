import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, List, CalendarClock, ExternalLink } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../../components/ui/Toast'
import { Drawer } from '../../components/ui/Overlay'
import { StatusPill } from '../../components/ui/Badges'
import { CarImage } from '../../components/ui/CarImage'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { DetailGrid, FilterSelect, InlineSelect, SimulatedTag, Table, Toolbar, td, th, useOpenParam } from '../../components/admin/Kit'
import { TEST_DRIVE_STATUSES, type TestDrive, type TestDriveStatus } from '../../types'
import { formatDate, formatDateTime, vehicleTitle } from '../../lib/format'
import { addDays, todayYmd, ymd } from '../../lib/dates'
import { TIME_SLOTS } from '../../data/seed'

const slotOrder = (s: string) => TIME_SLOTS.indexOf(s)

export default function TestDrives() {
  const { state, vehicleById, updateTestDrive } = useDemo()
  const toast = useToast()
  const [openId, setOpen] = useOpenParam()
  const [view, setView] = useState<'table' | 'week'>('table')
  const [status, setStatus] = useState('')
  const [when, setWhen] = useState<'Upcoming' | 'Past' | ''>('Upcoming')
  const [weekStart, setWeekStart] = useState(() => new Date())
  const today = todayYmd()

  const rows = useMemo(
    () =>
      state.testDrives
        .filter((t) => (!status || t.status === status) && (!when || (when === 'Upcoming' ? t.date >= today : t.date < today)))
        .sort((a, b) => (when === 'Past' ? -1 : 1) * (a.date.localeCompare(b.date) || slotOrder(a.slot) - slotOrder(b.slot))),
    [state.testDrives, status, when, today],
  )

  const change = (t: TestDrive, s: string) => {
    updateTestDrive(t.id, { status: s as TestDriveStatus })
    toast(`Test drive ${s.toLowerCase()}`, { body: `${t.name} · ${formatDate(t.date, false)} ${t.slot}` })
  }

  const open = state.testDrives.find((t) => t.id === openId)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Test drives</h2>
          <p className="mt-1 text-sm text-steel-500">Requests from the website and the team. Approve, complete or cancel each one.</p>
        </div>
        <div className="flex overflow-hidden rounded-[4px] border border-line bg-white" role="group" aria-label="View">
          {([
            ['table', List, 'Table'],
            ['week', CalendarDays, 'Week'],
          ] as const).map(([k, I, l]) => (
            <button key={k} onClick={() => setView(k)} aria-pressed={view === k} className={`flex h-9 items-center gap-2 px-3.5 text-[13px] ${view === k ? 'bg-ink-900 text-paper' : 'text-steel-600 hover:text-ink-900'}`}>
              <I className="size-4" strokeWidth={1.5} /> {l}
            </button>
          ))}
        </div>
      </div>

      {view === 'table' ? (
        <>
          <Toolbar>
            <FilterSelect label="When" value={when} onChange={(v) => setWhen(v as typeof when)} options={['Upcoming', 'Past']} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={TEST_DRIVE_STATUSES} />
            <span className="ml-auto text-[13px] text-steel-500 tnum">{rows.length} shown</span>
          </Toolbar>
          {rows.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No test drives here" body="Try a different filter. New requests from the website appear automatically." />
          ) : (
            <Table
              minWidth={900}
              head={
                <tr>
                  <th className={th}>Date &amp; time</th>
                  <th className={th}>Customer</th>
                  <th className={th}>Vehicle</th>
                  <th className={th}>Requested</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Quick action</th>
                </tr>
              }
            >
              {rows.map((t) => {
                const veh = vehicleById(t.vehicleId)
                return (
                  <tr key={t.id} onClick={() => setOpen(t.id)} className="cursor-pointer hover:bg-paper/50">
                    <td className={`${td} whitespace-nowrap`}>
                      <p className="font-medium tnum">{t.date === today ? 'Today' : formatDate(t.date)}</p>
                      <p className="text-xs text-steel-500 tnum">{t.slot}</p>
                    </td>
                    <td className={td}>
                      <p className="font-medium whitespace-nowrap">
                        {t.name}
                        {t.isSimulated && <SimulatedTag />}
                      </p>
                      <p className="text-xs text-steel-500 tnum">{t.phone}</p>
                    </td>
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <CarImage image={veh?.images[0]} className="hidden h-10 w-14 shrink-0 rounded-[3px] md:block" />
                        <div className="min-w-0">
                          <p className="truncate">{veh ? vehicleTitle(veh) : '—'}</p>
                          <p className="truncate text-xs text-steel-500">{veh?.variant}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} whitespace-nowrap text-steel-600`}>{formatDateTime(t.createdAt)}</td>
                    <td className={td}>
                      <InlineSelect label="Status" value={t.status} options={TEST_DRIVE_STATUSES} onChange={(s) => change(t, s)} className="w-32" />
                    </td>
                    <td className={`${td} text-right`} onClick={(e) => e.stopPropagation()}>
                      {t.status === 'Pending' && (
                        <Button size="sm" onClick={() => change(t, 'Approved')}>
                          Approve
                        </Button>
                      )}
                      {t.status === 'Approved' && (
                        <Button size="sm" variant="secondary" onClick={() => change(t, 'Completed')}>
                          Mark completed
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </Table>
          )}
        </>
      ) : (
        <div className="overflow-hidden rounded-md bg-white ring-1 ring-line/80">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <button onClick={() => setWeekStart((d) => addDays(d, -7))} className="rounded p-1.5 text-steel-600 hover:bg-ink-900/5" aria-label="Previous week">
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">
                {formatDate(ymd(days[0]), false)} – {formatDate(ymd(days[6]))}
              </p>
              <button onClick={() => setWeekStart(new Date())} className="text-xs text-steel-500 underline underline-offset-2 hover:text-ink-900">
                Today
              </button>
            </div>
            <button onClick={() => setWeekStart((d) => addDays(d, 7))} className="rounded p-1.5 text-steel-600 hover:bg-ink-900/5" aria-label="Next week">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="grid min-w-[840px] grid-cols-7 divide-x divide-line/70">
              {days.map((d) => {
                const key = ymd(d)
                const items = state.testDrives.filter((t) => t.date === key).sort((a, b) => slotOrder(a.slot) - slotOrder(b.slot))
                return (
                  <div key={key} className={`min-h-[360px] ${key === today ? 'bg-paper/60' : ''}`}>
                    <div className="border-b border-line/70 px-3 py-2.5">
                      <p className="text-[11px] tracking-wider text-steel-500 uppercase">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                      <p className={`font-display text-lg font-semibold tnum ${key === today ? 'text-ink-900' : ''}`}>{d.getDate()}</p>
                    </div>
                    <div className="space-y-2 p-2">
                      {items.map((t) => {
                        const veh = vehicleById(t.vehicleId)
                        return (
                          <button key={t.id} onClick={() => setOpen(t.id)} className={`w-full rounded-[4px] border-l-2 bg-white p-2.5 text-left shadow-sm ring-1 ring-line/70 hover:ring-ink-900/40 ${borderFor(t.status)}`}>
                            <p className="text-[11px] font-medium text-steel-600 tnum">{t.slot}</p>
                            <p className="mt-0.5 truncate text-[13px] font-medium">{t.name}</p>
                            <p className="truncate text-[11px] text-steel-500">{veh ? `${veh.make} ${veh.model}` : '—'}</p>
                            <StatusPill status={t.status} className="mt-1.5 !text-[10px]" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open ? `Test drive · ${open.name}` : ''} subtitle={open && <span className="tnum">{open.ref} · requested {formatDateTime(open.createdAt)}</span>}>
        {open && (
          <div className="space-y-8">
            {open.isSimulated && <p className="rounded-[4px] bg-info-bg px-3.5 py-2.5 text-[13px] text-info">Simulated request submitted through the website during this demo.</p>}
            <div>
              <p className="eyebrow mb-3 text-steel-500">Status</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TEST_DRIVE_STATUSES.map((s) => (
                  <button key={s} onClick={() => change(open, s)} aria-pressed={open.status === s} className={`h-10 rounded-[4px] border text-[13px] transition-colors ${open.status === s ? 'border-ink-900 bg-ink-900 text-paper' : 'border-line bg-white hover:border-steel-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {open.status === 'Approved' && <p className="mt-2 text-xs text-steel-500">The linked enquiry moves to “Test Drive Scheduled”. In production, the customer would also be notified.</p>}
            </div>
            <DetailGrid
              rows={[
                ['Preferred date', formatDate(open.date)],
                ['Time slot', open.slot],
                ['Customer', open.name],
                ['Phone', open.phone],
                ['Email', open.email],
                ['Notes', open.notes],
              ]}
            />
            {(() => {
              const veh = vehicleById(open.vehicleId)
              return veh ? (
                <div className="flex gap-4 rounded-md bg-white p-3 ring-1 ring-line/80">
                  <CarImage image={veh.images[0]} className="h-16 w-24 shrink-0 rounded-[3px]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{vehicleTitle(veh)}</p>
                    <p className="truncate text-xs text-steel-500">{veh.variant}</p>
                  </div>
                  <Link to={`/cars/${veh.slug}`} target="_blank" className="self-start p-1 text-steel-500 hover:text-ink-900">
                    <ExternalLink className="size-4" />
                  </Link>
                </div>
              ) : null
            })()}
            {open.enquiryId && state.enquiries.some((e) => e.id === open.enquiryId) && (
              <Link to={`/admin/enquiries?open=${open.enquiryId}`} className="inline-flex text-sm font-medium underline underline-offset-4">
                Open linked enquiry
              </Link>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}

function borderFor(s: TestDriveStatus) {
  return s === 'Pending' ? 'border-l-warn' : s === 'Approved' ? 'border-l-info' : s === 'Completed' ? 'border-l-ok' : 'border-l-steel-300 opacity-60'
}
