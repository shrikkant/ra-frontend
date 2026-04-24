'use client'

import React, {useMemo, useRef} from 'react'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {parseDates, daysBetween, tierForDays} from '../home/dateUtils'
import {useAddToCart} from '../useAddToCart'
import {IProduct} from '../../../../app-store/types'

interface InlineCTAProps {
  product: IProduct
}

const fmtINR = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN')

/**
 * Desktop equivalent of StickyCTABar — sits inline next to the rental
 * card / meta column. No backdrop blur, no fixed positioning.
 */
export default function InlineCTA({product}: InlineCTAProps) {
  const stored = useSelector(getDefaultSearch)
  const {start, end} = useMemo(
    () => parseDates((stored as any)?.dates),
    [stored],
  )
  const days = useMemo(() => daysBetween(start, end), [start, end])
  const tier = useMemo(() => tierForDays(days), [days])
  const {add, pendingId} = useAddToCart()
  const ref = useRef<HTMLDivElement>(null)

  const rate = product.rate || product.rates?.[0]?.rate || 0
  const effectivePercent = Math.max(tier, product.discount_percent || 0)
  const total = rate * days * (1 - effectivePercent / 100)

  const onAdd = () => {
    const rect = ref.current?.getBoundingClientRect() ?? null
    add({
      productId: product.id,
      productName: product.title,
      rate,
      fromRect: rect,
    })
  }

  return (
    <div
      ref={ref}
      className="bg-surface border border-line-soft rounded-[18px] p-4 flex items-center gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-kicker font-bold text-ink-muted">
          Total · {days} {days === 1 ? 'day' : 'days'}
        </div>
        <div className="font-mono text-[24px] font-extrabold text-ink leading-tight">
          {fmtINR(total)}
        </div>
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={pendingId === product.id}
        className="bg-ink text-surface text-[14px] font-extrabold rounded-full px-6 py-3.5 disabled:opacity-50"
      >
        Add to cart
      </button>
    </div>
  )
}
