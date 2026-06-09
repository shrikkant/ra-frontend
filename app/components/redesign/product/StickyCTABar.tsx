'use client'

import React, {useMemo, useRef} from 'react'
import {useSelector} from 'react-redux'
import {getDefaultSearch} from '../../../../app-store/session/session.slice'
import {parseDates, daysBetween, tierForDays} from '../home/dateUtils'
import {useAddToCart} from '../useAddToCart'
import {IProduct} from '../../../../app-store/types'
import PriceBlock from './PriceBlock'

interface StickyCTABarProps {
  product: IProduct
}

export default function StickyCTABar({product}: StickyCTABarProps) {
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
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 bg-bg/85 border-t border-line px-4 py-3 flex items-center gap-3"
      style={{backdropFilter: 'blur(12px)'}}
    >
      <div className="flex-1 min-w-0">
        <PriceBlock
          rate={rate}
          days={days}
          effectivePercent={effectivePercent}
          total={total}
          size="sm"
        />
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
