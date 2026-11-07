import { useState } from 'react'
import type { VehicleImage } from '../../types'

/**
 * Loads a demo photo from /public/demo first (run `npm run fetch-images` to bundle them),
 * then from the Wikimedia Commons thumbnail, and finally shows a quiet monogram panel.
 */
export function CarImage({
  image,
  label,
  className = '',
  imgClassName = '',
  eager = false,
}: {
  image?: VehicleImage
  label?: string
  className?: string
  imgClassName?: string
  eager?: boolean
}) {
  const sources = [image?.local, image?.remote].filter(Boolean) as string[]
  const [idx, setIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const src = sources[idx]

  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden bg-ink-850 ${className}`}>
      {src ? (
        <img
          key={src}
          src={src}
          alt={image?.alt ?? label ?? ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setIdx((i) => i + 1)
          }}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      ) : (
        <Fallback label={label} />
      )}
      {src && !loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-800 to-ink-900" />}
    </div>
  )
}

function Fallback({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_60%,#2a2a2f_0%,#141416_70%)] text-center">
      <svg viewBox="0 0 240 80" className="w-1/2 max-w-[220px] text-steel-600" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M14 58h212M30 58c0-8 6-14 14-14s14 6 14 14M182 58c0-8 6-14 14-14s14 6 14 14M58 50l18-18c6-6 14-9 22-9h40c9 0 17 4 23 10l17 17h20c6 0 10 4 10 8M30 50h-6c-4 0-6 3-6 8" />
      </svg>
      {label && <p className="eyebrow mt-3 px-4 text-steel-500">{label}</p>}
      <p className="mt-1 text-[11px] text-steel-600">Photo to be supplied</p>
    </div>
  )
}
