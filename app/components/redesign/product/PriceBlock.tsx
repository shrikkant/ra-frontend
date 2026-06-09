import React from 'react'

const fmtINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

interface PriceBlockProps {
  /** Base (undiscounted) per-day rate. */
  rate: number
  days: number
  /** Effective discount already applied to the total, in percent. */
  effectivePercent: number
  total: number
  /** `lg` for the desktop inline CTA, `sm` for the mobile sticky bar. */
  size?: 'lg' | 'sm'
}

/**
 * Price hierarchy for the rental CTA. We lead with the *per-day* rate —
 * the number renters anchor on — instead of the multi-day total, which
 * reads as "expensive" at a glance. The discount is emphasized (struck
 * base rate + pill); the total is demoted to a quiet secondary line.
 */
export default function PriceBlock({
  rate,
  days,
  effectivePercent,
  total,
  size = 'lg',
}: PriceBlockProps) {
  const hasDiscount = effectivePercent > 0
  const perDay = rate * (1 - effectivePercent / 100)
  const heroCls = size === 'lg' ? 'text-[26px]' : 'text-[22px]'

  return (
    <div className="min-w-0">
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span
          className={`font-mono ${heroCls} font-extrabold text-ink leading-none`}
        >
          {fmtINR(perDay)}
        </span>
        <span className="text-[13px] font-bold text-ink-muted">/day</span>
        {hasDiscount && (
          <span className="font-mono text-[13px] text-ink-muted line-through">
            {fmtINR(rate)}
          </span>
        )}
        {hasDiscount && (
          <span className="bg-accent text-ink text-[11px] font-extrabold px-2 py-0.5 rounded-full leading-none">
            {effectivePercent}% off
          </span>
        )}
      </div>
      <div className="text-[12px] text-ink-muted mt-1.5">
        {fmtINR(total)} total · {days} {days === 1 ? 'day' : 'days'}
      </div>
    </div>
  )
}
