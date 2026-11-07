import { Link } from 'react-router-dom'
import { Gauge, Fuel, Cog, User, ArrowUpRight } from 'lucide-react'
import type { Vehicle } from '../../types'
import { CarImage } from '../ui/CarImage'
import { AvailabilityBadge } from '../ui/Badges'
import { formatKm, formatLakh, fuelLabel, ownerLabel, transmissionLabel } from '../../lib/format'

function Specs({ v, className = '' }: { v: Vehicle; className?: string }) {
  const items = [
    { icon: Gauge, text: formatKm(v.km) },
    { icon: Fuel, text: fuelLabel(v.fuel) },
    { icon: Cog, text: v.transmissionDetail ? `${transmissionLabel(v.transmission)} · ${v.transmissionDetail}` : transmissionLabel(v.transmission) },
    { icon: User, text: ownerLabel(v.owners) },
  ]
  return (
    <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-steel-600 ${className}`}>
      {items.map(({ icon: I, text }) => (
        <li key={text} className="flex min-w-0 items-center gap-2">
          <I className="size-3.5 shrink-0 text-steel-400" strokeWidth={1.5} />
          <span className="truncate tnum">{text}</span>
        </li>
      ))}
    </ul>
  )
}

function Price({ v, large = false }: { v: Vehicle; large?: boolean }) {
  if (v.status === 'sold')
    return <p className={`font-display font-semibold text-steel-500 ${large ? 'text-2xl' : 'text-lg'}`}>Sold</p>
  return (
    <p className={`font-display font-semibold tracking-tight tnum ${large ? 'text-2xl' : 'text-xl'}`}>
      {formatLakh(v.price)}
      {v.status === 'reserved' && <span className="ml-2 align-middle text-xs font-medium tracking-normal text-warn">Reserved</span>}
    </p>
  )
}

export function VehicleCard({ v, eager = false }: { v: Vehicle; eager?: boolean }) {
  const dim = v.status === 'sold'
  return (
    <Link to={`/cars/${v.slug}`} className="group flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-line/70 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(10,10,11,0.45)]">
      <div className="relative">
        <CarImage
          image={v.images[0]}
          label={`${v.make} ${v.model}`}
          eager={eager}
          className="aspect-[4/3]"
          imgClassName={`transition-transform duration-700 ease-out group-hover:scale-[1.03] ${dim ? 'grayscale-[60%]' : ''}`}
        />
        <div className="absolute top-3 left-3">
          <AvailabilityBadge status={v.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-steel-500 tnum">{v.mfgYear} · {v.rto ?? 'MH'} registration</p>
        <h3 className="mt-1 font-display text-lg leading-snug font-semibold tracking-tight">
          {v.make} {v.model}
        </h3>
        <p className="truncate text-sm text-steel-500">{v.variant}</p>
        <Specs v={v} className="mt-4 border-t border-line/70 pt-4" />
        <div className="mt-auto flex items-end justify-between pt-5">
          <Price v={v} />
          <span className="flex size-9 items-center justify-center rounded-full border border-line text-steel-500 transition-colors group-hover:border-ink-900 group-hover:bg-ink-900 group-hover:text-paper">
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function VehicleRow({ v }: { v: Vehicle }) {
  return (
    <Link to={`/cars/${v.slug}`} className="group grid overflow-hidden rounded-md bg-white ring-1 ring-line/70 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(10,10,11,0.45)] sm:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">
      <div className="relative">
        <CarImage image={v.images[0]} label={`${v.make} ${v.model}`} className="aspect-[16/10] h-full sm:aspect-auto sm:min-h-[200px]" imgClassName={`transition-transform duration-700 group-hover:scale-[1.03] ${v.status === 'sold' ? 'grayscale-[60%]' : ''}`} />
        <div className="absolute top-3 left-3">
          <AvailabilityBadge status={v.status} />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-steel-500 tnum">{v.mfgYear} · {v.rto ?? 'MH'} registration</p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
            {v.make} {v.model} <span className="font-normal text-steel-500">{v.variant}</span>
          </h3>
          {v.headline && <p className="mt-1.5 text-sm text-steel-600">{v.headline}</p>}
          <Specs v={v} className="mt-4 max-w-md sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" />
        </div>
        <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end">
          <Price v={v} large />
          <span className="text-[13px] font-medium text-ink-900 underline-offset-4 group-hover:underline">View details</span>
        </div>
      </div>
    </Link>
  )
}
