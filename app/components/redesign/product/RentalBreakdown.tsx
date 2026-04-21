'use client'

import React, {useMemo} from 'react'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {parseDates, daysBetween, tierForDays} from '../home/dateUtils'

interface RentalBreakdownProps {
  rate: number
  productDiscountPercent?: number
}

const fmtINR = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN')

export default function RentalBreakdown({
  rate,
  productDiscountPercent = 0,
}: RentalBreakdownProps) {
  const stored = useSelector(getDefaultSearch)
  const {start, end} = useMemo(
    () => parseDates((stored as any)?.dates),
    [stored],
  )
  const days = useMemo(() => daysBetween(start, end), [start, end])
  const tier = useMemo(() => tierForDays(days), [days])
  const effectivePercent = Math.max(tier, productDiscountPercent)
  const subtotal = rate * days
  const discount = Math.round((subtotal * effectivePercent) / 100)
  const total = subtotal - discount

  return (
    <div className="px-4 mt-4">
      <div className="rounded-[14px] border border-line-soft p-4">
        <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary mb-3">
          Rental breakdown
        </div>
        <Row
          label={`${fmtINR(rate)} × ${days} ${days === 1 ? 'day' : 'days'}`}
          value={fmtINR(subtotal)}
        />
        {discount > 0 && (
          <Row
            label={`Discount (−${effectivePercent}%)`}
            value={`−${fmtINR(discount)}`}
            tone="success"
          />
        )}
        <div className="border-t border-line-soft my-2.5" />
        <Row
          label="Total"
          value={fmtINR(total)}
          bold
        />
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  bold = false,
  tone,
}: {
  label: string
  value: string
  bold?: boolean
  tone?: 'success'
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div
        className={`text-[14px] ${bold ? 'font-extrabold text-ink' : 'text-ink-secondary'}`}
      >
        {label}
      </div>
      <div
        className={`font-mono text-[14px] ${
          bold
            ? 'font-extrabold text-ink text-[16px]'
            : tone === 'success'
              ? 'font-bold text-success'
              : 'font-bold text-ink'
        }`}
        style={{whiteSpace: 'nowrap'}}
      >
        {value}
      </div>
    </div>
  )
}
