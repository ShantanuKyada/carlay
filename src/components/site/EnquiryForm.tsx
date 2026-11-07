import { useState, type FormEvent } from 'react'
import type { EnquiryType, Vehicle } from '../../types'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../ui/Toast'
import { SelectField, TextArea, TextField } from '../ui/Field'
import { Button } from '../ui/Button'
import { SubmittedNotice } from './SubmittedNotice'
import { emailError, hasErrors, phoneError, required, type Errors } from '../../lib/validation'
import { vehicleTitle } from '../../lib/format'

const TYPES: EnquiryType[] = ['General enquiry', 'Price / negotiation', 'Finance', 'Exchange', 'Callback']

interface Values {
  name: string
  phone: string
  email: string
  type: EnquiryType
  message: string
  vehicleId: string
}

export function EnquiryForm({ vehicle, allowVehiclePick = false, onDone }: { vehicle?: Vehicle; allowVehiclePick?: boolean; onDone?: () => void }) {
  const { addEnquiry, state } = useDemo()
  const toast = useToast()
  const [v, setV] = useState<Values>({
    name: '',
    phone: '',
    email: '',
    type: 'General enquiry',
    message: vehicle ? `Hi, I'm interested in the ${vehicleTitle(vehicle)} ${vehicle.variant}. Is it still available?` : '',
    vehicleId: vehicle?.id ?? '',
  })
  const [errors, setErrors] = useState<Errors<Values>>({})
  const [done, setDone] = useState<{ ref: string; id: string } | null>(null)

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((x) => ({ ...x, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Errors<Values> = {
      name: required(v.name, 'Name'),
      phone: phoneError(v.phone),
      email: emailError(v.email),
      message: v.type === 'Callback' ? undefined : required(v.message, 'Message'),
    }
    setErrors(errs)
    if (hasErrors(errs)) return
    const enq = addEnquiry({
      name: v.name.trim(),
      phone: v.phone.trim(),
      email: v.email.trim() || undefined,
      type: v.type,
      message: v.message.trim() || undefined,
      vehicleId: v.vehicleId || undefined,
      source: 'Website',
    })
    setDone({ ref: enq.ref, id: enq.id })
    toast('Enquiry received (demo)', { body: `Reference ${enq.ref}` })
    onDone?.()
  }

  if (done)
    return (
      <SubmittedNotice title="Thank you — your enquiry is in." reference={done.ref} dashboardLink={`/admin/enquiries?open=${done.id}`}>
        <p>In the live version, the Carlay team would review your enquiry and get back to you by phone or WhatsApp.</p>
      </SubmittedNotice>
    )

  const vehicleOptions = state.vehicles.filter((x) => x.status !== 'sold').map((x) => ({ value: x.id, label: `${vehicleTitle(x)} ${x.variant}` }))

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {vehicle && (
        <div className="rounded-[4px] border border-line bg-paper-2/60 px-4 py-3 text-sm">
          <span className="eyebrow mr-2 text-steel-500">Enquiring about</span>
          <span className="font-medium">
            {vehicleTitle(vehicle)} {vehicle.variant}
          </span>
        </div>
      )}
      {allowVehiclePick && !vehicle && (
        <SelectField label="Vehicle" optional options={vehicleOptions} placeholder="Not about a specific car" value={v.vehicleId} onChange={(e) => set('vehicleId', e.target.value)} />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxx xxxxx" value={v.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Email" optional type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
        <SelectField label="I’d like to" options={TYPES.map((t) => ({ value: t, label: t === 'Callback' ? 'Request a callback' : t === 'General enquiry' ? 'Ask a question' : t === 'Price / negotiation' ? 'Discuss the price' : t === 'Finance' ? 'Ask about finance' : 'Ask about exchange' }))} value={v.type} onChange={(e) => set('type', e.target.value as EnquiryType)} />
      </div>
      <TextArea label="Message" optional={v.type === 'Callback'} value={v.message} onChange={(e) => set('message', e.target.value)} error={errors.message} />
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-steel-500">Demo form — your details stay in this browser and are not sent anywhere.</p>
        <Button type="submit" size="lg" className="sm:min-w-44">
          Send enquiry
        </Button>
      </div>
    </form>
  )
}
