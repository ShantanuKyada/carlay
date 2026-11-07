import { useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ImagePlus, X, Check, Pencil } from 'lucide-react'
import { PageHeader } from '../../components/site/SiteLayout'
import { Choice, SelectField, TextArea, TextField } from '../../components/ui/Field'
import { Button, ButtonLink } from '../../components/ui/Button'
import { SubmittedNotice } from '../../components/site/SubmittedNotice'
import { useDemo } from '../../store/DemoStore'
import { useToast } from '../../components/ui/Toast'
import { emailError, hasErrors, phoneError, required, type Errors } from '../../lib/validation'
import { formatINR, formatKm, fuelLabel } from '../../lib/format'
import type { Fuel, Transmission } from '../../types'

const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Škoda', 'Volkswagen', 'MG', 'Renault', 'Nissan', 'Jeep', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Jaguar', 'Land Rover', 'Porsche', 'Lexus', 'Other']
const thisYear = new Date().getFullYear()
const YEARS = Array.from({ length: 25 }, (_, i) => String(thisYear - i))
const STEPS = ['Vehicle', 'Condition', 'Photos', 'Contact', 'Review'] as const
const MAX_PHOTOS = 12

interface Values {
  brand: string
  model: string
  variant: string
  mfgYear: string
  regYear: string
  km: string
  fuel: string
  transmission: string
  owners: string
  askingPrice: string
  accidentHistory: string
  serviceHistory: string
  insuranceValid: string
  registrationValid: string
  loan: string
  conditionNotes: string
  name: string
  phone: string
  email: string
  preferredContact: string
}

const initial: Values = {
  brand: '', model: '', variant: '', mfgYear: '', regYear: '', km: '', fuel: '', transmission: '', owners: '', askingPrice: '',
  accidentHistory: '', serviceHistory: '', insuranceValid: '', registrationValid: '', loan: '', conditionNotes: '',
  name: '', phone: '', email: '', preferredContact: '',
}

interface Photo {
  name: string
  url: string
}

/** Downscale an image file to a small JPEG preview (keeps localStorage small). */
function toPreview(file: File, max = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const src = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale)
      c.height = Math.round(img.height * scale)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(src)
      resolve(c.toDataURL('image/jpeg', 0.72))
    }
    img.onerror = () => reject(new Error('Unreadable image'))
    img.src = src
  })
}

export default function SellCar() {
  const { addSellRequest } = useDemo()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [v, setV] = useState<Values>(initial)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photoError, setPhotoError] = useState('')
  const [errors, setErrors] = useState<Errors<Values>>({})
  const [done, setDone] = useState<{ ref: string; id: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((x) => ({ ...x, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = (s: number): Errors<Values> => {
    if (s === 0) {
      const km = Number(v.km.replace(/,/g, ''))
      return {
        brand: required(v.brand, 'Brand'),
        model: required(v.model, 'Model'),
        mfgYear: required(v.mfgYear, 'Manufacturing year'),
        regYear: required(v.regYear, 'Registration year') ?? (v.mfgYear && +v.regYear < +v.mfgYear ? 'Registration year can’t be before manufacturing year' : undefined),
        km: required(v.km, 'Kilometres') ?? (isNaN(km) || km < 0 || km > 900000 ? 'Enter kilometres as a number' : undefined),
        fuel: required(v.fuel, 'Fuel type'),
        transmission: required(v.transmission, 'Transmission'),
        owners: required(v.owners, 'Ownership'),
        askingPrice: v.askingPrice && isNaN(Number(v.askingPrice.replace(/,/g, ''))) ? 'Enter the price as a number' : undefined,
      }
    }
    if (s === 1)
      return {
        accidentHistory: required(v.accidentHistory, 'Accident history'),
        serviceHistory: required(v.serviceHistory, 'Service history'),
        insuranceValid: required(v.insuranceValid, 'Insurance'),
        registrationValid: required(v.registrationValid, 'Registration'),
        loan: required(v.loan, 'Loan status'),
      }
    if (s === 3)
      return {
        name: required(v.name, 'Name'),
        phone: phoneError(v.phone),
        email: emailError(v.email, v.preferredContact !== 'Email'),
        preferredContact: required(v.preferredContact, 'Preferred contact method'),
      }
    return {}
  }

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const next = () => {
    const errs = validate(step)
    setErrors(errs)
    if (hasErrors(errs)) {
      toast('Please check the highlighted fields', { tone: 'error' })
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    scrollTop()
  }
  const back = () => {
    setStep((s) => Math.max(0, s - 1))
    scrollTop()
  }
  const goto = (s: number) => {
    setStep(s)
    scrollTop()
  }

  const onFiles = async (files: FileList | null) => {
    if (!files) return
    setPhotoError('')
    const list = Array.from(files).filter((f) => /^image\/(jpeg|png|webp|heic|heif)$/.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name))
    if (list.length < files.length) setPhotoError('Some files were skipped — please choose JPG, PNG or WebP images.')
    const room = MAX_PHOTOS - photos.length
    if (list.length > room) setPhotoError(`You can add up to ${MAX_PHOTOS} photos in this demo.`)
    const out: Photo[] = []
    for (const f of list.slice(0, room)) {
      try {
        out.push({ name: f.name, url: await toPreview(f) })
      } catch {
        setPhotoError(`Couldn’t read ${f.name}. Try a JPG or PNG.`)
      }
    }
    setPhotos((p) => [...p, ...out])
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = () => {
    for (const s of [0, 1, 3]) {
      const errs = validate(s)
      if (hasErrors(errs)) {
        setErrors(errs)
        goto(s)
        toast('Some details are missing', { tone: 'error' })
        return
      }
    }
    const req = addSellRequest({
      brand: v.brand,
      model: v.model.trim(),
      variant: v.variant.trim() || undefined,
      mfgYear: +v.mfgYear,
      regYear: +v.regYear,
      km: Number(v.km.replace(/,/g, '')),
      fuel: v.fuel.toLowerCase() as Fuel,
      transmission: v.transmission.toLowerCase() as Transmission,
      owners: v.owners,
      askingPrice: v.askingPrice ? Number(v.askingPrice.replace(/,/g, '')) : undefined,
      accidentHistory: v.accidentHistory,
      serviceHistory: v.serviceHistory,
      insuranceValid: v.insuranceValid,
      registrationValid: v.registrationValid,
      loan: v.loan,
      conditionNotes: v.conditionNotes.trim() || undefined,
      photos: photos.map((p) => p.url),
      photoCount: photos.length,
      name: v.name.trim(),
      phone: v.phone.trim(),
      email: v.email.trim() || undefined,
      preferredContact: v.preferredContact,
    })
    setDone({ ref: req.ref, id: req.id })
    toast('Request submitted (demo)', { body: `Reference ${req.ref}` })
    scrollTop()
  }

  return (
    <>
      <PageHeader
        eyebrow="Sell your car"
        title="Tell us about your car."
        intro="Five short steps, no sign-in. The Carlay team reviews what you share and gets in touch to discuss next steps."
      />
      <div ref={topRef} className="scroll-mt-16" />
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            {done ? (
              <div className="rounded-md bg-white p-6 ring-1 ring-line/70 sm:p-10">
                <SubmittedNotice
                  title="Thank you. Your car details are with us."
                  reference={done.ref}
                  dashboardLink={`/admin/sell-requests?open=${done.id}`}
                  actions={
                    <ButtonLink to="/cars" variant="secondary">
                      Browse cars
                    </ButtonLink>
                  }
                >
                  <p>
                    Carlay will review the information and photos you submitted and contact you by <strong className="font-medium text-ink-900">{v.preferredContact.toLowerCase()}</strong> to discuss the next steps.
                  </p>
                  <p>No valuation or offer is generated automatically — any price discussion happens with the team after review.</p>
                </SubmittedNotice>
              </div>
            ) : (
              <>
                <Progress step={step} onJump={(s) => s < step && goto(s)} />
                <div className="mt-8 rounded-md bg-white p-6 ring-1 ring-line/70 sm:p-10">
                  <div key={step} className="animate-fade-up">
                    {step === 0 && (
                      <StepBody title="Vehicle information" intro="The basics, as they appear on the registration certificate if you have it handy.">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <SelectField label="Brand" placeholder="Select brand" options={BRANDS} value={v.brand} onChange={(e) => set('brand', e.target.value)} error={errors.brand} />
                          <TextField label="Model" placeholder="e.g. Creta" value={v.model} onChange={(e) => set('model', e.target.value)} error={errors.model} />
                          <TextField label="Variant" optional placeholder="e.g. SX (O) 1.5 Diesel" wrapClass="sm:col-span-2" value={v.variant} onChange={(e) => set('variant', e.target.value)} />
                          <SelectField label="Manufacturing year" placeholder="Select year" options={YEARS} value={v.mfgYear} onChange={(e) => set('mfgYear', e.target.value)} error={errors.mfgYear} />
                          <SelectField label="Registration year" placeholder="Select year" options={YEARS} value={v.regYear} onChange={(e) => set('regYear', e.target.value)} error={errors.regYear} />
                          <TextField label="Kilometres driven" inputMode="numeric" placeholder="e.g. 42000" value={v.km} onChange={(e) => set('km', e.target.value.replace(/[^\d,]/g, ''))} error={errors.km} />
                          <TextField label="Asking price (₹)" optional inputMode="numeric" placeholder="If you have one in mind" hint="Leave blank if you’re not sure." value={v.askingPrice} onChange={(e) => set('askingPrice', e.target.value.replace(/[^\d,]/g, ''))} error={errors.askingPrice} />
                        </div>
                        <div className="mt-6 grid gap-6">
                          <Choice label="Fuel type" options={['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] as const} value={v.fuel as never} onChange={(x) => set('fuel', x)} error={errors.fuel} />
                          <Choice label="Transmission" options={['Manual', 'Automatic'] as const} value={v.transmission as never} onChange={(x) => set('transmission', x)} error={errors.transmission} />
                          <Choice label="Ownership" options={['1st owner', '2nd owner', '3rd owner', '4th owner or more'] as const} value={v.owners as never} onChange={(x) => set('owners', x)} error={errors.owners} />
                        </div>
                      </StepBody>
                    )}

                    {step === 1 && (
                      <StepBody title="Condition" intro="Honest answers help the team give you useful advice. Nothing here is a commitment.">
                        <div className="grid gap-6">
                          <Choice label="Accident history" options={['No accidents', 'Minor — disclosed', 'Major — disclosed', 'Not sure'] as const} value={v.accidentHistory as never} onChange={(x) => set('accidentHistory', x)} error={errors.accidentHistory} />
                          <Choice label="Service history" options={['Full authorised service history', 'Partial records', 'No records'] as const} value={v.serviceHistory as never} onChange={(x) => set('serviceHistory', x)} error={errors.serviceHistory} />
                          <div className="grid gap-6 sm:grid-cols-2">
                            <Choice label="Insurance" options={['Valid', 'Expired', 'Not sure'] as const} value={v.insuranceValid as never} onChange={(x) => set('insuranceValid', x)} error={errors.insuranceValid} />
                            <Choice label="Registration" options={['Valid', 'Expired', 'Not sure'] as const} value={v.registrationValid as never} onChange={(x) => set('registrationValid', x)} error={errors.registrationValid} />
                          </div>
                          <Choice label="Existing loan on the car" options={['No loan', 'Loan running', 'Loan closed — NOC pending'] as const} value={v.loan as never} onChange={(x) => set('loan', x)} error={errors.loan} />
                          <TextArea label="General condition notes" optional placeholder="Scratches, dents, recent repairs, new tyres, anything worth mentioning…" value={v.conditionNotes} onChange={(e) => set('conditionNotes', e.target.value)} />
                        </div>
                      </StepBody>
                    )}

                    {step === 2 && (
                      <StepBody title="Photos" intro="Add a few clear photos — front, side, rear, interior and odometer work best. Optional, but helpful.">
                        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault()
                            onFiles(e.dataTransfer.files)
                          }}
                          className="flex w-full flex-col items-center justify-center rounded-md border border-dashed border-steel-300 bg-paper/60 px-6 py-12 text-center transition-colors hover:border-ink-900 hover:bg-paper"
                        >
                          <ImagePlus className="size-7 text-steel-500" strokeWidth={1.25} />
                          <span className="mt-3 font-medium">Choose photos</span>
                          <span className="mt-1 text-sm text-steel-500">or drag and drop · JPG, PNG or WebP · up to {MAX_PHOTOS}</span>
                        </button>
                        {photoError && <p className="mt-3 text-[13px] text-bad">{photoError}</p>}
                        {photos.length > 0 && (
                          <>
                            <p className="mt-6 text-sm text-steel-600 tnum">
                              {photos.length} of {MAX_PHOTOS} selected
                            </p>
                            <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                              {photos.map((p, i) => (
                                <li key={i} className="group relative overflow-hidden rounded-[4px] bg-paper-2">
                                  <img src={p.url} alt={p.name} className="aspect-[4/3] w-full object-cover" />
                                  {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-[3px] bg-ink-950/75 px-1.5 py-0.5 text-[10px] tracking-wide text-paper uppercase">Cover</span>}
                                  <button type="button" onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))} aria-label={`Remove ${p.name}`} className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-ink-950/70 text-paper hover:bg-ink-950">
                                    <X className="size-3.5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        <p className="mt-6 text-xs text-steel-500">Demo: photos are previewed and stored in this browser only. They are not uploaded anywhere.</p>
                      </StepBody>
                    )}

                    {step === 3 && (
                      <StepBody title="Contact information" intro="How should the Carlay team get in touch with you?">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <TextField label="Full name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
                          <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxx xxxxx" value={v.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
                          <TextField label="Email" optional={v.preferredContact !== 'Email'} type="email" autoComplete="email" wrapClass="sm:col-span-2" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
                        </div>
                        <Choice className="mt-6" label="Preferred contact method" options={['Phone call', 'WhatsApp', 'Email'] as const} value={v.preferredContact as never} onChange={(x) => set('preferredContact', x)} error={errors.preferredContact} />
                      </StepBody>
                    )}

                    {step === 4 && (
                      <StepBody title="Review and submit" intro="Check everything looks right. You can edit any section.">
                        <ReviewBlock title="Vehicle" onEdit={() => goto(0)} rows={[
                          ['Car', `${v.mfgYear} ${v.brand} ${v.model}${v.variant ? ` ${v.variant}` : ''}`],
                          ['Registration year', v.regYear],
                          ['Kilometres', v.km ? formatKm(Number(v.km.replace(/,/g, ''))) : '—'],
                          ['Fuel · transmission', `${fuelLabel(v.fuel.toLowerCase())} · ${v.transmission}`],
                          ['Ownership', v.owners],
                          ['Asking price', v.askingPrice ? formatINR(Number(v.askingPrice.replace(/,/g, ''))) : 'Not specified'],
                        ]} />
                        <ReviewBlock title="Condition" onEdit={() => goto(1)} rows={[
                          ['Accident history', v.accidentHistory],
                          ['Service history', v.serviceHistory],
                          ['Insurance · registration', `${v.insuranceValid} · ${v.registrationValid}`],
                          ['Loan', v.loan],
                          ['Notes', v.conditionNotes || '—'],
                        ]} />
                        <div className="border-b border-line py-5">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Photos</p>
                            <EditBtn onClick={() => goto(2)} />
                          </div>
                          {photos.length ? (
                            <div className="mt-3 flex gap-2 overflow-x-auto">
                              {photos.map((p, i) => (
                                <img key={i} src={p.url} alt="" className="h-16 w-20 shrink-0 rounded-[3px] object-cover" />
                              ))}
                            </div>
                          ) : (
                            <p className="mt-1 text-sm text-steel-500">No photos added</p>
                          )}
                        </div>
                        <ReviewBlock title="Contact" onEdit={() => goto(3)} rows={[
                          ['Name', v.name],
                          ['Mobile', v.phone],
                          ['Email', v.email || '—'],
                          ['Preferred contact', v.preferredContact],
                        ]} />
                        <p className="mt-6 text-[13px] leading-relaxed text-steel-500">
                          By submitting, you agree that Carlay may contact you about this car. Demo: the request is simulated and stays in this browser.
                        </p>
                      </StepBody>
                    )}
                  </div>

                  <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
                    {step > 0 ? (
                      <Button variant="ghost" onClick={back}>
                        <ArrowLeft className="size-4" /> Back
                      </Button>
                    ) : (
                      <span />
                    )}
                    {step < STEPS.length - 1 ? (
                      <Button size="lg" onClick={next}>
                        {step === 2 && photos.length === 0 ? 'Skip for now' : 'Continue'} <ArrowRight className="size-4" />
                      </Button>
                    ) : (
                      <Button size="lg" onClick={submit}>
                        Submit request <Check className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md bg-ink-950 p-7 text-paper">
              <p className="eyebrow text-steel-400">What happens next</p>
              <ol className="mt-5 space-y-5 text-[15px]">
                {[
                  ['Review', 'The Carlay team looks over your details and photos.'],
                  ['Conversation', 'They contact you to talk through the car and your expectations.'],
                  ['Inspection', 'If it’s a fit, an inspection is arranged at a time that suits you.'],
                  ['Listing', 'Once agreed, your car is presented to buyers.'],
                ].map(([t, b], i) => (
                  <li key={t} className="grid grid-cols-[28px_1fr] gap-3">
                    <span className="text-sm text-steel-500 tnum">0{i + 1}</span>
                    <div>
                      <p className="font-medium">{t}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-steel-400">{b}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-steel-500">Process shown for illustration. Fees, timelines and terms are to be confirmed with Carlay.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function Progress({ step, onJump }: { step: number; onJump: (s: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium">
          Step <span className="tnum">{step + 1}</span> of {STEPS.length} · {STEPS[step]}
        </p>
        <p className="text-steel-500 tnum">{Math.round(((step + 1) / STEPS.length) * 100)}%</p>
      </div>
      <ol className="mt-4 grid grid-cols-5 gap-1.5">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" onClick={() => onJump(i)} disabled={i >= step} className="group block w-full text-left disabled:cursor-default" aria-label={`Step ${i + 1}: ${s}`}>
              <span className={`block h-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-ink-900' : 'bg-line'}`} />
              <span className={`mt-2 hidden text-xs sm:block ${i === step ? 'font-medium text-ink-900' : i < step ? 'text-steel-600 group-hover:text-ink-900' : 'text-steel-400'}`}>{s}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

function StepBody({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      {intro && <p className="mt-1.5 text-[15px] text-steel-600">{intro}</p>}
      <div className="mt-8">{children}</div>
    </div>
  )
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 text-sm text-steel-600 hover:text-ink-900">
      <Pencil className="size-3.5" /> Edit
    </button>
  )
}

function ReviewBlock({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <div className="border-b border-line py-5 first:pt-0">
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>
        <EditBtn onClick={onEdit} />
      </div>
      <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map(([k, val]) => (
          <div key={k} className="flex justify-between gap-4 sm:block">
            <dt className="text-steel-500">{k}</dt>
            <dd className="text-right font-medium sm:mt-0.5 sm:text-left">{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
