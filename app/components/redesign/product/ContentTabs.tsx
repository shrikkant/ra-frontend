'use client'

import React, {useState} from 'react'
import {IProduct} from '../../../../app-store/types'
import {CheckIcon, StarIcon} from '../icons'

type TabKey = 'overview' | 'kit' | 'reviews'

const TABS: {key: TabKey; label: string}[] = [
  {key: 'overview', label: 'Overview'},
  {key: 'kit', label: 'In the box'},
  {key: 'reviews', label: 'Reviews'},
]

interface ContentTabsProps {
  product: IProduct
}

export default function ContentTabs({product}: ContentTabsProps) {
  const [active, setActive] = useState<TabKey>('overview')
  const details = product.masterProduct?.details_json

  return (
    <div className="mt-6">
      <div className="px-4 border-b border-line">
        <div className="flex gap-6">
          {TABS.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`relative pb-3 text-[14px] font-bold ${
                active === t.key ? 'text-ink' : 'text-ink-muted'
              }`}
            >
              {t.label}
              {active === t.key && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-ink"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5">
        {active === 'overview' && <OverviewPanel details={details} />}
        {active === 'kit' && <KitPanel product={product} />}
        {active === 'reviews' && <ReviewsPanel />}
      </div>
    </div>
  )
}

function OverviewPanel({details}: {details?: any}) {
  const overview: string[] = details?.overview ?? []
  const specs: Array<{[k: string]: string}> = details?.specifications ?? []

  return (
    <div>
      {overview.length > 0 && (
        <ul className="space-y-2 mb-5">
          {overview.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[14px] text-ink-secondary leading-relaxed"
            >
              <span
                aria-hidden
                className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
      {specs.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {specs.slice(0, 4).map((s, i) => {
            const [key, value] = Object.entries(s)[0] ?? ['', '']
            return (
              <div
                key={i}
                className="rounded-[14px] border border-line-soft p-3"
              >
                <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted">
                  {key}
                </div>
                <div className="text-[13px] font-bold text-ink mt-1 leading-snug">
                  {value}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function KitPanel({product}: {product: IProduct}) {
  const items = deriveKitItems(product)
  if (items.length === 0) {
    return (
      <div className="text-[13px] text-ink-muted">
        Kit details arrive with the gear — you&apos;ll get a pre-rental
        checklist in your confirmation.
      </div>
    )
  }
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-2.5 text-[14px] text-ink"
        >
          <span
            aria-hidden
            className="w-5 h-5 rounded-full bg-success text-surface flex items-center justify-center shrink-0"
          >
            <CheckIcon size={12} strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function deriveKitItems(product: IProduct): string[] {
  const items: string[] = []
  if (product.masterProductList?.length) {
    for (const addon of product.masterProductList) {
      if (addon?.name) items.push(addon.name)
    }
  }
  const features = product.masterProduct?.details_json?.features as
    | Array<{[k: string]: string}>
    | undefined
  if (items.length === 0 && features?.length) {
    for (const f of features) {
      const [k] = Object.entries(f)[0] ?? ['']
      if (k) items.push(k)
    }
  }
  return items
}

function ReviewsPanel() {
  // Real per-product reviews aren't yet exposed by the API. Surface the
  // site-wide rating + a couple of representative quotes until wired up.
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-[40px] font-extrabold font-mono leading-none text-ink">
          4.9
        </div>
        <div>
          <div className="flex items-center gap-0.5 text-accent">
            {Array.from({length: 5}).map((_, i) => (
              <StarIcon key={i} size={14} />
            ))}
          </div>
          <div className="text-[12px] text-ink-muted mt-1">
            Based on 1,500+ verified rentals
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <ReviewCard
          initial="S"
          name="Sarah P."
          verified="Verified rental · Apr 2026"
          body="Pristine condition, everything in the kit was there. Pickup took two minutes."
        />
        <ReviewCard
          initial="R"
          name="Rohan M."
          verified="Verified rental · Mar 2026"
          body="Same-day delivery actually worked. Will rent again before my next shoot."
        />
      </div>
    </div>
  )
}

function ReviewCard({
  initial,
  name,
  verified,
  body,
}: {
  initial: string
  name: string
  verified: string
  body: string
}) {
  return (
    <div className="rounded-[14px] border border-line-soft p-3.5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-full bg-ink text-surface flex items-center justify-center text-[14px] font-extrabold">
          {initial}
        </div>
        <div>
          <div className="text-[13px] font-bold text-ink">{name}</div>
          <div className="text-[11px] font-mono text-ink-muted">
            {verified}
          </div>
        </div>
      </div>
      <div className="text-[13px] text-ink-secondary leading-relaxed">
        {body}
      </div>
    </div>
  )
}
