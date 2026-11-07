import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Gauge, Fuel, Cog, User, CalendarDays, MessageCircle, CalendarClock, Send, Share2, BadgeInfo, ShieldCheck, Wrench, FileText, MapPin, CarFront } from 'lucide-react'
import { useDemo } from '../../store/DemoStore'
import { CarImage } from '../../components/ui/CarImage'
import { AvailabilityBadge, SampleChip } from '../../components/ui/Badges'
import { Button, ButtonLink } from '../../components/ui/Button'
import { EnquiryForm } from '../../components/site/EnquiryForm'
import { TestDriveForm } from '../../components/site/TestDriveForm'
import { VehicleCard } from '../../components/site/VehicleCard'
import { Modal } from '../../components/ui/Overlay'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { siteConfig, whatsappLink } from '../../config'
import { accidentLabel, bodyLabel, formatDate, formatINR, formatKm, formatLakh, fuelLabel, insuranceLabel, monthYear, ownerLabel, serviceLabel, transmissionLabel, vehicleTitle } from '../../lib/format'
import { imageCredits } from '../../data/imageCredits'

export default function VehicleDetail() {
  const { slug } = useParams()
  const { vehicleBySlug, state } = useDemo()
  const toast = useToast()
  const v = vehicleBySlug(slug)
  const [img, setImg] = useState(0)
  const [tab, setTab] = useState<'enquire' | 'testdrive'>('enquire')
  const [modal, setModal] = useState<null | 'enquire' | 'testdrive'>(null)

  useEffect(() => setImg(0), [slug])

  const related = useMemo(() => {
    if (!v) return []
    return state.vehicles
      .filter((x) => x.id !== v.id && x.status !== 'sold')
      .map((x) => ({ x, score: (x.bodyType === v.bodyType ? 2 : 0) + (Math.abs(x.price - v.price) / v.price < 0.35 ? 2 : 0) + (x.status === 'available' ? 1 : 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.x)
  }, [state.vehicles, v])

  if (!v)
    return (
      <div className="container-x pt-32 pb-24">
        <EmptyState icon={CarFront} title="This car isn’t in the catalogue" body="It may have been removed, or the link is incorrect." action={<ButtonLink to="/cars">Browse cars</ButtonLink>} />
      </div>
    )

  const title = vehicleTitle(v)
  const images = v.images.length ? v.images : [{ local: '', alt: title }]
  const credits = imageCredits.filter((c) => c.stockCode === v.stockCode)
  const wa = whatsappLink(`Hi Carlay, I'm interested in the ${title} ${v.variant} (${v.stockCode}) listed at ${formatLakh(v.price)}. Is it available?`)
  const canBook = v.status === 'available'
  const isSold = v.status === 'sold'

  const overview: [string, string | undefined][] = [
    ['Registration', v.regYear ? `${monthYear(v.regYear, v.regMonth)}${v.rto ? ` · ${v.rto}` : ''}` : undefined],
    ['Manufactured', monthYear(v.mfgYear, v.mfgMonth)],
    ['Kilometres', formatKm(v.km)],
    ['Fuel', fuelLabel(v.fuel)],
    ['Transmission', `${transmissionLabel(v.transmission)}${v.transmissionDetail ? ` (${v.transmissionDetail})` : ''}`],
    ['Engine', v.engineCc ? `${v.engineCc.toLocaleString('en-IN')} cc` : undefined],
    ['Ownership', ownerLabel(v.owners)],
    ['Body type', bodyLabel(v.bodyType)],
    ['Seats', v.seats ? String(v.seats) : undefined],
    ['Colour', v.colour],
    ['Registration valid until', v.regValidUntil ? formatDate(v.regValidUntil) : undefined],
    ['Insurance', v.insuranceType ? `${insuranceLabel[v.insuranceType] ?? v.insuranceType}${v.insuranceValidUntil ? `, valid to ${formatDate(v.insuranceValidUntil)}` : ''}` : undefined],
    ['Keys', v.keys ? String(v.keys) : undefined],
    ['Stock code', v.stockCode],
  ]

  const hasHistory = v.accidentHistory || v.serviceHistory || v.accidentNotes
  const featureGroups = v.features.reduce<Record<string, string[]>>((acc, f) => {
    ;(acc[f.group] ??= []).push(f.label)
    return acc
  }, {})

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title, url })
      else {
        await navigator.clipboard.writeText(url)
        toast('Link copied', { tone: 'info' })
      }
    } catch {
      /* user cancelled */
    }
  }

  return (
    <>
      <div className="bg-ink-950 pt-16 lg:pt-[72px]" />
      <div className="container-x pt-6 pb-24 lg:pt-8">
        <div className="flex items-center justify-between">
          <Link to="/cars" className="inline-flex items-center gap-2 text-sm text-steel-600 hover:text-ink-900">
            <ArrowLeft className="size-4" strokeWidth={1.5} /> All cars
          </Link>
          <button onClick={share} className="inline-flex items-center gap-2 text-sm text-steel-600 hover:text-ink-900">
            <Share2 className="size-4" strokeWidth={1.5} /> Share
          </button>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_400px] xl:gap-14">
          {/* Gallery */}
          <div className="min-w-0">
            <div className="group relative overflow-hidden rounded-md">
              <CarImage key={`${v.id}-${img}`} image={images[img]} label={`${v.make} ${v.model}`} eager className="aspect-[16/10] animate-fade-in" imgClassName={isSold ? 'grayscale-[50%]' : ''} />
              <div className="absolute top-4 left-4 flex gap-2">
                <AvailabilityBadge status={v.status} />
              </div>
              {images.length > 1 && (
                <>
                  <button onClick={() => setImg((i) => (i - 1 + images.length) % images.length)} aria-label="Previous photo" className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/60 text-paper backdrop-blur transition hover:bg-ink-950/80">
                    <ChevronLeft className="size-5" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => setImg((i) => (i + 1) % images.length)} aria-label="Next photo" className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/60 text-paper backdrop-blur transition hover:bg-ink-950/80">
                    <ChevronRight className="size-5" strokeWidth={1.5} />
                  </button>
                </>
              )}
              <span className="absolute right-4 bottom-4 rounded-[3px] bg-ink-950/70 px-2 py-1 text-xs text-paper tnum backdrop-blur">
                {img + 1} / {images.length}
              </span>
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {images.map((im, i) => (
                  <button key={i} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`} className={`overflow-hidden rounded-[4px] ring-2 transition ${img === i ? 'ring-ink-900' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                    <CarImage image={im} className="aspect-[4/3]" />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-steel-500">
              Illustrative photo{credits.length > 1 ? 's' : ''}: {credits.map((c) => `${c.author} (${c.licence})`).join(', ')} via Wikimedia Commons. <Link to="/image-credits" className="underline underline-offset-2">Credits</Link>
            </p>

            {/* Key specs strip */}
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-line sm:grid-cols-5">
              {[
                { i: CalendarDays, l: 'Year', t: String(v.mfgYear) },
                { i: Gauge, l: 'Kilometres', t: formatKm(v.km) },
                { i: Fuel, l: 'Fuel', t: fuelLabel(v.fuel) },
                { i: Cog, l: 'Transmission', t: transmissionLabel(v.transmission) },
                { i: User, l: 'Ownership', t: ownerLabel(v.owners) },
              ].map(({ i: I, l, t }) => (
                <div key={l} className="bg-white px-4 py-4 last:col-span-2 sm:last:col-span-1">
                  <I className="size-4 text-steel-400" strokeWidth={1.5} />
                  <p className="mt-3 text-xs text-steel-500">{l}</p>
                  <p className="mt-0.5 font-medium tnum">{t}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {(v.headline || v.description) && (
              <section className="mt-12">
                {v.headline && <h2 className="font-display text-2xl font-semibold tracking-tight">{v.headline}</h2>}
                {v.description && <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-steel-600">{v.description}</p>}
                {v.highlights.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {v.highlights.map((h) => (
                      <li key={h} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink-800">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Overview */}
            <section className="mt-12">
              <h2 className="eyebrow text-steel-500">Overview</h2>
              <dl className="mt-4 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
                {overview
                  .filter(([, val]) => val)
                  .map(([k, val]) => (
                    <div key={k} className="flex justify-between gap-6 border-b border-line py-3.5 text-[15px]">
                      <dt className="text-steel-500">{k}</dt>
                      <dd className="text-right font-medium tnum">{val}</dd>
                    </div>
                  ))}
              </dl>
            </section>

            {/* Condition & history */}
            {hasHistory && (
              <section className="mt-12">
                <h2 className="eyebrow text-steel-500">Condition &amp; history</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {v.accidentHistory && (
                    <HistoryCard icon={ShieldCheck} title="Accident history" value={accidentLabel[v.accidentHistory] ?? v.accidentHistory} note={v.accidentNotes} />
                  )}
                  {v.serviceHistory && <HistoryCard icon={Wrench} title="Service history" value={serviceLabel[v.serviceHistory] ?? v.serviceHistory} />}
                  {v.insuranceValidUntil && <HistoryCard icon={FileText} title="Insurance" value={`${insuranceLabel[v.insuranceType ?? ''] ?? 'Insured'} until ${formatDate(v.insuranceValidUntil)}`} />}
                  {v.rto && <HistoryCard icon={MapPin} title="Registered at" value={`${v.rto} RTO, Maharashtra`} />}
                </div>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-steel-500">
                  <BadgeInfo className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
                  Sample data. Condition details are shown only when recorded for a listing; Carlay’s actual inspection process is to be confirmed.
                </p>
              </section>
            )}

            {/* Features */}
            {Object.keys(featureGroups).length > 0 && (
              <section className="mt-12">
                <h2 className="eyebrow text-steel-500">Features</h2>
                <div className="mt-4 grid gap-8 sm:grid-cols-2">
                  {Object.entries(featureGroups).map(([g, labels]) => (
                    <div key={g}>
                      <p className="text-sm font-semibold capitalize">{g}</p>
                      <ul className="mt-2 space-y-1.5">
                        {labels.map((l) => (
                          <li key={l} className="flex items-center gap-2 text-[15px] text-steel-600">
                            <span className="size-1 rounded-full bg-steel-400" /> {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Forms */}
            <section id="enquire" className="mt-14 scroll-mt-24 rounded-md bg-white ring-1 ring-line/70">
              {isSold ? (
                <div className="p-6 sm:p-8">
                  <h2 className="font-display text-xl font-semibold">This car has been sold</h2>
                  <p className="mt-2 text-[15px] text-steel-600">Looking for something similar? Tell us what you need, or browse the cars that are available now.</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink to="/find-my-car">Find me a similar car</ButtonLink>
                    <ButtonLink to="/cars" variant="secondary">
                      Browse available cars
                    </ButtonLink>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex border-b border-line" role="tablist">
                    {([
                      ['enquire', 'Send an enquiry'],
                      ['testdrive', 'Book a test drive'],
                    ] as const).map(([k, l]) => (
                      <button
                        key={k}
                        role="tab"
                        aria-selected={tab === k}
                        onClick={() => setTab(k)}
                        className={`relative flex-1 px-4 py-4 text-sm font-medium transition-colors sm:flex-none sm:px-8 ${tab === k ? 'text-ink-900 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-ink-900' : 'text-steel-500 hover:text-ink-900'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <div className="p-6 sm:p-8">
                    {tab === 'enquire' ? (
                      <EnquiryForm key={`enq-${v.id}`} vehicle={v} />
                    ) : canBook ? (
                      <TestDriveForm key={`td-${v.id}`} vehicle={v} />
                    ) : (
                      <div>
                        <p className="font-medium">Test drives are paused while this car is reserved.</p>
                        <p className="mt-1 text-[15px] text-steel-600">Send an enquiry to be told if it becomes available again.</p>
                        <Button className="mt-5" variant="secondary" onClick={() => setTab('enquire')}>
                          Send an enquiry
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md bg-white p-6 ring-1 ring-line/70 sm:p-7">
              <div className="flex items-center gap-2">
                <AvailabilityBadge status={v.status} />
                <SampleChip />
              </div>
              <p className="mt-5 text-sm text-steel-500 tnum">{v.mfgYear} · {formatKm(v.km)}</p>
              <h1 className="mt-1 font-display text-3xl leading-tight font-semibold tracking-[-0.02em]">
                {v.make} {v.model}
              </h1>
              <p className="mt-1 text-[15px] text-steel-600">{v.variant}</p>

              <div className="mt-6 border-t border-line pt-6">
                {isSold ? (
                  <p className="font-display text-3xl font-semibold text-steel-500">Sold</p>
                ) : (
                  <>
                    <p className="text-xs text-steel-500">Asking price</p>
                    <p className="mt-1 font-display text-4xl font-semibold tracking-tight tnum">{formatLakh(v.price)}</p>
                    <p className="mt-1 text-sm text-steel-500 tnum">
                      {formatINR(v.price)}
                      {v.priceType === 'negotiable' ? ' · Negotiable' : v.priceType === 'fixed' ? ' · Fixed price' : ''}
                    </p>
                  </>
                )}
              </div>

              {v.status === 'reserved' && (
                <p className="mt-5 rounded-[4px] bg-warn-bg px-3.5 py-3 text-[13px] leading-relaxed text-warn">This car is currently reserved by another buyer. You can still enquire to join the waiting list.</p>
              )}

              {!isSold ? (
                <div className="mt-6 grid gap-2.5">
                  <Button size="lg" onClick={() => setModal('enquire')}>
                    <Send className="size-4" strokeWidth={1.75} /> Enquire about this car
                  </Button>
                  <Button size="lg" variant="secondary" disabled={!canBook} onClick={() => setModal('testdrive')}>
                    <CalendarClock className="size-4" strokeWidth={1.75} /> {canBook ? 'Book a test drive' : 'Test drive unavailable'}
                  </Button>
                  <a href={wa} target="_blank" rel="noreferrer" className="inline-flex h-13 items-center justify-center gap-2 rounded-[4px] text-[15px] font-medium text-ink-900 hover:bg-ink-900/5">
                    <MessageCircle className="size-4" strokeWidth={1.75} /> WhatsApp the team
                  </a>
                </div>
              ) : (
                <div className="mt-6 grid gap-2.5">
                  <ButtonLink to="/find-my-car" size="lg">
                    Find me a similar car
                  </ButtonLink>
                </div>
              )}
              <p className="mt-4 text-center text-xs text-steel-500">WhatsApp opens a chat with the demo number {siteConfig.phoneDisplay}.</p>
            </div>
            <div className="mt-4 flex items-start gap-2 px-1 text-xs leading-relaxed text-steel-500">
              <BadgeInfo className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} />
              Sample listing created for this demo. It does not describe a car currently for sale at Carlay.
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">You may also like</h2>
              <Link to="/cars" className="text-sm font-medium underline-offset-4 hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <VehicleCard key={r.id} v={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile action bar */}
      {!isSold && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="mr-auto min-w-0">
              <p className="truncate text-xs text-steel-500">{title}</p>
              <p className="font-display text-lg font-semibold whitespace-nowrap tnum">{formatLakh(v.price)}</p>
            </div>
            <a href={wa} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex size-11 items-center justify-center rounded-[4px] border border-line bg-white">
              <MessageCircle className="size-5" strokeWidth={1.5} />
            </a>
            {canBook && (
              <Button variant="secondary" onClick={() => setModal('testdrive')} className="px-3.5">
                Test drive
              </Button>
            )}
            <Button onClick={() => setModal('enquire')} className="px-4">
              Enquire
            </Button>
          </div>
        </div>
      )}

      <Modal open={modal === 'enquire'} onClose={() => setModal(null)} title="Enquire about this car">
        <EnquiryForm vehicle={v} />
      </Modal>
      <Modal open={modal === 'testdrive'} onClose={() => setModal(null)} title="Book a test drive">
        <TestDriveForm vehicle={v} compact />
      </Modal>
    </>
  )
}

function HistoryCard({ icon: Icon, title, value, note }: { icon: typeof Gauge; title: string; value: string; note?: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-5">
      <div className="flex items-center gap-2 text-steel-500">
        <Icon className="size-4" strokeWidth={1.5} />
        <span className="text-xs">{title}</span>
      </div>
      <p className="mt-2 font-medium">{value}</p>
      {note && <p className="mt-1.5 text-sm leading-relaxed text-steel-600">{note}</p>}
    </div>
  )
}
