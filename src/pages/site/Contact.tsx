import { Mail, MapPin, MessageCircle, Phone, Clock } from 'lucide-react'
import { Instagram } from '../../components/ui/Icons'
import type { ReactNode, ComponentType } from 'react'
import { PageHeader } from '../../components/site/SiteLayout'
import { EnquiryForm } from '../../components/site/EnquiryForm'
import { siteConfig, whatsappLink } from '../../config'

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Talk to the Carlay team." intro="Send a message, request a callback, or start a WhatsApp chat." />
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
          <div className="space-y-px overflow-hidden rounded-md bg-line">
            <Row icon={MessageCircle} title="WhatsApp" placeholder>
              <a className="font-medium hover:underline" href={whatsappLink('Hi Carlay, I have a question.')} target="_blank" rel="noreferrer">
                {siteConfig.phoneDisplay}
              </a>
            </Row>
            <Row icon={Phone} title="Phone" placeholder>
              <span className="font-medium">{siteConfig.phoneDisplay}</span>
            </Row>
            <Row icon={Mail} title="Email" placeholder>
              <span className="font-medium">{siteConfig.email}</span>
            </Row>
            <Row icon={MapPin} title="Showroom area">
              <span className="font-medium">{siteConfig.addressLine}</span>
              <p className="mt-1 text-xs text-steel-500">{siteConfig.addressNote}</p>
            </Row>
            <Row icon={Clock} title="Hours">
              <span className="font-medium">{siteConfig.hours}</span>
            </Row>
            <Row icon={Instagram} title="Instagram">
              <a className="font-medium hover:underline" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
                {siteConfig.instagramHandle}
              </a>
            </Row>
          </div>
          <div className="rounded-md bg-white p-6 ring-1 ring-line/70 sm:p-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Send a message</h2>
            <p className="mt-1.5 mb-8 text-[15px] text-steel-600">Pick a car if your question is about one — it’s attached to your enquiry automatically.</p>
            <EnquiryForm allowVehiclePick />
          </div>
        </div>
      </section>
    </>
  )
}

function Row({ icon: Icon, title, children, placeholder }: { icon: ComponentType<{ className?: string; strokeWidth?: number }>; title: string; children: ReactNode; placeholder?: boolean }) {
  return (
    <div className="flex gap-4 bg-white p-5">
      <Icon className="mt-0.5 size-4 shrink-0 text-steel-500" strokeWidth={1.5} />
      <div className="min-w-0 text-[15px]">
        <p className="mb-0.5 flex items-center gap-2 text-xs text-steel-500">
          {title}
          {placeholder && <span className="rounded-[3px] bg-paper-3 px-1.5 py-px text-[10px] font-semibold tracking-wider text-steel-600 uppercase">Placeholder</span>}
        </p>
        {children}
      </div>
    </div>
  )
}
