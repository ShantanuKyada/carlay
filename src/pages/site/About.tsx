import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Instagram } from '../../components/ui/Icons'
import { PageHeader, SectionTitle } from '../../components/site/SiteLayout'
import { ButtonLink } from '../../components/ui/Button'
import { CarImage } from '../../components/ui/CarImage'
import { useDemo } from '../../store/DemoStore'
import { siteConfig } from '../../config'

export default function About() {
  const { state } = useDemo()
  const img = state.vehicles.find((v) => v.id === 'CL-0011')?.images[0]
  return (
    <>
      <PageHeader eyebrow="About Carlay" title="Pre-owned cars in Pune, presented properly." intro="Carlay is a Pune-based pre-owned car business that helps people buy well-kept cars and helps owners sell theirs." />

      <section className="py-20 lg:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <CarImage image={img} className="aspect-[4/3] rounded-md" />
          <div>
            <SectionTitle eyebrow="What Carlay does" title="Buying and selling, without the guesswork." />
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-steel-600">
              <p>
                Carlay lists pre-owned cars for buyers in Pune and has built a large following on Instagram, where each car is shared with its key details: registration, ownership,
                kilometres, insurance and price.
              </p>
              <p>
                For owners, Carlay offers a way to sell — described on its Instagram as <strong className="font-medium text-ink-900">Park &amp; Sell</strong> — where the team handles
                presenting the car to buyers.
              </p>
              <p>This website brings those listings and requests into one place, so buyers can search properly and sellers can share their car’s details without filling in scattered forms.</p>
            </div>
            <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 border-b border-ink-900/30 pb-1 text-sm font-medium hover:border-ink-900">
              <Instagram className="size-4" strokeWidth={1.5} /> Follow {siteConfig.instagramHandle} on Instagram
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-ink-950 py-20 text-paper lg:py-28">
        <div className="container-x">
          <SectionTitle light eyebrow="How it works" title="What you can do here." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Browse', 'Search the catalogue and see each car’s details, availability and photos.', '/cars'],
              ['Enquire & test drive', 'Ask a question or request a test-drive slot for a specific car.', '/test-drive'],
              ['Sell your car', 'Share your car’s details and photos for the Carlay team to review.', '/sell'],
              ['Find my car', 'Tell the team what you’re looking for if it isn’t listed yet.', '/find-my-car'],
            ].map(([t, b, to]) => (
              <Link key={t} to={to} className="group bg-ink-950 p-7 transition-colors hover:bg-ink-900">
                <p className="font-display text-xl font-semibold">{t}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-steel-400">{b}</p>
                <ArrowRight className="mt-6 size-4 text-steel-500 transition-transform group-hover:translate-x-1 group-hover:text-paper" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-steel-500">Part of a wider automotive family</p>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-steel-600">
              Carlay is listed as a venture of Brotomotiv, a Pune automotive detailing and restoration business. The nature of this relationship and how it appears on the website are to be
              confirmed with the client.
            </p>
          </div>
          <div className="flex flex-col items-start justify-end gap-4 lg:items-end">
            <ButtonLink to="/cars" size="lg">
              Browse cars <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary" size="lg">
              Contact Carlay
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
