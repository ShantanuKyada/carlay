import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import type { Vehicle } from '../../types'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../ui/Toast'
import { SelectField, TextArea, TextField } from '../ui/Field'
import { Button } from '../ui/Button'
import { SubmittedNotice } from './SubmittedNotice'
import { TIME_SLOTS } from '../../data/seed'
import { addDays, ymd } from '../../lib/dates'
import { emailError, hasErrors, phoneError, required, type Errors } from '../../lib/validation'
import { formatDate, vehicleTitle } from '../../lib/format'

interface Values {
  vehicleId: string
  name: string
  phone: string
  email: string
  date: string
  slot: string
  notes: string
}

/** Deterministic "busy" slots so the calendar looks realistic. */
function busy(date: string, slot: string, vehicleId: string) {
  const s = `${date}${slot}${vehicleId}`
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h % 4 === 0
}

export function TestDriveForm({ vehicle, onDone, compact = false }: { vehicle?: Vehicle; onDone?: () => void; compact?: boolean }) {
  const { state, addTestDrive, testDriveTaken } = useTestDriveHelpers()
  const toast = useToast()
  const [v, setV] = useState<Values>({ vehicleId: vehicle?.id ?? '', name: '', phone: '', email: '', date: '', slot: '', notes: '' })
  const [errors, setErrors] = useState<Errors<Values>>({})
  const [done, setDone] = useState<{ ref: string; id: string; date: string; slot: string; vehicle?: Vehicle } | null>(null)

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)), [])
  const bookable = state.vehicles.filter((x) => x.status === 'available')
  const selected = state.vehicles.find((x) => x.id === v.vehicleId)

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((x) => ({ ...x, [k]: val, ...(k === 'date' || k === 'vehicleId' ? { slot: '' } : {}) }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Errors<Values> = {
      vehicleId: required(v.vehicleId, 'Vehicle'),
      name: required(v.name, 'Name'),
      phone: phoneError(v.phone),
      email: emailError(v.email),
      date: required(v.date, 'Preferred date'),
      slot: v.date ? required(v.slot, 'Time slot') : undefined,
    }
    setErrors(errs)
    if (hasErrors(errs)) return
    const td = addTestDrive({ vehicleId: v.vehicleId, name: v.name.trim(), phone: v.phone.trim(), email: v.email.trim() || undefined, date: v.date, slot: v.slot, notes: v.notes.trim() || undefined })
    setDone({ ref: td.ref, id: td.id, date: v.date, slot: v.slot, vehicle: selected })
    toast('Test-drive request received (demo)', { body: `${formatDate(v.date)} · ${v.slot}` })
    onDone?.()
  }

  if (done)
    return (
      <SubmittedNotice title="Your test-drive request is in." reference={done.ref} dashboardLink={`/admin/test-drives?open=${done.id}`}>
        <p>
          <strong className="font-medium text-ink-900">{done.vehicle ? `${vehicleTitle(done.vehicle)} ${done.vehicle.variant}` : ''}</strong>
          <br />
          Preferred: {formatDate(done.date)} at {done.slot}
        </p>
        <p>This is a request, not a confirmed booking. In the live version, the Carlay team would call to confirm a time that works.</p>
      </SubmittedNotice>
    )

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {vehicle ? (
        <div className="rounded-[4px] border border-line bg-paper-2/60 px-4 py-3 text-sm">
          <span className="eyebrow mr-2 text-steel-500">Vehicle</span>
          <span className="font-medium">
            {vehicleTitle(vehicle)} {vehicle.variant}
          </span>
        </div>
      ) : (
        <Step n={1} title="Select a vehicle" compact={compact}>
          <SelectField
            label="Vehicle"
            placeholder="Choose an available car"
            options={bookable.map((x) => ({ value: x.id, label: `${vehicleTitle(x)} ${x.variant}` }))}
            value={v.vehicleId}
            onChange={(e) => set('vehicleId', e.target.value)}
            error={errors.vehicleId}
            hint="Only available cars can be booked. Reserved and sold cars are not listed."
          />
        </Step>
      )}

      <Step n={vehicle ? 1 : 2} title="Your details" compact={compact}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
          <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxx xxxxx" value={v.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
          <TextField label="Email" optional type="email" autoComplete="email" wrapClass="sm:col-span-2" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
        </div>
      </Step>

      <Step n={vehicle ? 2 : 3} title="Preferred date" compact={compact}>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {days.map((d) => {
            const key = ymd(d)
            const active = v.date === key
            return (
              <button
                type="button"
                key={key}
                onClick={() => set('date', key)}
                aria-pressed={active}
                className={`flex w-16 shrink-0 flex-col items-center rounded-[4px] border py-2.5 transition-colors ${
                  active ? 'border-ink-900 bg-ink-900 text-paper' : 'border-line bg-white hover:border-steel-400'
                }`}
              >
                <span className={`text-[11px] tracking-wider uppercase ${active ? 'text-steel-300' : 'text-steel-500'}`}>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                <span className="mt-0.5 font-display text-lg font-semibold tnum">{d.getDate()}</span>
                <span className={`text-[11px] ${active ? 'text-steel-300' : 'text-steel-500'}`}>{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
              </button>
            )
          })}
        </div>
        {errors.date && <ErrorLine text={errors.date} />}
      </Step>

      <Step n={vehicle ? 3 : 4} title="Time slot" compact={compact}>
        {!v.date ? (
          <p className="text-sm text-steel-500">Choose a date to see times.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((s) => {
              const taken = busy(v.date, s, v.vehicleId) || testDriveTaken(v.vehicleId, v.date, s)
              const active = v.slot === s
              return (
                <button
                  type="button"
                  key={s}
                  disabled={taken}
                  onClick={() => set('slot', s)}
                  aria-pressed={active}
                  className={`h-11 rounded-[4px] border text-sm tnum transition-colors ${
                    taken
                      ? 'cursor-not-allowed border-line bg-paper-2 text-steel-400 line-through'
                      : active
                        ? 'border-ink-900 bg-ink-900 text-paper'
                        : 'border-line bg-white hover:border-steel-400'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        )}
        {errors.slot && <ErrorLine text={errors.slot} />}
        <p className="mt-2 text-xs text-steel-500">Times shown are illustrative. Actual availability would be confirmed by the Carlay team.</p>
      </Step>

      <TextArea label="Anything we should know?" optional rows={3} value={v.notes} onChange={(e) => set('notes', e.target.value)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-steel-500">Simulated request — stored in this browser only.</p>
        <Button type="submit" size="lg" className="sm:min-w-52">
          Request test drive
        </Button>
      </div>
    </form>
  )
}

function useTestDriveHelpers() {
  const { state, addTestDrive } = useDemo()
  const testDriveTaken = (vehicleId: string, date: string, slot: string) =>
    state.testDrives.some((t) => t.vehicleId === vehicleId && t.date === date && t.slot === slot && t.status !== 'Cancelled')
  return { state, addTestDrive, testDriveTaken }
}

function Step({ n, title, children, compact }: { n: number; title: string; children: ReactNode; compact?: boolean }) {
  return (
    <section>
      <h3 className={`mb-3 flex items-center gap-3 font-display font-semibold tracking-tight ${compact ? 'text-sm' : 'text-base'}`}>
        <span className="flex size-6 items-center justify-center rounded-full border border-ink-900/80 text-[11px] font-semibold tnum">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function ErrorLine({ text }: { text: string }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-[13px] text-bad">
      <AlertCircle className="size-3.5" />
      {text}
    </p>
  )
}
