import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../../components/ui/Toast'
import { Drawer } from '../../components/ui/Overlay'
import { EmptyState } from '../../components/ui/EmptyState'
import { CarImage } from '../../components/ui/CarImage'
import { DetailGrid, FilterSelect, InlineSelect, NotesPanel, SearchBox, SimulatedTag, Table, Toolbar, td, th, useOpenParam } from '../../components/admin/Kit'
import { SOURCING_STATUSES, type SourcingRequest, type SourcingStatus } from '../../types'
import { formatDateTime, formatKm, formatLakh, timeAgo, vehicleTitle } from '../../lib/format'

const budget = (r: SourcingRequest) => (r.budgetMin ? `${formatLakh(r.budgetMin)} – ${formatLakh(r.budgetMax)}` : `Up to ${formatLakh(r.budgetMax)}`)

export default function Sourcing() {
  const { state, updateSourcingRequest, addNote } = useDemo()
  const toast = useToast()
  const [openId, setOpen] = useOpenParam()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  const rows = useMemo(
    () =>
      state.sourcingRequests
        .filter((s) => (!status || s.status === status) && (!q || `${s.makeModel} ${s.name} ${s.phone} ${s.ref}`.toLowerCase().includes(q.toLowerCase())))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.sourcingRequests, q, status],
  )
  const open = state.sourcingRequests.find((s) => s.id === openId)

  // Simple matcher against current stock: budget, year, km, fuel, transmission
  const matches = useMemo(() => {
    if (!open) return []
    return state.vehicles.filter(
      (v) =>
        v.status === 'available' &&
        v.price <= open.budgetMax * 1.05 &&
        (!open.budgetMin || v.price >= open.budgetMin * 0.9) &&
        (!open.yearFrom || v.mfgYear >= open.yearFrom) &&
        (!open.maxKm || v.km <= open.maxKm) &&
        (open.fuel === 'Any' || v.fuel === open.fuel.toLowerCase()) &&
        (open.transmission === 'Any' || v.transmission === open.transmission.toLowerCase()),
    )
  }, [open, state.vehicles])

  const change = (id: string, s: string) => {
    updateSourcingRequest(id, { status: s as SourcingStatus })
    toast(`Marked ${s}`)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Vehicle sourcing requests</h2>
        <p className="mt-1 text-sm text-steel-500">Buyers who asked Carlay to look out for a specific car through Find My Car.</p>
      </div>
      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Search car, customer or ref" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={SOURCING_STATUSES} />
        <span className="ml-auto text-[13px] text-steel-500 tnum">{rows.length} shown</span>
      </Toolbar>
      {rows.length === 0 ? (
        <EmptyState icon={SearchIcon} title="No sourcing requests" body="Requests submitted through Find My Car appear here." />
      ) : (
        <Table
          minWidth={960}
          head={
            <tr>
              <th className={th}>Looking for</th>
              <th className={th}>Budget</th>
              <th className={th}>Preferences</th>
              <th className={th}>Customer</th>
              <th className={th}>Received</th>
              <th className={th}>Status</th>
            </tr>
          }
        >
          {rows.map((r) => (
            <tr key={r.id} onClick={() => setOpen(r.id)} className="cursor-pointer hover:bg-paper/50">
              <td className={td}>
                <p className="font-medium">
                  {r.makeModel}
                  {r.isSimulated && <SimulatedTag />}
                </p>
                {r.requirements && <p className="max-w-64 truncate text-xs text-steel-500">{r.requirements}</p>}
              </td>
              <td className={`${td} whitespace-nowrap tnum`}>{budget(r)}</td>
              <td className={`${td} text-steel-600`}>
                <p className="text-xs">
                  {r.yearFrom ? `${r.yearFrom}+` : 'Any year'} · {r.maxKm ? `≤ ${formatKm(r.maxKm)}` : 'Any km'}
                </p>
                <p className="text-xs">
                  {r.fuel} · {r.transmission}
                </p>
              </td>
              <td className={td}>
                <p>{r.name}</p>
                <p className="text-xs text-steel-500 tnum">{r.phone}</p>
              </td>
              <td className={`${td} whitespace-nowrap text-steel-600`}>{timeAgo(r.createdAt)}</td>
              <td className={td}>
                <InlineSelect label="Status" value={r.status} options={SOURCING_STATUSES} onChange={(x) => change(r.id, x)} className="w-36" />
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.makeModel} subtitle={open && <span className="tnum">{open.ref} · received {formatDateTime(open.createdAt)}</span>}>
        {open && (
          <div className="space-y-8">
            {open.isSimulated && <p className="rounded-[4px] bg-info-bg px-3.5 py-2.5 text-[13px] text-info">Submitted through the website during this demo session.</p>}
            <div>
              <p className="eyebrow mb-3 text-steel-500">Status</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SOURCING_STATUSES.map((s) => (
                  <button key={s} onClick={() => change(open.id, s)} aria-pressed={open.status === s} className={`h-10 rounded-[4px] border text-[13px] ${open.status === s ? 'border-ink-900 bg-ink-900 text-paper' : 'border-line bg-white hover:border-steel-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <DetailGrid
              rows={[
                ['Make & model', open.makeModel],
                ['Budget', budget(open)],
                ['Year', open.yearFrom ? `${open.yearFrom} or newer` : 'Any'],
                ['Max kilometres', open.maxKm ? formatKm(open.maxKm) : 'Any'],
                ['Fuel', open.fuel],
                ['Transmission', open.transmission],
                ['Customer', open.name],
                ['Phone', open.phone],
                ['Email', open.email],
              ]}
            />
            {open.requirements && (
              <div>
                <p className="eyebrow mb-3 text-steel-500">Additional requirements</p>
                <p className="rounded-[4px] bg-white px-4 py-3 text-sm leading-relaxed ring-1 ring-line/80">{open.requirements}</p>
              </div>
            )}
            <div>
              <p className="eyebrow mb-3 text-steel-500">Possible matches in stock</p>
              {matches.length === 0 ? (
                <p className="text-sm text-steel-500">No current stock matches the budget and preferences.</p>
              ) : (
                <ul className="space-y-2">
                  {matches.slice(0, 4).map((v) => (
                    <li key={v.id}>
                      <Link to={`/cars/${v.slug}`} target="_blank" className="flex items-center gap-3 rounded-[4px] bg-white p-2.5 ring-1 ring-line/80 hover:ring-ink-900/40">
                        <CarImage image={v.images[0]} className="h-10 w-14 shrink-0 rounded-[3px]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{vehicleTitle(v)}</p>
                          <p className="truncate text-xs text-steel-500">{v.variant}</p>
                        </div>
                        <span className="text-sm font-medium tnum">{formatLakh(v.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-steel-500">Suggested automatically from budget, year, kilometres, fuel and transmission.</p>
            </div>
            <NotesPanel notes={open.notes} onAdd={(t) => { addNote('sourcingRequests', open.id, t); toast('Note added') }} />
          </div>
        )}
      </Drawer>
    </div>
  )
}
