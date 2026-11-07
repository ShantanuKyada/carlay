import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Pencil, ExternalLink, BadgeCheck, CarFront } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../../components/ui/Toast'
import { Button } from '../../components/ui/Button'
import { Drawer } from '../../components/ui/Overlay'
import { CarImage } from '../../components/ui/CarImage'
import { AvailabilityBadge } from '../../components/ui/Badges'
import { EmptyState } from '../../components/ui/EmptyState'
import { FilterSelect, InlineSelect, SearchBox, Table, Toolbar, td, th } from '../../components/admin/Kit'
import { VehicleForm } from '../../components/admin/VehicleForm'
import { bodyLabel, formatDate, formatINR, formatKm, fuelLabel, vehicleTitle } from '../../lib/format'
import type { Availability, Vehicle } from '../../types'

const STATUS_LABEL: Record<Availability, string> = { available: 'Available', reserved: 'Reserved', sold: 'Sold' }
const LABEL_STATUS: Record<string, Availability> = { Available: 'available', Reserved: 'reserved', Sold: 'sold' }

export default function Inventory() {
  const { state, saveVehicle, setVehicleStatus } = useDemo()
  const toast = useToast()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState(params.get('status') ? STATUS_LABEL[params.get('status') as Availability] ?? '' : '')
  const [body, setBody] = useState('')
  const [sort, setSort] = useState<'added' | 'price' | 'km'>('added')
  const [editing, setEditing] = useState<Vehicle | 'new' | null>(null)

  const bodies = useMemo(() => [...new Set(state.vehicles.map((v) => bodyLabel(v.bodyType)))].sort(), [state.vehicles])

  const rows = useMemo(() => {
    const n = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    return state.vehicles
      .filter((v) => (!q || n(`${v.make} ${v.model} ${v.variant} ${v.stockCode} ${v.mfgYear}`).includes(n(q))) && (!status || v.status === LABEL_STATUS[status]) && (!body || bodyLabel(v.bodyType) === body))
      .sort((a, b) => (sort === 'added' ? b.addedAt.localeCompare(a.addedAt) : sort === 'price' ? b.price - a.price : a.km - b.km))
  }, [state.vehicles, q, status, body, sort])

  const counts = (s: Availability) => state.vehicles.filter((v) => v.status === s).length

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">Inventory</h2>
          <p className="mt-1 text-sm text-steel-500 tnum">
            {state.vehicles.length} vehicles · {counts('available')} available · {counts('reserved')} reserved · {counts('sold')} sold
          </p>
        </div>
        <Button onClick={() => setEditing('new')}>
          <Plus className="size-4" /> Add vehicle
        </Button>
      </div>

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Search make, model or stock code" />
        <FilterSelect label="Availability" value={status} onChange={setStatus} options={['Available', 'Reserved', 'Sold']} />
        <FilterSelect label="Body" value={body} onChange={setBody} options={bodies} />
        <div className="ml-auto">
          <InlineSelect label="Sort" value={sort === 'added' ? 'Newest first' : sort === 'price' ? 'Price: high to low' : 'Kilometres: low to high'} onChange={(x) => setSort(x === 'Newest first' ? 'added' : x === 'Price: high to low' ? 'price' : 'km')} options={['Newest first', 'Price: high to low', 'Kilometres: low to high']} className="w-48" />
        </div>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={CarFront} title="No vehicles match" body="Try a different search or clear the filters." action={<Button variant="secondary" onClick={() => { setQ(''); setStatus(''); setBody('') }}>Clear filters</Button>} />
      ) : (
        <Table
          minWidth={940}
          head={
            <tr>
              <th className={th}>Vehicle</th>
              <th className={`${th} text-right`}>Price</th>
              <th className={`${th} text-right`}>Kilometres</th>
              <th className={th}>Availability</th>
              <th className={th}>Date added</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          }
        >
          {rows.map((v) => (
            <tr key={v.id} className="hover:bg-paper/50">
              <td className={td}>
                <div className="flex items-center gap-3">
                  <CarImage image={v.images[0]} className="h-12 w-[72px] shrink-0 rounded-[3px]" />
                  <div className="min-w-0">
                    <p className="font-medium">
                      {vehicleTitle(v)} {v.featured && <span className="ml-1 rounded-[3px] bg-paper-3 px-1.5 py-px text-[10px] font-semibold tracking-wider text-steel-600 uppercase">Featured</span>}
                    </p>
                    <p className="truncate text-xs text-steel-500">
                      {v.variant} · {fuelLabel(v.fuel)} · {v.stockCode}
                    </p>
                  </div>
                </div>
              </td>
              <td className={`${td} text-right font-medium tnum`}>{formatINR(v.price)}</td>
              <td className={`${td} text-right text-steel-600 tnum`}>{formatKm(v.km)}</td>
              <td className={td}>
                <div className="flex items-center gap-2">
                  <AvailabilityBadge status={v.status} className="hidden xl:inline-flex" />
                  <InlineSelect
                    label="Change availability"
                    value={STATUS_LABEL[v.status]}
                    options={['Available', 'Reserved', 'Sold']}
                    onChange={(x) => {
                      setVehicleStatus(v.id, LABEL_STATUS[x])
                      toast(`${v.make} ${v.model} marked ${x}`)
                    }}
                    className="w-28"
                  />
                </div>
              </td>
              <td className={`${td} text-steel-600 tnum`}>{formatDate(v.addedAt)}</td>
              <td className={`${td} text-right`}>
                <div className="flex justify-end gap-1">
                  {v.status !== 'sold' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setVehicleStatus(v.id, 'sold')
                        toast(`${v.make} ${v.model} marked sold`, { body: 'It now shows as Sold on the website.' })
                      }}
                      title="Mark as sold"
                    >
                      <BadgeCheck className="size-4" strokeWidth={1.5} /> <span className="hidden 2xl:inline">Mark sold</span>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setEditing(v)} title="Edit">
                    <Pencil className="size-4" strokeWidth={1.5} /> Edit
                  </Button>
                  <Link to={`/cars/${v.slug}`} target="_blank" className="inline-flex size-9 items-center justify-center rounded-[4px] text-steel-500 hover:bg-ink-900/5 hover:text-ink-900" title="View on website">
                    <ExternalLink className="size-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add vehicle' : 'Edit vehicle'} subtitle={editing && editing !== 'new' ? `${vehicleTitle(editing)} · ${editing.stockCode}` : 'New listings appear on the website immediately.'} width="max-w-2xl">
        {editing && (
          <VehicleForm
            key={editing === 'new' ? 'new' : editing.id}
            vehicle={editing === 'new' ? undefined : editing}
            existing={state.vehicles}
            onCancel={() => setEditing(null)}
            onSave={(v) => {
              const isNew = editing === 'new'
              saveVehicle(v, isNew)
              setEditing(null)
              toast(isNew ? 'Vehicle added' : 'Changes saved', { body: `${vehicleTitle(v)} ${v.variant}` })
            }}
          />
        )}
      </Drawer>
    </div>
  )
}
