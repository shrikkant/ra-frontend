'use client'

import React, {useState} from 'react'

export type PaymentMethod = 'upi' | 'card' | 'netbanking'

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

interface PaymentStepProps {
  totalPayable: number
  onPay: () => Promise<void> | void
}

export default function PaymentStep({totalPayable, onPay}: PaymentStepProps) {
  const [selected, setSelected] = useState<PaymentMethod>('upi')
  const [paying, setPaying] = useState(false)

  const handlePay = async () => {
    if (paying) return
    setPaying(true)
    try {
      await onPay()
    } finally {
      // `paying` stays true until the page advances; reset just in case
      // Razorpay fails to open.
      setTimeout(() => setPaying(false), 1400)
    }
  }

  return (
    <div className="px-4 pt-5 space-y-3">
      <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
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

      <div className="bg-surface rounded-[18px] border border-line-soft p-4 mt-2">
        <div className="flex items-center justify-between">
          <div className="text-[13px] text-ink-secondary">Total payable</div>
          <div className="font-mono text-[18px] font-extrabold text-ink">
            {fmtINR(totalPayable)}
          </div>
        </div>
      </div>

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
          <>Pay {fmtINR(totalPayable)} →</>
        )}
      </button>
    </div>
  )
}
