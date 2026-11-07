import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, ListChecks, CalendarClock, MessageCircle, BadgeInfo, SlidersHorizontal, FileText, Phone, MapPin } from 'lucide-react'
import { Instagram } from '../../components/ui/Icons'
import { useDemo } from '../../store/DemoStore'
import { CarImage } from '../../components/ui/CarImage'
import { ButtonLink, Button } from '../../components/ui/Button'
import { VehicleCard } from '../../components/site/VehicleCard'
import { SectionTitle } from '../../components/site/SiteLayout'
import { EnquiryForm } from '../../components/site/EnquiryForm'
import { siteConfig, whatsappLink } from '../../config'
import { bodyLabel } from '../../lib/format'

const BUDGETS = [
  { value: '', label: 'Any budget' },
  { value: '700000', label: 'Under ₹7 Lakh' },
  { value: '1000000', label: 'Under ₹10 Lakh' },
  { value: '1500000', label: 'Under ₹15 Lakh' },
  { value: '2500000', label: 'Under ₹25 Lakh' },
  { value: '5000000', label: 'Under ₹50 Lakh' },
]

export default function Home() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const hero = state.vehicles.find((v) => v.id === 'CL-0012') ?? state.vehicles[0]
  const available = state.vehicles.filter((v) => v.status === 'available')
  const featured = useMemo(() => {
    const f = state.vehicles.filter((v) => v.featured && v.status === 'available')
    const rest = available.filter((v) => !f.includes(v)).sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    return [...f, ...rest].slice(0, 6)
  }, [state.vehicles, available])

  const bodies = useMemo(() => {
    const m = new Map<string, number>()
    available.forEach((v) => m.set(v.bodyType, (m.get(v.bodyType) ?? 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [available])

  const [q, setQ] = useState('')
  const [body, setBody] = useState('')
  const [budget, setBudget] = useState('')
  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (body) p.set('body', body)
    if (budget) p.set('maxPrice', budget)
    navigate(`/cars${p.toString() ? `?${p}` : ''}`)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-paper lg:h-[100svh] lg:max-h-[940px] lg:min-h-[760px]">
        <CarImage image={hero.images[0]} eager className="absolute inset-0 -z-10 !bg-ink-950" imgClassName="object-[60%_center] scale-[1.02]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-ink-950/70 to-transparent" />

        <div className="container-x flex flex-1 flex-col justify-end pt-28 pb-8 lg:pb-12">
          <div className="max-w-2xl">
            <p className="eyebrow animate-fade-up text-steel-300">Pre-owned cars · {siteConfig.city}</p>
            <h1 className="mt-5 animate-fade-up font-display text-[44px] leading-[0.98] font-semibold tracking-[-0.03em] [animation-delay:80ms] sm:text-6xl lg:text-[84px]">
              Find your next car.
              <br />
              <span className="text-steel-300">The Carlay way.</span>
            </h1>
            <p className="mt-6 max-w-lg animate-fade-up text-[17px] leading-relaxed text-steel-200 [animation-delay:160ms]">
              Quality pre-owned cars in Pune, listed with the details that matter — and a simpler way to enquire, book a test drive, or sell your own car.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
              <ButtonLink to="/cars" variant="light" size="lg">
                Explore cars <ArrowRight className="size-4" strokeWidth={1.75} />
              </ButtonLink>
              <ButtonLink to="/sell" variant="outline-light" size="lg">
                Sell your car
              </ButtonLink>
            </div>
          </div>

          {/* Search entry */}
          <form onSubmit={onSearch} className="mt-12 grid animate-fade-up gap-px overflow-hidden rounded-md bg-white/10 ring-1 ring-white/10 backdrop-blur-md [animation-delay:320ms] grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1fr_1fr_auto] lg:mt-16">
            <label className="flex items-center gap-3 bg-ink-950/60 px-4">
              <Search className="size-4 shrink-0 text-steel-400" strokeWidth={1.5} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brand or model" className="h-14 w-full bg-transparent text-[15px] text-paper placeholder:text-steel-400 focus:outline-none" aria-label="Search brand or model" />
            </label>
            <select value={body} onChange={(e) => setBody(e.target.value)} className="hidden h-14 appearance-none bg-ink-950/60 px-4 text-[15px] text-paper focus:outline-none sm:block" aria-label="Body type">
              <option value="">All body types</option>
              {bodies.map(([b]) => (
                <option key={b} value={b}>
                  {bodyLabel(b)}
                </option>
              ))}
            </select>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="hidden h-14 appearance-none bg-ink-950/60 px-4 text-[15px] text-paper focus:outline-none sm:block" aria-label="Budget">
              {BUDGETS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="light" className="h-14 rounded-none px-5 sm:px-7">
              Search <span className="hidden tnum text-steel-500 lg:inline">· {available.length} available</span>
            </Button>
          </form>
        </div>
      </section>

      {/* BODY TYPES */}
      <section className="border-b border-line bg-paper">
        <div className="container-x no-scrollbar flex items-center gap-2 overflow-x-auto py-5">
          <span className="eyebrow mr-3 shrink-0 text-steel-500">Browse by type</span>
          {bodies.map(([b, n]) => (
            <Link key={b} to={`/cars?body=${b}`} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm transition-colors hover:border-ink-900">
              {bodyLabel(b)} <span className="text-xs text-steel-500 tnum">{n}</span>
            </Link>
          ))}
          <Link to="/cars" className="ml-auto hidden shrink-0 items-center gap-1.5 text-sm font-medium sm:inline-flex">
            All cars <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionTitle eyebrow="Featured" title="Recently listed" intro="A selection from the current catalogue. Every listing shows price, kilometres, ownership and registration up front." />
            <ButtonLink to="/cars" variant="secondary" className="shrink-0 self-start sm:self-auto">
              View all cars <ArrowRight className="size-4" strokeWidth={1.75} />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v, i) => (
              <VehicleCard key={v.id} v={v} eager={i < 3} />
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-steel-500">
            <BadgeInfo className="size-3.5" strokeWidth={1.5} /> Sample listings for this demo. Photos are illustrative.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-ink-950 py-20 text-paper lg:py-28">
        <div className="container-x">
          <SectionTitle light eyebrow="How Carlay works" title={<>Two simple journeys.<br className="hidden sm:block" /> One place for both.</>} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-md bg-white/10 lg:grid-cols-2">
            <Journey
              title="Buying a car"
              cta={{ to: '/cars', label: 'Browse cars' }}
              steps={[
                ['Browse', 'Search and filter the catalogue by budget, body type, fuel, transmission and kilometres.'],
                ['Review the details', 'Each car has its registration, ownership, insurance and history set out clearly.'],
                ['Enquire or book a test drive', 'Send an enquiry, choose a preferred test-drive slot, or message on WhatsApp.'],
                ['Visit and decide', 'See the car in person in Pune and talk it through with the Carlay team.'],
              ]}
            />
            <Journey
              title="Selling your car"
              cta={{ to: '/sell', label: 'Sell your car' }}
              steps={[
                ['Tell us about the car', 'A short guided form: details, condition and a few photos. No sign-in needed.'],
                ['Carlay reviews it', 'The team looks over what you shared — nothing is valued automatically.'],
                ['We get in touch', 'Carlay contacts you on your preferred channel to discuss next steps.'],
                ['Inspection and listing', 'If both sides agree, the car is inspected and listed. Terms to be confirmed with Carlay.'],
              ]}
            />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <SectionTitle className="lg:col-span-4" eyebrow="A better way to buy" title="Less scrolling. More clarity." intro="Everything a buyer usually has to ask for in DMs, available on one page — with a direct line to the team when you need it." />
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-8 lg:pl-8">
            <Benefit icon={FileText} title="The full picture, up front" body="Price, kilometres, ownership, registration, insurance validity and history on every listing." />
            <Benefit icon={SlidersHorizontal} title="Find the right car faster" body="Filter by budget, year, fuel, transmission, kilometres and body type instead of scrolling a feed." />
            <Benefit icon={ListChecks} title="Clear availability" body="Every car is marked Available, Reserved or Sold, so you never chase a car that’s gone." />
            <Benefit icon={CalendarClock} title="Book a test drive online" body="Pick a preferred date and time slot in under a minute. The team confirms with you." />
            <Benefit icon={MessageCircle} title="WhatsApp, when you prefer" body="Start a conversation about a specific car with its details already filled in." />
            <Benefit icon={Search} title="Can’t find it? Ask us" body="Tell us what you’re looking for and the team can keep an eye out for a match." />
          </div>
        </div>
      </section>

      {/* FIND MY CAR BAND */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-paper">
        <CarImage image={state.vehicles.find((v) => v.id === 'CL-0010')?.images[0]} className="absolute inset-0 -z-10 opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/30" />
        <div className="container-x py-20 lg:py-28">
          <div className="max-w-xl">
            <p className="eyebrow text-steel-400">Find my car</p>
            <h2 className="mt-3 font-display text-3xl leading-[1.1] font-semibold tracking-[-0.02em] sm:text-4xl lg:text-5xl">Looking for something specific?</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-steel-300">Share the make, budget and must-haves. The Carlay team can look out for a car that fits and let you know.</p>
            <ButtonLink to="/find-my-car" variant="light" size="lg" className="mt-8">
              Tell us what you need <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquire" className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionTitle eyebrow="Talk to Carlay" title="Questions? Send us a message." intro="Ask about a car, finance or exchange, or request a callback. Prefer chatting? Message us on WhatsApp." />
            <div className="mt-10 space-y-5 border-t border-line pt-8 text-sm">
              <a href={whatsappLink('Hi Carlay, I have a question about your cars.')} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-medium hover:underline">
                <MessageCircle className="size-4 text-steel-500" strokeWidth={1.5} /> WhatsApp {siteConfig.phoneDisplay} <span className="font-normal text-steel-500">(demo number)</span>
              </a>
              <p className="flex items-center gap-3">
                <Phone className="size-4 text-steel-500" strokeWidth={1.5} /> {siteConfig.phoneDisplay} <span className="text-steel-500">(demo number)</span>
              </p>
              <p className="flex items-center gap-3">
                <MapPin className="size-4 text-steel-500" strokeWidth={1.5} /> {siteConfig.addressLine}
              </p>
              <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:underline">
                <Instagram className="size-4 text-steel-500" strokeWidth={1.5} /> {siteConfig.instagramHandle} on Instagram
              </a>
            </div>
          </div>
          <div className="rounded-md bg-white p-6 ring-1 ring-line/70 sm:p-8 lg:col-span-7">
            <EnquiryForm allowVehiclePick />
          </div>
        </div>
      </section>
    </>
  )
}

function Journey({ title, steps, cta }: { title: string; steps: [string, string][]; cta: { to: string; label: string } }) {
  return (
    <div className="flex flex-col bg-ink-950 p-7 sm:p-10">
      <h3 className="font-display text-2xl font-semibold tracking-tight">{title}</h3>
      <ol className="mt-8 flex-1 space-y-7">
        {steps.map(([t, b], i) => (
          <li key={t} className="grid grid-cols-[40px_1fr] gap-4">
            <span className="font-display text-sm font-medium text-steel-500 tnum">0{i + 1}</span>
            <div>
              <p className="font-medium">{t}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-steel-400">{b}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link to={cta.to} className="mt-10 inline-flex items-center gap-2 self-start border-b border-paper/30 pb-1 text-sm font-medium transition-colors hover:border-paper">
        {cta.label} <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}

function Benefit({ icon: Icon, title, body }: { icon: typeof Search; title: string; body: string }) {
  return (
    <div>
      <Icon className="size-5 text-steel-500" strokeWidth={1.5} />
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-steel-600">{body}</p>
    </div>
  )
}
