import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Inbox, Phone, MessageCircle, Mail, ExternalLink } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../../components/ui/Toast'
import { Drawer } from '../../components/ui/Overlay'
import { AvailabilityBadge } from '../../components/ui/Badges'
import { CarImage } from '../../components/ui/CarImage'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'
import { DetailGrid, FilterSelect, InlineSelect, NotesPanel, SearchBox, SimulatedTag, Table, Toolbar, td, th, useOpenParam } from '../../components/admin/Kit'
import { TEAM } from '../../data/seed'
import { ENQUIRY_SOURCES, ENQUIRY_STATUSES, ENQUIRY_TYPES, type Enquiry } from '../../types'
import { formatDate, formatDateTime, formatLakh, timeAgo, vehicleTitle } from '../../lib/format'
import { todayYmd } from '../../lib/dates'

const UNASSIGNED = 'Unassigned'

export default function Enquiries() {
  const { state, vehicleById, updateEnquiry, addNote } = useDemo()
  const toast = useToast()
  const [params] = useSearchParams()
  const [openId, setOpen] = useOpenParam()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState(params.get('status') ?? '')
  const [type, setType] = useState('')
  const [source, setSource] = useState('')
  const [assignee, setAssignee] = useState('')
  const [dueOnly, setDueOnly] = useState(params.get('due') === '1')
  const today = todayYmd()

  const rows = useMemo(() => {
    const n = q.toLowerCase()
    return state.enquiries
      .filter((e) => {
        const veh = vehicleById(e.vehicleId)
        if (n && !`${e.name} ${e.phone} ${e.ref} ${veh ? vehicleTitle(veh) : ''}`.toLowerCase().includes(n)) return false
        if (status && e.status !== status) return false
        if (type && e.type !== type) return false
        if (source && e.source !== source) return false
        if (assignee && (e.assignee ?? UNASSIGNED) !== assignee) return false
        if (dueOnly && !(e.followUp && e.followUp <= today && e.status !== 'Converted' && e.status !== 'Lost')) return false
        return true
      })
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
  }, [state.enquiries, q, status, type, source, assignee, dueOnly, today, vehicleById])

  const open = state.enquiries.find((e) => e.id === openId)
  const anyFilter = q || status || type || source || assignee || dueOnly

  const setStatusFor = (e: Enquiry, s: string) => {
    updateEnquiry(e.id, { status: s as Enquiry['status'] }, `${e.name} moved to ${s}`)
    toast(`Status updated to ${s}`, { body: e.name })
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Enquiries</h2>
        <p className="mt-1 text-sm text-steel-500">Every buyer enquiry in one place — from the website, Instagram, WhatsApp, calls and walk-ins.</p>
      </div>

      {/* status tabs */}
      <div className="no-scrollbar -mx-1 mb-4 flex gap-1 overflow-x-auto px-1">
        {['', ...ENQUIRY_STATUSES].map((s) => {
          const n = s ? state.enquiries.filter((e) => e.status === s).length : state.enquiries.length
          const active = status === s
          return (
            <button key={s || 'all'} onClick={() => setStatus(s)} className={`flex h-9 shrink-0 items-center gap-2 rounded-[4px] px-3 text-[13px] transition-colors ${active ? 'bg-ink-900 text-paper' : 'text-steel-600 hover:bg-ink-900/5'}`}>
              {s || 'All'} <span className={`text-xs tnum ${active ? 'text-steel-300' : 'text-steel-400'}`}>{n}</span>
            </button>
          )
        })}
      </div>

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Search name, phone, car or ref" />
        <FilterSelect label="Type" value={type} onChange={setType} options={ENQUIRY_TYPES} />
        <FilterSelect label="Source" value={source} onChange={setSource} options={ENQUIRY_SOURCES} />
        <FilterSelect label="Assigned" value={assignee} onChange={setAssignee} options={[...TEAM, UNASSIGNED]} />
        <label className={`flex h-9 cursor-pointer items-center gap-2 rounded-[4px] border px-3 text-[13px] ${dueOnly ? 'border-ink-900 bg-white font-medium' : 'border-line bg-white text-steel-600'}`}>
          <input type="checkbox" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} className="accent-ink-900" /> Follow-up due
        </label>
        {anyFilter && (
          <button onClick={() => { setQ(''); setStatus(''); setType(''); setSource(''); setAssignee(''); setDueOnly(false) }} className="text-[13px] text-steel-600 underline underline-offset-4 hover:text-ink-900">
            Clear
          </button>
        )}
        <span className="ml-auto text-[13px] text-steel-500 tnum">{rows.length} shown</span>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={Inbox} title="No enquiries match" body={anyFilter ? 'Try clearing a filter.' : 'New enquiries from the website will appear here.'} />
      ) : (
        <Table
          minWidth={1180}
          head={
            <tr>
              <th className={th}>Customer</th>
              <th className={th}>Interested vehicle</th>
              <th className={th}>Type</th>
              <th className={th}>Received</th>
              <th className={th}>Source</th>
              <th className={th}>Assigned</th>
              <th className={th}>Status</th>
              <th className={th}>Next follow-up</th>
            </tr>
          }
        >
          {rows.map((e) => {
            const veh = vehicleById(e.vehicleId)
            const overdue = e.followUp && e.followUp < today && e.status !== 'Converted' && e.status !== 'Lost'
            const dueToday = e.followUp === today && e.status !== 'Converted' && e.status !== 'Lost'
            return (
              <tr key={e.id} onClick={() => setOpen(e.id)} className="cursor-pointer hover:bg-paper/50">
                <td className={td}>
                  <p className="font-medium whitespace-nowrap">
                    {e.name}
                    {e.isSimulated && <SimulatedTag />}
                  </p>
                  <p className="text-xs text-steel-500 tnum">{e.phone}</p>
                </td>
                <td className={`${td} max-w-56`}>
                  {veh ? (
                    <>
                      <p className="truncate">{vehicleTitle(veh)}</p>
                      <p className="truncate text-xs text-steel-500">{veh.variant}</p>
                    </>
                  ) : (
                    <span className="text-steel-500">—</span>
                  )}
                </td>
                <td className={`${td} whitespace-nowrap`}>{e.type}</td>
                <td className={`${td} whitespace-nowrap text-steel-600`} title={formatDateTime(e.receivedAt)}>
                  {timeAgo(e.receivedAt)}
                </td>
                <td className={`${td} whitespace-nowrap text-steel-600`}>{e.source}</td>
                <td className={td}>
                  <InlineSelect
                    label="Assign"
                    value={e.assignee ?? UNASSIGNED}
                    options={[UNASSIGNED, ...TEAM]}
                    onChange={(x) => {
                      updateEnquiry(e.id, { assignee: x === UNASSIGNED ? undefined : x }, x === UNASSIGNED ? undefined : `${e.name} assigned to ${x}`)
                      toast(x === UNASSIGNED ? 'Unassigned' : `Assigned to ${x}`)
                    }}
                    className="w-40"
                  />
                </td>
                <td className={td}>
                  <InlineSelect label="Status" value={e.status} options={ENQUIRY_STATUSES} onChange={(x) => setStatusFor(e, x)} className="w-44" />
                </td>
                <td className={`${td} whitespace-nowrap tnum`}>
                  {e.followUp ? <span className={overdue ? 'font-medium text-bad' : dueToday ? 'font-medium text-warn' : ''}>{dueToday ? 'Today' : formatDate(e.followUp, false)}{overdue && ' · overdue'}</span> : <span className="text-steel-400">—</span>}
                </td>
              </tr>
            )
          })}
        </Table>
      )}

      <Drawer
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.name}
        subtitle={
          open && (
            <span className="tnum">
              {open.ref} · {open.type} · received {formatDateTime(open.receivedAt)}
            </span>
          )
        }
      >
        {open && <EnquiryDetail key={open.id} e={open} onStatus={(s) => setStatusFor(open, s)} onPatch={(p, t) => updateEnquiry(open.id, p, t)} onNote={(t) => { addNote('enquiries', open.id, t); toast('Note added') }} />}
      </Drawer>
    </div>
  )
}

function EnquiryDetail({ e, onStatus, onPatch, onNote }: { e: Enquiry; onStatus: (s: string) => void; onPatch: (p: Partial<Enquiry>, t?: string) => void; onNote: (t: string) => void }) {
  const { vehicleById } = useDemo()
  const toast = useToast()
  const veh = vehicleById(e.vehicleId)
  const phoneDigits = e.phone.replace(/\D/g, '')

  return (
    <div className="space-y-8">
      {e.isSimulated && <p className="rounded-[4px] bg-info-bg px-3.5 py-2.5 text-[13px] text-info">Submitted through the website during this demo session.</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs text-steel-500">Status</p>
          <InlineSelect label="Status" value={e.status} options={ENQUIRY_STATUSES} onChange={onStatus} className="w-full" />
        </div>
        <div>
          <p className="mb-1.5 text-xs text-steel-500">Assigned to</p>
          <InlineSelect
            label="Assign"
            value={e.assignee ?? UNASSIGNED}
            options={[UNASSIGNED, ...TEAM]}
            onChange={(x) => {
              onPatch({ assignee: x === UNASSIGNED ? undefined : x }, x === UNASSIGNED ? undefined : `${e.name} assigned to ${x}`)
              toast(x === UNASSIGNED ? 'Unassigned' : `Assigned to ${x}`)
            }}
            className="w-full"
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs text-steel-500">Next follow-up</p>
          <input
            type="date"
            value={e.followUp ?? ''}
            onChange={(x) => {
              onPatch({ followUp: x.target.value || undefined })
              if (x.target.value) toast('Follow-up set', { body: formatDate(x.target.value) })
            }}
            className="h-8 w-full rounded-[4px] border border-line bg-white px-2.5 text-[13px] focus:border-ink-900 focus:outline-none"
          />
        </div>
        <div className="flex items-end gap-1.5">
          {[1, 3, 7].map((d) => (
            <button
              key={d}
              onClick={() => {
                const dt = new Date()
                dt.setDate(dt.getDate() + d)
                const val = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
                onPatch({ followUp: val })
                toast('Follow-up set', { body: formatDate(val) })
              }}
              className="h-8 flex-1 rounded-[4px] border border-line bg-white text-[12px] text-steel-600 hover:border-ink-900 hover:text-ink-900"
            >
              +{d}d
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3 text-steel-500">Customer</p>
        <DetailGrid rows={[['Name', e.name], ['Phone', e.phone], ['Email', e.email], ['Source', e.source]]} />
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:${phoneDigits}`} className="inline-flex h-9 items-center gap-2 rounded-[4px] border border-line bg-white px-3 text-[13px] hover:border-ink-900">
            <Phone className="size-3.5" /> Call
          </a>
          <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-[4px] border border-line bg-white px-3 text-[13px] hover:border-ink-900">
            <MessageCircle className="size-3.5" /> WhatsApp
          </a>
          {e.email && (
            <a href={`mailto:${e.email}`} className="inline-flex h-9 items-center gap-2 rounded-[4px] border border-line bg-white px-3 text-[13px] hover:border-ink-900">
              <Mail className="size-3.5" /> Email
            </a>
          )}
        </div>
        <p className="mt-2 text-xs text-steel-500">Sample customers use fictional numbers.</p>
      </div>

      {e.message && (
        <div>
          <p className="eyebrow mb-3 text-steel-500">Message</p>
          <blockquote className="rounded-[4px] border-l-2 border-ink-900 bg-white px-4 py-3 text-[15px] leading-relaxed">{e.message}</blockquote>
        </div>
      )}

      <div>
        <p className="eyebrow mb-3 text-steel-500">Interested vehicle</p>
        {veh ? (
          <div className="flex gap-4 rounded-md bg-white p-3 ring-1 ring-line/80">
            <CarImage image={veh.images[0]} className="h-16 w-24 shrink-0 rounded-[3px]" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{vehicleTitle(veh)}</p>
              <p className="truncate text-xs text-steel-500">{veh.variant}</p>
              <p className="mt-1 flex items-center gap-2 text-sm tnum">
                {formatLakh(veh.price)} <AvailabilityBadge status={veh.status} />
              </p>
            </div>
            <Link to={`/cars/${veh.slug}`} target="_blank" className="self-start p-1 text-steel-500 hover:text-ink-900" title="View listing">
              <ExternalLink className="size-4" />
            </Link>
          </div>
        ) : (
          <p className="text-sm text-steel-500">Not linked to a specific vehicle.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {e.status === 'New' && (
          <Button size="sm" onClick={() => onStatus('Contacted')}>
            Mark as contacted
          </Button>
        )}
        {e.status !== 'Converted' && (
          <Button size="sm" variant="secondary" onClick={() => onStatus('Converted')}>
            Mark converted
          </Button>
        )}
        {e.status !== 'Lost' && (
          <Button size="sm" variant="ghost" onClick={() => onStatus('Lost')}>
            Mark lost
          </Button>
        )}
      </div>

      <NotesPanel notes={e.notes} onAdd={onNote} />
    </div>
  )
}
