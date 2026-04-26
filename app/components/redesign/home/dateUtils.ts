import {DISCOUNT_STEPS} from '../../../../config/constants'

export function parseDates(stored: any): {start: Date; end: Date} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const defaultStart = new Date(today)
  defaultStart.setDate(today.getDate() + 2)
  const defaultEnd = new Date(defaultStart)
  defaultEnd.setDate(defaultStart.getDate() + 3)

  if (!stored?.startDate || !stored?.endDate) {
    return {start: defaultStart, end: defaultEnd}
  }
  const start = new Date(stored.startDate)
  const end = new Date(stored.endDate)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {start: defaultStart, end: defaultEnd}
  }
  return {start, end}
}

// Mirrors backend `getRentalPeriodInDays`: counts whole calendar days, where
// same-day = 1, next-day = 1, two days later = 2, etc.
export function daysBetween(a: Date, b: Date): number {
  const startDay = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()
  const endDay = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
  return Math.max(1, Math.round((endDay - startDay) / 86400000))
}

export function tierForDays(d: number): number {
  for (const step of DISCOUNT_STEPS) {
    if (d >= step.days) return step.discount
  }
  return 0
}

const DATE_FMT = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
})
export const fmtDate = (d: Date) => DATE_FMT.format(d)

export const fmtINR = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN')
