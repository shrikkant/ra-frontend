'use client'

import React, {useState} from 'react'
import type {PaymentMethod} from '../../../../util/razorpay.util'

export type {PaymentMethod}

const METHODS: Array<{
  key: PaymentMethod
  title: string
  sub: string
  glyph: string
}> = [
  {key: 'upi', title: 'UPI', sub: 'GPay, PhonePe, Paytm…', glyph: '◉'},
  {key: 'card', title: 'Card', sub: 'Credit or debit card', glyph: '▭'},
  {key: 'netbanking', title: 'Net Banking', sub: 'All major banks', glyph: '⎈'},
]

const fmtINR = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN')

export interface PriceBreakdown {
  rental: number
  deliveryFee: number
  deliveryLabel: string // e.g. "Delivery (same-day)" or "Self pickup"
  gstRate: number // e.g. 18
  gst: number
  total: number
}

interface PaymentStepProps {
  breakdown: PriceBreakdown
  onPay: (method: PaymentMethod) => Promise<void> | void
}

export default function PaymentStep({breakdown, onPay}: PaymentStepProps) {
  const [selected, setSelected] = useState<PaymentMethod>('upi')
  const [paying, setPaying] = useState(false)

  const handlePay = async () => {
    if (paying) return
    setPaying(true)
    try {
      await onPay(selected)
    } finally {
      setTimeout(() => setPaying(false), 1400)
    }
  }

  return (
    <div className="px-4 pt-5 space-y-4">
      <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
        Order summary
      </div>

      <div className="bg-surface rounded-[18px] border border-line-soft overflow-hidden">
        <BreakdownRow label="Rental" value={fmtINR(breakdown.rental)} />
        <BreakdownRow
          label={breakdown.deliveryLabel}
          value={
            breakdown.deliveryFee === 0 ? 'FREE' : fmtINR(breakdown.deliveryFee)
          }
        />
        {breakdown.gstRate > 0 && (
          <BreakdownRow
            label={`GST (${breakdown.gstRate}%)`}
            value={fmtINR(breakdown.gst)}
            sublabel="Applied on rental"
          />
        )}
        <div className="flex items-center justify-between px-4 py-3.5 bg-surface-muted border-t border-line-soft">
          <div className="text-[14px] font-extrabold text-ink">
            Total payable
          </div>
          <div className="font-mono text-[18px] font-extrabold text-ink">
            {fmtINR(breakdown.total)}
          </div>
        </div>
      </div>

      <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary pt-1">
        Choose a payment method
      </div>

      {METHODS.map(m => {
        const active = selected === m.key
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => setSelected(m.key)}
            className={`w-full flex items-center gap-3 text-left rounded-[14px] p-3 ${
              active
                ? 'bg-surface border border-ink'
                : 'bg-surface border border-line-soft'
            }`}
          >
            <span
              aria-hidden
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[20px] shrink-0 ${
                active
                  ? 'bg-ink text-surface'
                  : 'bg-surface-muted text-ink-secondary'
              }`}
            >
              {m.glyph}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-extrabold text-ink">
                {m.title}
              </div>
              <div className="text-[12px] text-ink-muted mt-0.5">{m.sub}</div>
            </div>
            <span
              aria-hidden
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                active ? 'border-ink' : 'border-line'
              }`}
            >
              {active && (
                <span className="block w-2.5 h-2.5 rounded-full bg-ink" />
              )}
            </span>
          </button>
        )
      })}

      <button
        type="button"
        onClick={handlePay}
        disabled={paying}
        className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {paying ? (
          <>
            <span
              aria-hidden
              className="inline-block w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin"
            />
            Opening payment…
          </>
        ) : (
          <>Pay {fmtINR(breakdown.total)} →</>
        )}
      </button>
    </div>
  )
}

function BreakdownRow({
  label,
  value,
  sublabel,
}: {
  label: string
  value: string
  sublabel?: string
}) {
  return (
    <div className="flex items-start justify-between px-4 py-3 border-b border-line-soft last:border-b-0">
      <div className="min-w-0">
        <div className="text-[14px] text-ink">{label}</div>
        {sublabel && (
          <div className="text-[11px] text-ink-muted mt-0.5">{sublabel}</div>
        )}
      </div>
      <div className="font-mono text-[14px] font-extrabold text-ink shrink-0 ml-3">
        {value}
      </div>
    </div>
  )
}
