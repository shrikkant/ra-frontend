'use client'

import React from 'react'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../../app-store/session/session.slice'
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
 * Persistent date-context affordance. DatePickerProvider seeds defaults
 * (tomorrow + 7 days) on mount, so the chip always has a range to show.
 * Tapping opens the picker for editing.
 */
export default function DateChip({variant = 'default'}: DateChipProps) {
  const stored = useSelector(getDefaultSearch)
  const {open} = useDatePicker()

  const {start, end} = parseDates((stored as any)?.dates)
  const label = formatRange(start, end)

  const sizing =
    variant === 'compact'
      ? 'h-9 px-3 text-[12px] gap-1.5'
      : 'h-10 px-4 text-[13px] gap-2'

  return (
    <button
      type="button"
      onClick={open}
      data-date-chip
      aria-label={`Rental dates: ${label}. Tap to edit.`}
      className={`inline-flex items-center rounded-full font-bold whitespace-nowrap bg-surface border border-line text-ink ${sizing}`}
    >
      <CalendarIcon size={variant === 'compact' ? 14 : 16} />
      <span>{label}</span>
    </button>
  )
}
