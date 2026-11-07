import { ButtonLink } from '../../components/ui/Button'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-ink-950 pt-16 text-paper">
      <div className="container-x">
        <p className="eyebrow text-steel-500">404</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">This road doesn’t go anywhere.</h1>
        <p className="mt-4 max-w-md text-steel-300">The page you’re looking for doesn’t exist. Let’s get you back on track.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink to="/" variant="light">
            Home
          </ButtonLink>
          <ButtonLink to="/cars" variant="outline-light">
            Browse cars
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
