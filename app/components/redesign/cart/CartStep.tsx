'use client'

import React, {useMemo} from 'react'
import Link from 'next/link'
import {useDispatch, useSelector} from 'react-redux'
import {IOrder, IOrderItem, IProduct} from '../../../../app-store/types'
import {fetchCart, removeFromCart} from '../../../../api/user/orders.api'
import {setCart} from '../../../../app-store/user/orders/orders.slice'
import {
  getDefaultSearch,
} from '../../../../app-store/session/session.slice'
import {
  parseDates,
  daysBetween,
  tierForDays,
  fmtDate,
  orderCalendarDate,
} from '../home/dateUtils'
import {productPhotoUrl} from '../../../../util/product-image.util'
import {CloseIcon, CartIcon} from '../icons'

const fmtINR = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN')

interface CartStepProps {
  cart: IOrder | null | undefined
  loading: boolean
  onContinue: () => void
  onEditDates: () => void
}

export default function CartStep({
  cart,
  loading,
  onContinue,
  onEditDates,
}: CartStepProps) {
  const dispatch = useDispatch()
  const stored = useSelector(getDefaultSearch)
  // The order owns the rental window — every line item is priced against
  // it. Render the pill from the order itself so the pill, the line
  // items and the discount badge can never disagree. The Redux session
  // search is the user's last *search*, not what the cart is priced for,
  // so it's only a fallback for the brief pre-load window.
  const {start, end, days} = useMemo(() => {
    // Recover the calendar day from UTC components — the raw timestamp,
    // read in IST, can be a day ahead of the date the user picked.
    const s = cart?.start_date ? orderCalendarDate(cart.start_date) : null
    const e = cart?.end_date ? orderCalendarDate(cart.end_date) : null
    if (s && e && !isNaN(s.getTime()) && !isNaN(e.getTime())) {
      return {start: s, end: e, days: daysBetween(s, e)}
    }
    const parsed = parseDates((stored as any)?.dates)
    return {
      start: parsed.start,
      end: parsed.end,
      days: daysBetween(parsed.start, parsed.end),
    }
  }, [cart?.start_date, cart?.end_date, stored])

  const items = cart?.items ?? []

  const removeItem = async (id: number) => {
    if (!cart?.items) return
    const optimistic: IOrder = {
      ...cart,
      items: cart.items.filter(it => it.id !== id),
    }
    dispatch(setCart(optimistic))
    try {
      await removeFromCart(id)
      const fresh = await fetchCart()
      dispatch(setCart(fresh))
    } catch {
      dispatch(setCart(cart))
    }
  }

  if (loading) {
    return (
      <div className="px-4 pt-6 space-y-3">
        {[1, 2].map(i => (
          <div
            key={i}
            className="h-20 rounded-[14px] bg-surface-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyCart />
  }

  // Backend stores `rent` and `original_rent` as line totals (qty × per-day × days),
  // not per-day rates. Sum them as-is; do not multiply by days.
  const subtotal = items.reduce(
    (s, it) => s + Number(it.original_rent ?? it.rent ?? 0),
    0,
  )
  const discount = Math.max(
    0,
    items.reduce(
      (s, it) => s + (Number(it.original_rent ?? 0) - Number(it.rent ?? 0)),
      0,
    ),
  )
  // Step 1 shows the rental amount only. Delivery vs. free store pickup
  // is chosen later (AddressStep), so a delivery fee here would wrongly
  // imply delivery is mandatory — the fee is applied in the payment step.
  const rentalTotal = subtotal - discount
  const tier = tierForDays(days)

  return (
    <div className="px-4 pt-5 space-y-4">
      <div className="bg-ink rounded-full pl-4 pr-1 py-1 flex items-center gap-3">
        <div className="flex-1 min-w-0 text-surface text-[13px] py-1.5">
          <span className="font-semibold">
            {fmtDate(start)} → {fmtDate(end)}
          </span>
          <span className="ml-2 font-mono font-bold">
            {days}d
          </span>
          {tier > 0 && (
            <span className="ml-2 text-accent text-[12px] font-bold">
              −{tier}%
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onEditDates}
          className="bg-accent text-ink text-[12px] font-extrabold px-3.5 py-2 rounded-full"
        >
          Edit
        </button>
      </div>

      <ul className="bg-surface rounded-[18px] border border-line-soft divide-y divide-line-soft">
        {items.map(it => (
          <li key={it.id}>
            <ItemRow
              item={it}
              days={days}
              onRemove={() => removeItem(it.id)}
            />
          </li>
        ))}
      </ul>

      <div className="bg-surface rounded-[18px] border border-line-soft p-4">
        <Row label="Subtotal" value={fmtINR(subtotal)} />
        {discount > 0 && (
          <Row
            label="Discount"
            value={`−${fmtINR(discount)}`}
            tone="success"
            nowrap
          />
        )}
        <div className="border-t border-line-soft my-2.5" />
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-extrabold text-ink">
            Rental total
          </div>
          <div className="font-mono text-[17px] font-extrabold text-ink">
            {fmtINR(rentalTotal)}
          </div>
        </div>
        <div className="text-[12px] text-ink-muted mt-2">
          Delivery or free store pickup is chosen at the next step.
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5"
      >
        Continue to address →
      </button>
    </div>
  )
}

function ItemRow({
  item,
  days,
  onRemove,
}: {
  item: IOrderItem
  // The whole order shares one rental window, so day count comes from the
  // order — not `item.days`, which is unset on cart transactions and
  // defaults to 1 (the source of the "× 1d" mismatch in the pill).
  days: number
  onRemove: () => void
}) {
  const product: IProduct = item.product
  const safeDays = Math.max(1, days)
  const qty = Math.max(1, Number(item.qty ?? 1))
  const lineTotal = Number(item.rent ?? 0)
  const perDay = Math.round(lineTotal / qty / safeDays)
  const img = product ? productPhotoUrl(product, 160) : null

  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <div className="relative w-[72px] h-[72px] rounded-[12px] bg-surface-muted overflow-hidden shrink-0">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product?.title ?? 'Product'}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-2"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted">
          {product?.subCategory?.title ?? 'Rental'}
        </div>
        <div className="text-[14px] font-bold text-ink leading-tight line-clamp-2">
          {product?.title ?? 'Item'}
        </div>
        <div className="font-mono text-[12px] text-ink-muted mt-0.5">
          ₹{perDay} × {days}d{qty > 1 ? ` × ${qty}` : ''} ={' '}
          <span className="text-ink font-bold">{fmtINR(lineTotal)}</span>
        </div>
      </div>
      <button
        type="button"
        aria-label={`Remove ${product?.title ?? 'item'}`}
        onClick={onRemove}
        className="w-8 h-8 rounded-full bg-surface-muted text-ink-secondary flex items-center justify-center shrink-0"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  )
}

function Row({
  label,
  value,
  tone,
  nowrap,
}: {
  label: string
  value: string
  tone?: 'success'
  nowrap?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="text-[13px] text-ink-secondary">{label}</div>
      <div
        className={`font-mono text-[13px] font-bold ${
          tone === 'success' ? 'text-success' : 'text-ink'
        }`}
        style={nowrap ? {whiteSpace: 'nowrap'} : undefined}
      >
        {value}
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="text-center py-20 px-8">
      <div
        aria-hidden
        className="mx-auto w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center text-ink-muted"
      >
        <CartIcon size={32} />
      </div>
      <div className="text-[18px] font-extrabold text-ink mt-4">
        Your cart is empty
      </div>
      <div className="text-[13px] text-ink-muted mt-1">
        Browse the catalog and add gear to get started.
      </div>
      <Link
        href="/"
        className="inline-block mt-6 bg-ink text-surface text-[13px] font-extrabold px-5 py-2.5 rounded-full no-underline"
      >
        Browse gear
      </Link>
    </div>
  )
}
