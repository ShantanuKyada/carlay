import { useMemo, useState } from 'react'
import { HandCoins, ImageOff } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../../components/ui/Toast'
import { Drawer } from '../../components/ui/Overlay'
import { EmptyState } from '../../components/ui/EmptyState'
import { DetailGrid, FilterSelect, InlineSelect, NotesPanel, SearchBox, SimulatedTag, Table, Toolbar, td, th, useOpenParam } from '../../components/admin/Kit'
import { SELL_STATUSES, type SellStatus } from '../../types'
import { formatDateTime, formatINR, formatKm, fuelLabel, timeAgo } from '../../lib/format'

export default function SellRequests() {
  const { state, updateSellRequest, addNote } = useDemo()
  const toast = useToast()
  const [openId, setOpen] = useOpenParam()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  const rows = useMemo(
    () =>
      state.sellRequests
        .filter((s) => (!status || s.status === status) && (!q || `${s.brand} ${s.model} ${s.name} ${s.phone} ${s.ref}`.toLowerCase().includes(q.toLowerCase())))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.sellRequests, q, status],
  )
  const open = state.sellRequests.find((s) => s.id === openId)
  const change = (id: string, s: string) => {
    updateSellRequest(id, { status: s as SellStatus })
    toast(`Marked ${s}`)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Sell Your Car requests</h2>
        <p className="mt-1 text-sm text-steel-500">Cars submitted by owners through the website. Review, contact, and close each request.</p>
      </div>
      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Search car, seller or ref" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={SELL_STATUSES} />
        <span className="ml-auto text-[13px] text-steel-500 tnum">{rows.length} shown</span>
      </Toolbar>
      {rows.length === 0 ? (
        <EmptyState icon={HandCoins} title="No sell requests" body="Requests submitted through Sell Your Car appear here." />
      ) : (
        <Table
          minWidth={960}
          head={
            <tr>
              <th className={th}>Vehicle</th>
              <th className={th}>Details</th>
              <th className={th}>Seller</th>
              <th className={th}>Asking</th>
              <th className={th}>Submitted</th>
              <th className={th}>Status</th>
            </tr>
          }
        >
          {rows.map((s) => (
            <tr key={s.id} onClick={() => setOpen(s.id)} className="cursor-pointer hover:bg-paper/50">
              <td className={td}>
                <div className="flex items-center gap-3">
                  {s.photos[0] ? (
                    <img src={s.photos[0]} alt="" className="h-10 w-14 shrink-0 rounded-[3px] object-cover" />
                  ) : (
                    <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-[3px] bg-paper-2 text-[10px] text-steel-500 tnum">{s.photoCount} photos</span>
                  )}
                  <div>
                    <p className="font-medium">
                      {s.mfgYear} {s.brand} {s.model}
                      {s.isSimulated && <SimulatedTag />}
                    </p>
                    <p className="text-xs text-steel-500">{s.variant ?? '—'}</p>
                  </div>
                </div>
              </td>
              <td className={`${td} text-steel-600`}>
                <p className="tnum">{formatKm(s.km)}</p>
                <p className="text-xs">
                  {fuelLabel(s.fuel)} · {s.transmission} · {s.owners}
                </p>
              </td>
              <td className={td}>
                <p>{s.name}</p>
                <p className="text-xs text-steel-500 tnum">
                  {s.phone} · prefers {s.preferredContact.toLowerCase()}
                </p>
              </td>
              <td className={`${td} tnum`}>{s.askingPrice ? formatINR(s.askingPrice) : <span className="text-steel-400">Not given</span>}</td>
              <td className={`${td} whitespace-nowrap text-steel-600`} title={formatDateTime(s.createdAt)}>
                {timeAgo(s.createdAt)}
              </td>
              <td className={td}>
                <InlineSelect label="Status" value={s.status} options={SELL_STATUSES} onChange={(x) => change(s.id, x)} className="w-36" />
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open ? `${open.mfgYear} ${open.brand} ${open.model}` : ''} subtitle={open && <span className="tnum">{open.ref} · submitted {formatDateTime(open.createdAt)}</span>} width="max-w-2xl">
        {open && (
          <div className="space-y-8">
            {open.isSimulated && <p className="rounded-[4px] bg-info-bg px-3.5 py-2.5 text-[13px] text-info">Submitted through the website during this demo session.</p>}
            <div>
              <p className="eyebrow mb-3 text-steel-500">Review status</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SELL_STATUSES.map((s) => (
                  <button key={s} onClick={() => change(open.id, s)} aria-pressed={open.status === s} className={`h-10 rounded-[4px] border text-[13px] ${open.status === s ? 'border-ink-900 bg-ink-900 text-paper' : 'border-line bg-white hover:border-steel-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3 text-steel-500">Photos</p>
              {open.photos.length ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {open.photos.map((p, i) => (
                    <a key={i} href={p} target="_blank" rel="noreferrer">
                      <img src={p} alt={`Seller photo ${i + 1}`} className="aspect-[4/3] w-full rounded-[3px] object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm text-steel-500">
                  <ImageOff className="size-4" strokeWidth={1.5} />
                  {open.photoCount ? `${open.photoCount} photos on file (sample record — previews not stored).` : 'No photos submitted.'}
                </p>
              )}
            </div>
            <div>
              <p className="eyebrow mb-3 text-steel-500">Vehicle</p>
              <DetailGrid
                rows={[
                  ['Brand & model', `${open.brand} ${open.model}`],
                  ['Variant', open.variant],
                  ['Manufacturing year', String(open.mfgYear)],
                  ['Registration year', String(open.regYear)],
                  ['Kilometres', formatKm(open.km)],
                  ['Fuel · transmission', `${fuelLabel(open.fuel)} · ${open.transmission}`],
                  ['Ownership', open.owners],
                  ['Asking price', open.askingPrice ? formatINR(open.askingPrice) : 'Not given'],
                ]}
              />
            </div>
            <div>
              <p className="eyebrow mb-3 text-steel-500">Condition</p>
              <DetailGrid
                rows={[
                  ['Accident history', open.accidentHistory],
                  ['Service history', open.serviceHistory],
                  ['Insurance', open.insuranceValid],
                  ['Registration', open.registrationValid],
                  ['Loan', open.loan],
                ]}
              />
              {open.conditionNotes && <p className="mt-4 rounded-[4px] bg-white px-4 py-3 text-sm leading-relaxed ring-1 ring-line/80">{open.conditionNotes}</p>}
            </div>
            <div>
              <p className="eyebrow mb-3 text-steel-500">Seller</p>
              <DetailGrid rows={[['Name', open.name], ['Phone', open.phone], ['Email', open.email], ['Preferred contact', open.preferredContact]]} />
            </div>
            <NotesPanel notes={open.notes} onAdd={(t) => { addNote('sellRequests', open.id, t); toast('Note added') }} />
          </div>
        )}
      </Drawer>
    </div>
  )
}
