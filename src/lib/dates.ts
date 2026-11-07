/** Local yyyy-mm-dd for a Date. */
export function ymd(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const todayYmd = () => ymd(new Date())

export function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

/** ISO timestamp n minutes before now. */
export const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString()
export const daysAgo = (d: number, hour = 11) => {
  const x = addDays(new Date(), -d)
  x.setHours(hour, (d * 17) % 60, 0, 0)
  return x.toISOString()
}
export const daysFromNowYmd = (d: number) => ymd(addDays(new Date(), d))

export function isOverdueOrToday(day?: string) {
  return !!day && day <= todayYmd()
}
