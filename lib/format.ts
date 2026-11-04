const baseOptions = { calendar: 'gregory', numberingSystem: 'latn', timeZone: 'UTC' } as const

const longDate = new Intl.DateTimeFormat('ar', { ...baseOptions, weekday: 'long', day: 'numeric', month: 'long' })
const shortDate = new Intl.DateTimeFormat('ar', { ...baseOptions, day: 'numeric', month: 'short' })

function toDate(date: string) {
  return new Date(`${date}T00:00:00Z`)
}

export function formatLongDate(date: string) {
  return longDate.format(toDate(date))
}

export function formatShortDate(date: string) {
  return shortDate.format(toDate(date))
}

export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'ص' : 'م'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function initials(name: string) {
  return name.trim().charAt(0)
}
