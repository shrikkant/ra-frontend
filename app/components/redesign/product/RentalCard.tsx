'use client'

import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {parseDates, daysBetween, tierForDays, fmtDate} from '../home/dateUtils'

interface RentalCardProps {
  onEdit: () => void
}

export default function RentalCard({onEdit}: RentalCardProps) {
  const stored = useSelector(getDefaultSearch)
  const {start, end} = useMemo(
    () => parseDates((stored as any)?.dates),
    [stored],
  )
  const days = useMemo(() => daysBetween(start, end), [start, end])
  const tier = useMemo(() => tierForDays(days), [days])

  return (
    <div className="px-4 mt-4">
      <button
        type="button"
        onClick={onEdit}
        className="w-full bg-ink rounded-[18px] p-4 text-left flex items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-kicker font-bold text-white/60">
            Your rental
          </div>
          <div className="text-[15px] font-bold text-surface mt-0.5">
            {fmtDate(start)} → {fmtDate(end)}
          </div>
          <div className="text-[12px] text-white/70 mt-0.5">
            <span className="font-mono font-bold text-surface">{days}</span>
            <span> {days === 1 ? 'day' : 'days'}</span>
            {tier > 0 && (
              <span className="text-accent">
                {' '}· you save {tier}%
              </span>
            )}
          </div>
        </div>
        <span className="shrink-0 bg-accent text-ink text-[12px] font-extrabold px-3 py-2 rounded-full">
          Edit dates
        </span>
      </button>
    </div>
  )
}
