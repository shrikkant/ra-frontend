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

// Inclusive day count: same-day = 1, next-day = 2, May 7 → May 9 = 3.
// IMPORTANT: backend `getRentalPeriodInDays` must use the same rule, or
// the displayed total will diverge from the cart total at checkout.
export function daysBetween(a: Date, b: Date): number {
  const startDay = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()
  const endDay = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
  return Math.max(1, Math.round((endDay - startDay) / 86400000) + 1)
}

// An order's `start_date` / `end_date` come back as timestamps. The
// backend stamps a business hour (9am / 7pm) onto the calendar day the
// user picked, so the stored *instant* depends on the server timezone —
// but its UTC date-component is always that calendar day (9–19 o'clock
// stays inside one UTC day whether the server runs in UTC or IST).
// Reading the timestamp with local getters in a browser ahead of UTC
// (IST) rolls it forward — "26 May 19:00Z" renders as "27 May". So
// recover the calendar day from UTC components and rebuild a local
// midnight Date that fmtDate / daysBetween can treat normally.
export function orderCalendarDate(value: string | Date): Date {
  const d = new Date(value)
  if (isNaN(d.getTime())) return d
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
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

// Default rental window for users who haven't picked yet — tomorrow
// for 7 inclusive days. Returns the format the redux store and
// DatePickerSheet both consume (`'' + Date` legacy serialization).
export function defaultDatesPayload(): {
  startDate: string
  endDate: string
  key: 'selection'
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(today.getDate() + 1)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return {
    startDate: '' + start,
    endDate: '' + end,
    key: 'selection',
  }
}

// True when stored dates are missing OR the start date has rolled into
// the past (returning user with stale picks). In either case, the
// caller should re-seed defaults.
export function shouldSeedDefaults(stored: any): boolean {
  const d = stored?.dates
  if (!d?.startDate || !d?.endDate) return true
  const start = new Date(d.startDate)
  if (isNaN(start.getTime())) return true
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  )
  return startDay < today
}
