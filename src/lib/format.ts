import type { Vehicle } from '../types'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-IN')

export const formatINR = (n: number) => inr.format(n)
export const formatNumber = (n: number) => num.format(n)
export const formatKm = (n: number) => `${num.format(n)} km`

/** ₹13.25 Lakh / ₹1.24 Cr */
export function formatLakh(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2).replace(/\.?0+$/, '')} Cr`
  return `₹${(n / 1_00_000).toFixed(2).replace(/\.?0+$/, '')} Lakh`
}

export const vehicleTitle = (v: Pick<Vehicle, 'make' | 'model' | 'mfgYear'>) => `${v.mfgYear} ${v.make} ${v.model}`

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const fuelLabel = (f: string) => (f === 'cng' ? 'CNG' : cap(f))
export const transmissionLabel = (t: string) => cap(t)
export const bodyLabel = (b: string) => (b === 'suv' ? 'SUV' : b === 'muv' ? 'MUV' : cap(b))

export function ownerLabel(n: number) {
  const s = n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`
  return `${s} owner`
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const monthYear = (year: number, month?: number) => (month ? `${months[month - 1]} ${year}` : `${year}`)

export function formatDate(iso: string | undefined, withYear = true) {
  if (!iso) return '—'
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) })
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.round(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d} d ago`
  return formatDate(iso)
}

export const accidentLabel: Record<string, string> = {
  none: 'No accidents reported',
  minor: 'Minor, disclosed',
  major: 'Major, disclosed',
  unknown: 'Not known',
}
export const serviceLabel: Record<string, string> = {
  full_authorised: 'Full authorised service history',
  partial: 'Partial service records',
  none: 'No records',
  unknown: 'Not known',
}
export const insuranceLabel: Record<string, string> = {
  comprehensive: 'Comprehensive',
  zero_dep: 'Zero depreciation',
  third_party: 'Third party',
  expired: 'Expired',
}
