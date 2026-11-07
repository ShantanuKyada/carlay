import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Search, SlidersHorizontal, X, CarFront } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { PageHeader } from '../../components/site/SiteLayout'
import { VehicleCard, VehicleRow } from '../../components/site/VehicleCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Drawer } from '../../components/ui/Overlay'
import { bodyLabel, formatLakh, fuelLabel } from '../../lib/format'
import type { Vehicle } from '../../types'

type Sort = 'newest' | 'price-asc' | 'price-desc' | 'km-asc'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'newest', label: 'Newest listing' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'km-asc', label: 'Kilometres: lowest first' },
]

const PRICE_STEPS = [300000, 500000, 700000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000, 20000000]
const KM_STEPS = [10000, 25000, 40000, 60000, 80000, 100000]

interface Filters {
  q: string
  minPrice: string
  maxPrice: string
  yearFrom: string
  maxKm: string
  fuel: string[]
  transmission: string[]
  body: string[]
  includeSold: boolean
}

const empty: Filters = { q: '', minPrice: '', maxPrice: '', yearFrom: '', maxKm: '', fuel: [], transmission: [], body: [], includeSold: true }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function BrowseCars() {
  const { state } = useDemo()
  const [params, setParams] = useSearchParams()
  const [f, setF] = useState<Filters>(() => ({
    ...empty,
    q: params.get('q') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    body: params.get('body') ? [params.get('body')!] : [],
  }))
  const [sort, setSort] = useState<Sort>('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sheet, setSheet] = useState(false)

  // keep shareable params in sync
  useEffect(() => {
    const p = new URLSearchParams()
    if (f.q) p.set('q', f.q)
    if (f.maxPrice) p.set('maxPrice', f.maxPrice)
    if (f.body.length === 1) p.set('body', f.body[0])
    setParams(p, { replace: true })
  }, [f.q, f.maxPrice, f.body, setParams])

  // react to header/footer links like /cars?body=suv while on the page
  const bodyParam = params.get('body')
  useEffect(() => {
    if (bodyParam && !(f.body.length === 1 && f.body[0] === bodyParam)) setF((x) => ({ ...x, body: [bodyParam] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyParam])

  const options = useMemo(() => {
    const uniq = (k: keyof Vehicle) => [...new Set(state.vehicles.map((v) => String(v[k])))].sort()
    const years = [...new Set(state.vehicles.map((v) => v.mfgYear))].sort((a, b) => b - a)
    return { fuel: uniq('fuel'), transmission: uniq('transmission'), body: uniq('bodyType'), years }
  }, [state.vehicles])

  const results = useMemo(() => {
    const q = norm(f.q.trim())
    const list = state.vehicles.filter((v) => {
      if (q && !norm(`${v.make} ${v.model} ${v.variant} ${v.mfgYear}`).includes(q)) return false
      if (f.minPrice && v.price < +f.minPrice) return false
      if (f.maxPrice && v.price > +f.maxPrice) return false
      if (f.yearFrom && v.mfgYear < +f.yearFrom) return false
      if (f.maxKm && v.km > +f.maxKm) return false
      if (f.fuel.length && !f.fuel.includes(v.fuel)) return false
      if (f.transmission.length && !f.transmission.includes(v.transmission)) return false
      if (f.body.length && !f.body.includes(v.bodyType)) return false
      if (!f.includeSold && v.status === 'sold') return false
      return true
    })
    const cmp: Record<Sort, (a: Vehicle, b: Vehicle) => number> = {
      newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'km-asc': (a, b) => a.km - b.km,
    }
    const rank = (v: Vehicle) => (v.status === 'sold' ? 1 : 0)
    return list.sort((a, b) => rank(a) - rank(b) || cmp[sort](a, b))
  }, [state.vehicles, f, sort])

  const activeCount =
    (f.minPrice ? 1 : 0) + (f.maxPrice ? 1 : 0) + (f.yearFrom ? 1 : 0) + (f.maxKm ? 1 : 0) + f.fuel.length + f.transmission.length + f.body.length + (f.includeSold ? 0 : 1)
  const availableCount = results.filter((v) => v.status === 'available').length

  const toggle = (k: 'fuel' | 'transmission' | 'body', val: string) =>
    setF((x) => ({ ...x, [k]: x[k].includes(val) ? x[k].filter((y) => y !== val) : [...x[k], val] }))

  const filterPanel = (
    <div className="space-y-8">
      <FilterGroup title="Price">
        <div className="grid grid-cols-2 gap-2">
          <MiniSelect value={f.minPrice} onChange={(v) => setF((x) => ({ ...x, minPrice: v }))} label="Min price" options={[{ value: '', label: 'No min' }, ...PRICE_STEPS.map((p) => ({ value: String(p), label: formatLakh(p) }))]} />
          <MiniSelect value={f.maxPrice} onChange={(v) => setF((x) => ({ ...x, maxPrice: v }))} label="Max price" options={[{ value: '', label: 'No max' }, ...PRICE_STEPS.map((p) => ({ value: String(p), label: formatLakh(p) }))]} />
        </div>
      </FilterGroup>
      <FilterGroup title="Manufacturing year">
        <MiniSelect value={f.yearFrom} onChange={(v) => setF((x) => ({ ...x, yearFrom: v }))} label="Year from" options={[{ value: '', label: 'Any year' }, ...options.years.map((y) => ({ value: String(y), label: `${y} or newer` }))]} />
      </FilterGroup>
      <FilterGroup title="Kilometres driven">
        <MiniSelect value={f.maxKm} onChange={(v) => setF((x) => ({ ...x, maxKm: v }))} label="Max kilometres" options={[{ value: '', label: 'Any' }, ...KM_STEPS.map((k) => ({ value: String(k), label: `Up to ${k.toLocaleString('en-IN')} km` }))]} />
      </FilterGroup>
      <FilterGroup title="Body type">
        <Chips values={options.body} selected={f.body} onToggle={(v) => toggle('body', v)} labelFn={bodyLabel} />
      </FilterGroup>
      <FilterGroup title="Fuel">
        <Chips values={options.fuel} selected={f.fuel} onToggle={(v) => toggle('fuel', v)} labelFn={fuelLabel} />
      </FilterGroup>
      <FilterGroup title="Transmission">
        <Chips values={options.transmission} selected={f.transmission} onToggle={(v) => toggle('transmission', v)} labelFn={(s) => s[0].toUpperCase() + s.slice(1)} />
      </FilterGroup>
      <label className="flex cursor-pointer items-center justify-between gap-3 border-t border-line pt-6 text-sm">
        <span>Show sold cars</span>
        <input type="checkbox" checked={f.includeSold} onChange={(e) => setF((x) => ({ ...x, includeSold: e.target.checked }))} className="size-4 accent-ink-900" />
      </label>
      {activeCount > 0 && (
        <button onClick={() => setF((x) => ({ ...empty, q: x.q }))} className="text-sm font-medium underline underline-offset-4">
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <>
      <PageHeader
        eyebrow="Buy a car"
        title="Browse cars"
        intro={
          <>
            <span className="tnum">{state.vehicles.filter((v) => v.status === 'available').length}</span> cars available in Pune right now. Search by brand or model, then narrow it down.
          </>
        }
      >
        <label className="mt-8 flex max-w-2xl items-center gap-3 rounded-md bg-white/8 px-4 ring-1 ring-white/10 focus-within:ring-white/30">
          <Search className="size-4 text-steel-400" strokeWidth={1.5} />
          <input
            value={f.q}
            onChange={(e) => setF((x) => ({ ...x, q: e.target.value }))}
            placeholder="Search brand or model"
            aria-label="Search brand or model"
            className="h-13 w-full bg-transparent text-[15px] text-paper placeholder:text-steel-400 focus:outline-none"
          />
          {f.q && (
            <button onClick={() => setF((x) => ({ ...x, q: '' }))} aria-label="Clear search" className="text-steel-400 hover:text-paper">
              <X className="size-4" />
            </button>
          )}
        </label>
      </PageHeader>

      <section className="container-x py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-steel-600">
                <span className="font-semibold text-ink-900 tnum">{results.length}</span> {results.length === 1 ? 'car' : 'cars'}
                {results.length !== availableCount && <span className="text-steel-500 tnum"> · {availableCount} available</span>}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setSheet(true)}>
                  <SlidersHorizontal className="size-4" strokeWidth={1.5} /> Filters{activeCount > 0 && <span className="tnum">({activeCount})</span>}
                </Button>
                <MiniSelect value={sort} onChange={(v) => setSort(v as Sort)} label="Sort by" options={SORTS} className="w-48" />
                <div className="hidden overflow-hidden rounded-[4px] border border-line sm:flex" role="group" aria-label="View">
                  {(['grid', 'list'] as const).map((m) => {
                    const I = m === 'grid' ? LayoutGrid : List
                    return (
                      <button key={m} onClick={() => setView(m)} aria-pressed={view === m} aria-label={`${m} view`} className={`flex size-9 items-center justify-center ${view === m ? 'bg-ink-900 text-paper' : 'bg-white text-steel-500 hover:text-ink-900'}`}>
                        <I className="size-4" strokeWidth={1.5} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <EmptyState
                icon={CarFront}
                title="No cars match these filters"
                body="Try widening your budget or kilometres — or tell us what you’re looking for and the team can keep an eye out."
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="secondary" onClick={() => setF(empty)}>
                      Clear filters
                    </Button>
                    <ButtonLink to="/find-my-car">Find my car</ButtonLink>
                  </div>
                }
              />
            ) : view === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((v, i) => (
                  <VehicleCard key={v.id} v={v} eager={i < 3} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((v) => (
                  <VehicleRow key={v.id} v={v} />
                ))}
              </div>
            )}
            <p className="mt-10 text-xs text-steel-500">Sample inventory for demonstration. Prices and details are illustrative and do not describe cars currently for sale.</p>
          </div>
        </div>
      </section>

      <Drawer
        open={sheet}
        onClose={() => setSheet(false)}
        title="Filters"
        width="max-w-md"
        footer={
          <Button className="w-full" onClick={() => setSheet(false)}>
            Show {results.length} {results.length === 1 ? 'car' : 'cars'}
          </Button>
        }
      >
        {filterPanel}
      </Drawer>
    </>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3 text-steel-500">{title}</p>
      {children}
    </div>
  )
}

function Chips({ values, selected, onToggle, labelFn }: { values: string[]; selected: string[]; onToggle: (v: string) => void; labelFn: (s: string) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => {
        const on = selected.includes(v)
        return (
          <button key={v} onClick={() => onToggle(v)} aria-pressed={on} className={`h-9 rounded-[4px] border px-3 text-sm transition-colors ${on ? 'border-ink-900 bg-ink-900 text-paper' : 'border-line bg-white hover:border-steel-400'}`}>
            {labelFn(v)}
          </button>
        )
      })}
    </div>
  )
}

function MiniSelect({ value, onChange, options, label, className = '' }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string; className?: string }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-9 w-full min-w-0 appearance-none rounded-[4px] border border-line bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236e7076%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[position:right_10px_center] bg-no-repeat pr-8 pl-3 text-sm hover:border-steel-400 focus:border-ink-900 focus:outline-none ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
