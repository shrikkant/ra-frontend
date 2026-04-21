'use client'

import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {parseDates, daysBetween, tierForDays} from '../home/dateUtils'

const TIERS = [
  {days: 2, label: '2d', percent: 10},
  {days: 5, label: '5d', percent: 15},
  {days: 7, label: '7d', percent: 25},
  {days: 10, label: '10d', percent: 35},
  {days: 14, label: '14d', percent: 50},
] as const

export default function SavingsLadder() {
  const stored = useSelector(getDefaultSearch)
  const {start, end} = useMemo(
    () => parseDates((stored as any)?.dates),
    [stored],
  )
  const days = useMemo(() => daysBetween(start, end), [start, end])
  const currentTier = tierForDays(days)

  return (
    <div className="px-4 mt-5">
      <div className="rounded-[14px] border border-line-soft p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
            Savings ladder
          </div>
          <div className="text-[12px] font-mono text-ink-muted">
            now: −{currentTier}%
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 items-end">
          {TIERS.map(t => {
            const reached = days >= t.days
            return (
              <div key={t.days} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-md transition-colors duration-300 ${
                    reached ? 'bg-accent' : 'bg-surface-muted'
                  }`}
                  style={{height: 16 + t.percent * 0.6}}
                />
                <div className="text-[10px] font-mono text-ink-muted">
                  {t.label}
                </div>
                <div
                  className={`text-[11px] font-extrabold ${
                    reached ? 'text-ink' : 'text-ink-subtle'
                  }`}
                >
                  −{t.percent}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
