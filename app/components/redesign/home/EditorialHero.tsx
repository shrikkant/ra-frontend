'use client'

import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {StarIcon, BoltIcon} from '../icons'
import {parseDates, daysBetween, tierForDays, fmtDate} from './dateUtils'

export default function EditorialHero() {
  const stored = useSelector(getDefaultSearch)
  const {start, end} = useMemo(
    () => parseDates((stored as any)?.dates),
    [stored],
  )
  const days = useMemo(() => daysBetween(start, end), [start, end])
  const tier = useMemo(() => tierForDays(days), [days])

  return (
    <section className="px-4 pt-4">
      <div className="inline-flex items-center gap-1.5 text-[12px] bg-surface border border-line rounded-full px-2.5 py-1.5">
        <StarIcon size={13} className="text-accent" />
        <span className="font-bold text-ink">4.9</span>
        <span className="text-ink-secondary">· 1,500+ rentals · Pune</span>
      </div>

      <h1 className="text-[40px] font-extrabold tracking-tight-2xl leading-[0.98] text-ink mt-1.5">
        Pro gear,
        <br />
        <span className="bg-gradient-to-r from-accent via-accent to-ink bg-clip-text text-transparent">
          zero commitment.
        </span>
      </h1>

      <p className="text-[14px] text-ink-secondary mt-2 mx-0.5 leading-relaxed">
        Cameras, lenses and lights delivered to your door. From ₹450/day, no
        deposit.
      </p>

      <DateTape
        start={start}
        end={end}
        days={days}
        tier={tier}
      />
    </section>
  )
}

function DateTape({
  start,
  end,
  days,
  tier,
}: {
  start: Date
  end: Date
  days: number
  tier: number
}) {
  return (
    <button
      type="button"
      className="relative mt-4 w-full bg-ink rounded-4xl pt-4 px-4.5 pb-6 overflow-hidden flex items-center gap-3 shadow-card-hover text-left"
      aria-label={`Edit rental dates: ${fmtDate(start)} to ${fmtDate(end)}, ${days} days`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-kicker font-semibold text-white/60">
          Rental period
        </div>
        <div className="text-[16px] font-bold text-white mt-0.5 truncate">
          {fmtDate(start)} → {fmtDate(end)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[11px] uppercase tracking-kicker font-semibold text-white/60">
          Days
        </div>
        <div className="font-mono text-[22px] font-extrabold text-white">
          {String(days).padStart(2, '0')}
        </div>
      </div>
      {tier > 0 && (
        <div className="absolute top-3 right-3 bg-accent text-ink text-[11px] font-extrabold px-2 py-1 rounded-lg flex items-center gap-1">
          <BoltIcon size={12} />−{tier}%
        </div>
      )}
      {/* Scrubber tick marks */}
      <svg
        aria-hidden
        className="absolute left-0 bottom-1.5 w-full h-2 opacity-30"
        preserveAspectRatio="none"
      >
        {Array.from({length: 30}).map((_, i) => (
          <rect
            key={i}
            x={i * 12 + 4}
            y={i % 5 === 0 ? 0 : 3}
            width="1"
            height={i % 5 === 0 ? 8 : 4}
            fill="#fff"
          />
        ))}
      </svg>
    </button>
  )
}
