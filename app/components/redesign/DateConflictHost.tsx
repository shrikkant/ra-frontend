'use client'

import React, {useSyncExternalStore} from 'react'
import Sheet from './Sheet'
import {
  subscribe,
  getSnapshot,
  resolveDateChoice,
} from './dateConflictStore'

const DATE_FMT = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
})

const fmt = (s: string) => {
  const d = new Date(s)
  return isNaN(d.getTime()) ? s : DATE_FMT.format(d)
}

const range = (w: {startDate: string; endDate: string} | null) =>
  w ? `${fmt(w.startDate)} → ${fmt(w.endDate)}` : ''

/**
 * Single mount point for the add-to-cart date-conflict prompt. Driven by
 * `dateConflictStore`; `useAddToCart` opens it via `requestDateChoice`.
 * Rendered once in the root layout — the Sheet portals to `document.body`
 * so its position in the tree doesn't matter.
 */
export default function DateConflictHost() {
  const {open, cart, picked} = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  )

  return (
    <Sheet
      open={open}
      // Dismissing (backdrop / Escape) keeps the cart's existing window —
      // the conservative choice that changes nothing already in the cart.
      onClose={() => resolveDateChoice('cart')}
      label="Rental dates differ"
    >
      <div className="p-5">
        <div className="text-[20px] font-extrabold tracking-tight-md text-ink">
          Your cart has different dates
        </div>
        <p className="text-[13px] text-ink-secondary mt-2 leading-relaxed">
          Everything in one order shares a single rental window. Your cart
          is booked for{' '}
          <span className="font-bold text-ink">{range(cart)}</span>, but
          you picked <span className="font-bold text-ink">{range(picked)}</span>{' '}
          for this item.
        </p>

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={() => resolveDateChoice('cart')}
            className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3.5"
          >
            Keep {range(cart)}
          </button>
          <button
            type="button"
            onClick={() => resolveDateChoice('picked')}
            className="w-full bg-surface-muted text-ink text-[14px] font-extrabold rounded-full py-3.5"
          >
            Change all items to {range(picked)}
          </button>
        </div>
      </div>
    </Sheet>
  )
}
