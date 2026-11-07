import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/site/SiteLayout'
import { TestDriveForm } from '../../components/site/TestDriveForm'
import { CarImage } from '../../components/ui/CarImage'
import { useDemo } from '../../store/DemoStore'
import { formatKm, formatLakh, vehicleTitle } from '../../lib/format'

export default function TestDrive() {
  const [params] = useSearchParams()
  const { vehicleBySlug } = useDemo()
  const preset = vehicleBySlug(params.get('car') ?? undefined)
  const vehicle = preset?.status === 'available' ? preset : undefined

  return (
    <>
      <PageHeader eyebrow="Test drive" title="Book a test drive." intro="Choose a car, pick a preferred date and time, and the Carlay team will confirm with you." />
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 rounded-md bg-white p-6 ring-1 ring-line/70 sm:p-10">
            <TestDriveForm vehicle={vehicle} />
          </div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {vehicle && (
              <div className="overflow-hidden rounded-md bg-white ring-1 ring-line/70">
                <CarImage image={vehicle.images[0]} className="aspect-[4/3]" />
                <div className="p-5">
                  <p className="font-display text-lg font-semibold">{vehicleTitle(vehicle)}</p>
                  <p className="text-sm text-steel-500">{vehicle.variant}</p>
                  <p className="mt-3 text-sm text-steel-600 tnum">
                    {formatKm(vehicle.km)} · {formatLakh(vehicle.price)}
                  </p>
                </div>
              </div>
            )}
            <div className="rounded-md bg-ink-950 p-7 text-paper">
              <p className="eyebrow text-steel-400">Good to know</p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-steel-300">
                <li>Bring a valid driving licence on the day.</li>
                <li>Your slot is a request — it isn’t confirmed until the team calls you.</li>
                <li>Location and test-drive policy to be confirmed with Carlay.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
