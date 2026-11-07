import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import type { Availability, Vehicle } from '../../types'
import { SelectField, TextArea, TextField } from '../ui/Field'
import { Button } from '../ui/Button'
import { CarImage } from '../ui/CarImage'
import { hasErrors, required, type Errors } from '../../lib/validation'
import { formatLakh } from '../../lib/format'

const thisYear = new Date().getFullYear()
const YEARS = Array.from({ length: 25 }, (_, i) => String(thisYear - i))

interface Values {
  make: string
  model: string
  variant: string
  bodyType: string
  mfgYear: string
  regYear: string
  rto: string
  km: string
  fuel: string
  transmission: string
  owners: string
  price: string
  priceType: string
  status: Availability
  colour: string
  headline: string
  description: string
  imageUrl: string
  featured: boolean
}

const toValues = (v?: Vehicle): Values => ({
  make: v?.make ?? '',
  model: v?.model ?? '',
  variant: v?.variant ?? '',
  bodyType: v?.bodyType ?? '',
  mfgYear: v ? String(v.mfgYear) : '',
  regYear: v ? String(v.regYear) : '',
  rto: v?.rto ?? 'MH12',
  km: v ? String(v.km) : '',
  fuel: v?.fuel ?? '',
  transmission: v?.transmission ?? '',
  owners: v ? String(v.owners) : '1',
  price: v ? String(v.price) : '',
  priceType: v?.priceType ?? 'negotiable',
  status: v?.status ?? 'available',
  colour: v?.colour ?? '',
  headline: v?.headline ?? '',
  description: v?.description ?? '',
  imageUrl: '',
  featured: v?.featured ?? false,
})

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function fileToDataUrl(file: File, max = 1280): Promise<string> {
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
      resolve(c.toDataURL('image/jpeg', 0.78))
    }
    img.onerror = reject
    img.src = src
  })
}

export function VehicleForm({ vehicle, existing, onSave, onCancel }: { vehicle?: Vehicle; existing: Vehicle[]; onSave: (v: Vehicle) => void; onCancel: () => void }) {
  const [v, setV] = useState<Values>(() => toValues(vehicle))
  const [images, setImages] = useState(vehicle?.images ?? [])
  const [errors, setErrors] = useState<Errors<Values>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((x) => ({ ...x, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = () => {
    const km = Number(v.km)
    const price = Number(v.price)
    const errs: Errors<Values> = {
      make: required(v.make, 'Make'),
      model: required(v.model, 'Model'),
      variant: required(v.variant, 'Variant'),
      bodyType: required(v.bodyType, 'Body type'),
      mfgYear: required(v.mfgYear, 'Manufacturing year'),
      regYear: required(v.regYear, 'Registration year') ?? (+v.regYear < +v.mfgYear ? 'Can’t be before manufacturing year' : undefined),
      km: required(v.km, 'Kilometres') ?? (!Number.isFinite(km) || km < 0 || km > 900000 ? 'Enter a number between 0 and 9,00,000' : undefined),
      fuel: required(v.fuel, 'Fuel'),
      transmission: required(v.transmission, 'Transmission'),
      price: required(v.price, 'Price') ?? (!Number.isFinite(price) || price < 50000 ? 'Enter a price of at least ₹50,000' : price > 500000000 ? 'Price looks too high' : undefined),
      imageUrl: v.imageUrl && !/^https?:\/\/.+/i.test(v.imageUrl) ? 'Enter a full image URL starting with https://' : undefined,
    }
    setErrors(errs)
    if (hasErrors(errs)) return

    const nextCode = () => {
      const max = existing.reduce((m, x) => Math.max(m, parseInt(x.stockCode.replace(/\D/g, ''), 10) || 0), 0)
      return `CL-${String(max + 1).padStart(4, '0')}`
    }
    const stockCode = vehicle?.stockCode ?? nextCode()
    const finalImages = v.imageUrl ? [{ local: v.imageUrl, alt: `${v.make} ${v.model}` }, ...images] : images
    const base = vehicle ?? ({ highlights: [], features: [], verifiedFields: [], isSample: true } as unknown as Vehicle)
    const out: Vehicle = {
      ...base,
      id: vehicle?.id ?? stockCode,
      stockCode,
      slug: vehicle?.slug ?? `${slugify(`${v.make} ${v.model} ${v.variant} ${v.mfgYear}`)}-${stockCode.toLowerCase().replace('cl-', '')}`,
      make: v.make.trim(),
      model: v.model.trim(),
      variant: v.variant.trim(),
      bodyType: v.bodyType as Vehicle['bodyType'],
      mfgYear: +v.mfgYear,
      regYear: +v.regYear,
      rto: v.rto.trim() || undefined,
      km,
      fuel: v.fuel as Vehicle['fuel'],
      transmission: v.transmission as Vehicle['transmission'],
      owners: +v.owners,
      price,
      priceType: v.priceType,
      status: v.status,
      colour: v.colour.trim() || undefined,
      headline: v.headline.trim() || undefined,
      description: v.description.trim() || undefined,
      featured: v.featured,
      images: finalImages,
      addedAt: vehicle?.addedAt ?? new Date().toISOString(),
      isSample: true,
    }
    onSave(out)
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="eyebrow mb-4 text-steel-500">Vehicle</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Make" placeholder="e.g. Hyundai" value={v.make} onChange={(e) => set('make', e.target.value)} error={errors.make} />
          <TextField label="Model" placeholder="e.g. Creta" value={v.model} onChange={(e) => set('model', e.target.value)} error={errors.model} />
          <TextField label="Variant" wrapClass="sm:col-span-2" placeholder="e.g. SX (O) 1.5 Diesel AT" value={v.variant} onChange={(e) => set('variant', e.target.value)} error={errors.variant} />
          <SelectField label="Body type" placeholder="Select" options={['hatchback', 'sedan', 'suv', 'muv', 'coupe', 'convertible'].map((b) => ({ value: b, label: b === 'suv' || b === 'muv' ? b.toUpperCase() : b[0].toUpperCase() + b.slice(1) }))} value={v.bodyType} onChange={(e) => set('bodyType', e.target.value)} error={errors.bodyType} />
          <TextField label="Colour" optional value={v.colour} onChange={(e) => set('colour', e.target.value)} />
          <SelectField label="Manufacturing year" placeholder="Select" options={YEARS} value={v.mfgYear} onChange={(e) => set('mfgYear', e.target.value)} error={errors.mfgYear} />
          <SelectField label="Registration year" placeholder="Select" options={YEARS} value={v.regYear} onChange={(e) => set('regYear', e.target.value)} error={errors.regYear} />
          <TextField label="Kilometres" inputMode="numeric" value={v.km} onChange={(e) => set('km', e.target.value.replace(/\D/g, ''))} error={errors.km} />
          <TextField label="RTO" optional placeholder="MH12" value={v.rto} onChange={(e) => set('rto', e.target.value.toUpperCase())} />
          <SelectField label="Fuel" placeholder="Select" options={[{ value: 'petrol', label: 'Petrol' }, { value: 'diesel', label: 'Diesel' }, { value: 'cng', label: 'CNG' }, { value: 'electric', label: 'Electric' }, { value: 'hybrid', label: 'Hybrid' }]} value={v.fuel} onChange={(e) => set('fuel', e.target.value)} error={errors.fuel} />
          <SelectField label="Transmission" placeholder="Select" options={[{ value: 'manual', label: 'Manual' }, { value: 'automatic', label: 'Automatic' }]} value={v.transmission} onChange={(e) => set('transmission', e.target.value)} error={errors.transmission} />
          <SelectField label="Ownership" options={[{ value: '1', label: '1st owner' }, { value: '2', label: '2nd owner' }, { value: '3', label: '3rd owner' }, { value: '4', label: '4th owner+' }]} value={v.owners} onChange={(e) => set('owners', e.target.value)} />
        </div>
      </section>

      <section>
        <p className="eyebrow mb-4 text-steel-500">Pricing &amp; availability</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Asking price (₹)" inputMode="numeric" value={v.price} onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))} error={errors.price} hint={v.price && !errors.price ? formatLakh(Number(v.price)) : undefined} />
          <SelectField label="Price type" options={[{ value: 'negotiable', label: 'Negotiable' }, { value: 'fixed', label: 'Fixed' }]} value={v.priceType} onChange={(e) => set('priceType', e.target.value)} />
          <SelectField label="Availability" options={[{ value: 'available', label: 'Available' }, { value: 'reserved', label: 'Reserved' }, { value: 'sold', label: 'Sold' }]} value={v.status} onChange={(e) => set('status', e.target.value as Availability)} />
          <label className="flex items-center gap-3 self-end pb-3.5 text-sm">
            <input type="checkbox" checked={v.featured} onChange={(e) => set('featured', e.target.checked)} className="size-4 accent-ink-900" />
            Feature on homepage
          </label>
        </div>
      </section>

      <section>
        <p className="eyebrow mb-4 text-steel-500">Listing</p>
        <div className="grid gap-4">
          <TextField label="Headline" optional placeholder="e.g. One owner, full service history" value={v.headline} onChange={(e) => set('headline', e.target.value)} />
          <TextArea label="Description" optional rows={4} value={v.description} onChange={(e) => set('description', e.target.value)} />
        </div>
      </section>

      <section>
        <p className="eyebrow mb-4 text-steel-500">Photos</p>
        {images.length > 0 && (
          <ul className="mb-4 grid grid-cols-3 gap-3">
            {images.map((im, i) => (
              <li key={i} className="relative overflow-hidden rounded-[4px]">
                <CarImage image={im} className="aspect-[4/3]" />
                <button type="button" onClick={() => setImages((xs) => xs.filter((_, j) => j !== i))} aria-label="Remove photo" className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-ink-950/70 text-paper">
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []).slice(0, 6)
            const urls = await Promise.all(files.map((f) => fileToDataUrl(f).catch(() => '')))
            setImages((xs) => [...xs, ...urls.filter(Boolean).map((u) => ({ local: u, alt: `${v.make} ${v.model}` }))])
            if (fileRef.current) fileRef.current.value = ''
          }}
        />
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
          <Button variant="secondary" onClick={() => fileRef.current?.click()} className="h-12">
            <ImagePlus className="size-4" strokeWidth={1.5} /> Add photos
          </Button>
          <TextField label="…or image URL" optional placeholder="https://" value={v.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} error={errors.imageUrl} />
        </div>
        <p className="mt-2 text-xs text-steel-500">Demo: photos are kept in this browser. Without a photo, the listing shows a neutral placeholder.</p>
      </section>

      <div className="sticky bottom-0 -mx-5 flex justify-end gap-2 border-t border-line bg-paper px-5 py-3.5 sm:-mx-6 sm:px-6">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={submit}>{vehicle ? 'Save changes' : 'Add vehicle'}</Button>
      </div>
    </div>
  )
}
