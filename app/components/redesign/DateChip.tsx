'use client'

import React from 'react'
import {useSelector} from 'react-redux'
import {
  getDefaultSearch,
  hasDates as hasDatesSelector,
} from '../../../app-store/session/session.slice'
import {parseDates} from './home/dateUtils'
import {useDatePicker} from './DatePickerProvider'
import {CalendarIcon} from './icons'

const MONTH_FMT = new Intl.DateTimeFormat('en-IN', {month: 'short'})
const month = (d: Date) => MONTH_FMT.format(d)

function formatRange(start: Date, end: Date): string {
  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()
  if (sameMonth) {
    return `${start.getDate()} – ${end.getDate()} ${month(end)}`
  }
  if (sameYear) {
    return `${start.getDate()} ${month(start)} – ${end.getDate()} ${month(end)}`
  }
  return `${start.getDate()} ${month(start)} – ${end.getDate()} ${month(end)} ${end.getFullYear()}`
}

interface DateChipProps {
  /** Visual size; mobile header uses `compact`, desktop nav uses `default`. */
  variant?: 'default' | 'compact'
}

/**
 * Persistent date-context affordance. Empty state is a primary CTA
 * (accent background) — picking dates is the friction step that gates
 * the rest of the funnel. Filled state demotes to a quiet neutral chip
 * showing the selected range.
 */
export default function DateChip({variant = 'default'}: DateChipProps) {
  const stored = useSelector(getDefaultSearch)
  const hasDates = useSelector(hasDatesSelector)
  const {open} = useDatePicker()

  const label = (() => {
    if (!hasDates) return 'Add dates'
    const {start, end} = parseDates((stored as any)?.dates)
    return formatRange(start, end)
  })()

  const sizing =
    variant === 'compact'
      ? 'h-9 px-3 text-[12px] gap-1.5'
      : 'h-10 px-4 text-[13px] gap-2'

  const tone = hasDates
    ? 'bg-surface border border-line text-ink'
    : 'bg-accent border border-accent text-ink'

  return (
    <button
      type="button"
      onClick={open}
      data-date-chip
      aria-label={hasDates ? `Rental dates: ${label}` : 'Pick rental dates'}
      className={`inline-flex items-center rounded-full font-bold whitespace-nowrap ${sizing} ${tone}`}
    >
      <CalendarIcon size={variant === 'compact' ? 14 : 16} />
      <span>{label}</span>
    </button>
  )
}
