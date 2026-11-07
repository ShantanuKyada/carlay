import { PageHeader } from '../../components/site/SiteLayout'
import { imageCredits } from '../../data/imageCredits'
import { CarImage } from '../../components/ui/CarImage'

const licenceUrl: Record<string, string> = {
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
}

export default function ImageCredits() {
  return (
    <>
      <PageHeader
        eyebrow="Image credits"
        title="Photography credits"
        intro="This demo uses licensed photographs from Wikimedia Commons as illustrative placeholders. They do not show Carlay’s cars and will be replaced by Carlay’s own photography. Images may be resized and re-encoded."
      />
      <section className="container-x py-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {imageCredits.map((c) => (
            <li key={c.local} className="flex gap-4 rounded-md bg-white p-3 ring-1 ring-line/70">
              <CarImage image={{ local: c.local, remote: c.remote, alt: c.title }} className="aspect-[4/3] w-28 shrink-0 rounded-[3px]" />
              <div className="min-w-0 py-1 text-sm">
                <p className="truncate font-medium" title={c.title}>
                  {c.title}
                </p>
                <p className="mt-1 text-steel-600">By {c.author}</p>
                <p className="mt-1 text-steel-500">
                  {licenceUrl[c.licence] ? (
                    <a className="underline underline-offset-2" href={licenceUrl[c.licence]} target="_blank" rel="noreferrer">
                      {c.licence}
                    </a>
                  ) : (
                    c.licence
                  )}{' '}
                  ·{' '}
                  <a className="underline underline-offset-2" href={c.filePage} target="_blank" rel="noreferrer">
                    Source
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
