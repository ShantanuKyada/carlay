import { useState, type FormEvent } from 'react'
import { PageHeader } from '../../components/site/SiteLayout'
import { Choice, SelectField, TextArea, TextField } from '../../components/ui/Field'
import { Button, ButtonLink } from '../../components/ui/Button'
import { SubmittedNotice } from '../../components/site/SubmittedNotice'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../../components/ui/Toast'
import { emailError, hasErrors, phoneError, required, type Errors } from '../../lib/validation'
import { formatLakh } from '../../lib/format'

const BUDGET = [300000, 500000, 700000, 1000000, 1500000, 2000000, 3000000, 5000000, 7500000, 10000000, 20000000]
const thisYear = new Date().getFullYear()

interface Values {
  makeModel: string
  budgetMin: string
  budgetMax: string
  yearFrom: string
  maxKm: string
  fuel: string
  transmission: string
  requirements: string
  name: string
  phone: string
  email: string
}

export default function FindMyCar() {
  const { addSourcingRequest } = useDemo()
  const toast = useToast()
  const [v, setV] = useState<Values>({ makeModel: '', budgetMin: '', budgetMax: '', yearFrom: '', maxKm: '', fuel: 'Any', transmission: 'Any', requirements: '', name: '', phone: '', email: '' })
  const [errors, setErrors] = useState<Errors<Values>>({})
  const [done, setDone] = useState<{ ref: string; id: string } | null>(null)

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((x) => ({ ...x, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Errors<Values> = {
      makeModel: required(v.makeModel, 'Make and model'),
      budgetMax: required(v.budgetMax, 'Maximum budget') ?? (v.budgetMin && +v.budgetMin > +v.budgetMax ? 'Maximum must be higher than minimum' : undefined),
      name: required(v.name, 'Name'),
      phone: phoneError(v.phone),
      email: emailError(v.email),
    }
    setErrors(errs)
    if (hasErrors(errs)) {
      toast('Please check the highlighted fields', { tone: 'error' })
      return
    }
    const r = addSourcingRequest({
      makeModel: v.makeModel.trim(),
      budgetMin: v.budgetMin ? +v.budgetMin : undefined,
      budgetMax: +v.budgetMax,
      yearFrom: v.yearFrom ? +v.yearFrom : undefined,
      maxKm: v.maxKm ? +v.maxKm : undefined,
      fuel: v.fuel,
      transmission: v.transmission,
      requirements: v.requirements.trim() || undefined,
      name: v.name.trim(),
      phone: v.phone.trim(),
      email: v.email.trim() || undefined,
    })
    setDone({ ref: r.ref, id: r.id })
    toast('Request received (demo)', { body: `Reference ${r.ref}` })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageHeader eyebrow="Find my car" title="Can’t find the right car?" intro="Tell us what you’re looking for. The Carlay team can keep an eye out and get in touch if a suitable car comes in." />
      <section className="container-x py-12 lg:py-16">
        <div className="mx-auto max-w-3xl rounded-md bg-white p-6 ring-1 ring-line/70 sm:p-10">
          {done ? (
            <SubmittedNotice
              title="Got it. We’ll keep an eye out."
              reference={done.ref}
              dashboardLink={`/admin/sourcing?open=${done.id}`}
              actions={
                <ButtonLink to="/cars" variant="secondary">
                  Browse current cars
                </ButtonLink>
              }
            >
              <p>
                You’re looking for a <strong className="font-medium text-ink-900">{v.makeModel}</strong> up to {formatLakh(+v.budgetMax)}. In the live version, the team would contact you if a matching car becomes available. There is no guarantee a match will be found.
              </p>
            </SubmittedNotice>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-10">
              <fieldset className="space-y-5">
                <legend className="font-display text-xl font-semibold tracking-tight">The car</legend>
                <TextField label="Preferred make and model" placeholder="e.g. Toyota Fortuner, or ‘any 7-seater SUV’" value={v.makeModel} onChange={(e) => set('makeModel', e.target.value)} error={errors.makeModel} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField label="Budget from" optional placeholder="No minimum" options={BUDGET.map((b) => ({ value: String(b), label: formatLakh(b) }))} value={v.budgetMin} onChange={(e) => set('budgetMin', e.target.value)} />
                  <SelectField label="Budget up to" placeholder="Select maximum" options={BUDGET.map((b) => ({ value: String(b), label: formatLakh(b) }))} value={v.budgetMax} onChange={(e) => set('budgetMax', e.target.value)} error={errors.budgetMax} />
                  <SelectField label="Manufactured in or after" optional placeholder="Any year" options={Array.from({ length: 12 }, (_, i) => String(thisYear - i))} value={v.yearFrom} onChange={(e) => set('yearFrom', e.target.value)} />
                  <SelectField label="Maximum kilometres" optional placeholder="Any" options={[20000, 40000, 60000, 80000, 100000].map((k) => ({ value: String(k), label: `${k.toLocaleString('en-IN')} km` }))} value={v.maxKm} onChange={(e) => set('maxKm', e.target.value)} />
                </div>
                <Choice label="Fuel type" options={['Any', 'Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] as const} value={v.fuel as never} onChange={(x) => set('fuel', x)} />
                <Choice label="Transmission" options={['Any', 'Manual', 'Automatic'] as const} value={v.transmission as never} onChange={(x) => set('transmission', x)} />
                <TextArea label="Additional requirements" optional placeholder="Colour, features, timeline, exchange of your current car…" value={v.requirements} onChange={(e) => set('requirements', e.target.value)} />
              </fieldset>
              <fieldset className="space-y-5 border-t border-line pt-10">
                <legend className="font-display text-xl font-semibold tracking-tight">Your details</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="Full name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
                  <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxx xxxxx" value={v.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
                  <TextField label="Email" optional type="email" autoComplete="email" wrapClass="sm:col-span-2" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
                </div>
              </fieldset>
              <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-steel-500">Demo form — stored in this browser only.</p>
                <Button type="submit" size="lg">
                  Submit request
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
