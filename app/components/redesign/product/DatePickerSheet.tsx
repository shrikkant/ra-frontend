'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Sheet from '../Sheet'
import {
  getDefaultSearch,
  hasDates as hasDatesSelector,
  setSearch,
} from '../../../../app-store/session/session.slice'
import {parseDates, daysBetween} from '../home/dateUtils'

interface DatePickerSheetProps {
  open: boolean
  onClose: () => void
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function startOfDay(d: Date) {
  const next = new Date(d)
  next.setHours(0, 0, 0, 0)
  return next
}

function buildGrid(start: Date): Date[] {
  const today = startOfDay(start)
  // Anchor to Monday of the current week so the grid's first row is
  // weekday-aligned. If today is Wed, we still show today's row from Mon.
  const dayOfWeek = (today.getDay() + 6) % 7 // 0 = Mon
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)
  const cells: Date[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    cells.push(d)
  }
  return cells
}

const PRESETS: {label: string; days: number}[] = [
  {label: '2d', days: 2},
  {label: '5d', days: 5},
  {label: '1w', days: 7},
  {label: '2w', days: 14},
]

export default function DatePickerSheet({open, onClose}: DatePickerSheetProps) {
  const dispatch = useDispatch()
  const stored = useSelector(getDefaultSearch)
  const hasStoredDates = useSelector(hasDatesSelector)
  const initial = useMemo(
    () => parseDates((stored as any)?.dates),
    [stored],
  )
  const today = useMemo(() => startOfDay(new Date()), [])

  // Pristine = the user has never picked dates this session, so the sheet
  // shows no pre-selection. First tap sets `start` cleanly; second tap
  // sets `end`. Without this, the sheet seeded both endpoints from
  // parseDates' invented defaults (today+2 → today+5), which made the
  // first tap behave like "extend the existing range" — the source of
  // the "I picked 7 to 9 but it counted as 1 day" confusion.
  const [start, setStart] = useState<Date>(
    hasStoredDates ? initial.start : today,
  )
  const [end, setEnd] = useState<Date | null>(
    hasStoredDates ? initial.end : null,
  )
  const [pristine, setPristine] = useState<boolean>(!hasStoredDates)

  useEffect(() => {
    if (open) {
      if (hasStoredDates) {
        setStart(initial.start)
        setEnd(initial.end)
        setPristine(false)
      } else {
        setStart(today)
        setEnd(null)
        setPristine(true)
      }
    }
  }, [open, hasStoredDates, initial.start, initial.end, today])

  const grid = useMemo(() => buildGrid(today), [today])
  const monthLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      year: 'numeric',
    })
    return fmt.format(start)
  }, [start])

  const days = end ? daysBetween(start, end) : 1

  const onCellTap = (d: Date) => {
    if (d < today) return
    const ds = ymd(d)
    // Pristine sheet (no stored dates yet): first tap unambiguously
    // establishes start. Range gets built by the second tap.
    if (pristine) {
      setStart(d)
      setEnd(null)
      setPristine(false)
      return
    }
    if (!end) {
      // Choosing the end after start was set
      if (d > start) {
        setEnd(d)
      } else {
        setStart(d)
      }
      return
    }
    if (ds === ymd(start) || ds === ymd(end)) {
      // Tap on existing endpoint resets to single-day with d as start
      setStart(d)
      setEnd(null)
      return
    }
    if (d > start && d < end) {
      // Inside range → reset, keep d as start
      setStart(d)
      setEnd(null)
      return
    }
    if (d < start) {
      setStart(d)
      return
    }
    setEnd(d)
  }

  const applyPreset = (n: number) => {
    // Presets anchor on today when pristine (user hasn't picked a start
    // yet) — taps the obvious "rent for N days starting today" intent.
    const anchor = pristine ? today : start
    if (pristine) {
      setStart(anchor)
      setPristine(false)
    }
    const e = new Date(anchor)
    e.setDate(anchor.getDate() + n - 1)
    setEnd(e)
  }

  const confirm = () => {
    const e = end ?? start
    dispatch(
      setSearch({
        ...(stored ?? {}),
        dates: {
          startDate: '' + start,
          endDate: '' + e,
          key: 'selection',
        },
      }),
    )
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} label="Pick rental dates" maxHeight="85vh">
      <div className="px-4 pt-1 pb-3">
        <div className="text-[20px] font-extrabold tracking-tight-md text-ink">
          Rental dates
        </div>
        <div className="text-[12px] font-mono text-ink-muted mt-0.5">
          {monthLabel}
        </div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-7 gap-y-1">
          {WEEKDAYS.map(w => (
            <div
              key={w}
              className="text-center text-[10px] uppercase tracking-kicker font-bold text-ink-muted py-1.5"
            >
              {w}
            </div>
          ))}
          {grid.map(d => {
            const ds = ymd(d)
            const isPast = d < today
            // While pristine, no cells are visually selected — the sheet
            // shows an empty calendar so the first tap is unambiguous.
            const isStart = !pristine && ds === ymd(start)
            const isEnd = !pristine && end ? ds === ymd(end) : false
            const inRange = !pristine && end ? d > start && d < end : false
            return (
              <button
                key={ds}
                type="button"
                onClick={() => onCellTap(d)}
                disabled={isPast}
                className={`relative h-[42px] flex items-center justify-center text-[14px] font-semibold ${
                  isPast ? 'text-ink-subtle' : 'text-ink'
                }`}
              >
                {(inRange || isStart || isEnd) && (
                  <span
                    aria-hidden
                    className={`absolute inset-y-1 left-0 right-0 ${
                      isStart && !isEnd ? '' : ''
                    } ${isStart ? 'rounded-l-full' : ''} ${
                      isEnd ? 'rounded-r-full' : ''
                    } ${
                      isStart || isEnd ? 'bg-ink' : 'bg-accent-soft'
                    }`}
                    style={
                      isStart && isEnd
                        ? {borderRadius: 999}
                        : undefined
                    }
                  />
                )}
                <span
                  className={`relative ${
                    isStart || isEnd ? 'text-surface font-bold' : ''
                  }`}
                >
                  {d.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4 flex gap-2">
        {PRESETS.map(p => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.days)}
            className="flex-1 py-2 rounded-full bg-surface-muted text-[13px] font-semibold text-ink"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="sticky bottom-0 bg-surface border-t border-line p-4 mt-4">
        <button
          type="button"
          onClick={confirm}
          disabled={pristine}
          className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 disabled:opacity-40"
        >
          {pristine
            ? 'Pick a date to start'
            : `Confirm ${days} ${days === 1 ? 'day' : 'days'}`}
        </button>
      </div>
    </Sheet>
  )
}
