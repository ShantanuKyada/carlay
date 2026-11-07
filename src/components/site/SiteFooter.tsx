import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Instagram } from '../ui/Icons'
import { Wordmark } from './Wordmark'
import { siteConfig } from '../../config'

const cols = [
  {
    title: 'Buy',
    links: [
      { to: '/cars', label: 'Browse cars' },
      { to: '/cars?body=suv', label: 'SUVs' },
      { to: '/cars?body=sedan', label: 'Sedans' },
      { to: '/test-drive', label: 'Book a test drive' },
      { to: '/find-my-car', label: 'Find my car' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { to: '/sell', label: 'Sell your car' },
      { to: '/about#how-it-works', label: 'How it works' },
    ],
  },
  {
    title: 'Carlay',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/admin', label: 'Team dashboard (demo)' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-ink-950 text-steel-300">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-4">
          <Wordmark light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel-400">{siteConfig.tagline}</p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-white/10 px-3.5 text-sm text-steel-200 transition-colors hover:border-white/30 hover:text-paper"
            >
              <Instagram className="size-4" strokeWidth={1.5} />
              {siteConfig.instagramHandle}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-5">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow text-steel-500">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-steel-300 transition-colors hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow text-steel-500">Visit</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-steel-500" strokeWidth={1.5} />
              <span>{siteConfig.addressLine}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-steel-500" strokeWidth={1.5} />
              <span>
                {siteConfig.phoneDisplay} <span className="text-steel-500">(demo number)</span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-steel-500" strokeWidth={1.5} />
              <span>
                {siteConfig.email} <span className="text-steel-500">(placeholder)</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-steel-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Carlay, Pune. Concept prototype — listings, prices and customer data shown are samples.</p>
          <p>
            Powered by <span className="font-medium text-steel-300">VSCodesLabs</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
