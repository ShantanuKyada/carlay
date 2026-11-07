export type Errors<T> = Partial<Record<keyof T, string>>

export const isIndianMobile = (v: string) => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim())
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export function required(v: unknown, label: string) {
  if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) return `${label} is required`
  return undefined
}

export function phoneError(v: string) {
  if (!v.trim()) return 'Phone number is required'
  if (!isIndianMobile(v)) return 'Enter a valid 10-digit Indian mobile number'
  return undefined
}

export function emailError(v: string, optional = true) {
  if (!v.trim()) return optional ? undefined : 'Email is required'
  if (!isEmail(v)) return 'Enter a valid email address'
  return undefined
}

export function hasErrors<T>(e: Errors<T>) {
  return Object.values(e).some(Boolean)
}

export const newRef = (prefix: string) => {
  const d = new Date()
  const yymm = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}`
  return `${prefix}-${yymm}-${String(Math.floor(1000 + Math.random() * 9000))}`
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
