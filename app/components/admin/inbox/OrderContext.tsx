'use client'

import React from 'react'
import Link from 'next/link'
import {ChevronRightIcon} from '../../redesign/icons'
import {IInboxOrderContext} from '../../../../api/admin/whatsapp.api'

interface Props {
  data: IInboxOrderContext | null
  loading: boolean
}

const fmtINR = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN')

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const sameYear = d.getFullYear() === today.getFullYear()
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : {year: 'numeric'}),
  })
}

function tier(count: number): string {
  if (count >= 25) return 'Platinum'
  if (count >= 10) return 'Gold'
  if (count >= 3) return 'Silver'
  return 'Bronze'
}

export default function OrderContext({data, loading}: Props) {
  if (loading) {
    return (
      <div className="shrink-0 border-b border-line bg-bg/60 px-3 lg:px-5 py-2.5">
        <div className="h-4 w-2/3 bg-surface-muted rounded animate-pulse" />
      </div>
    )
  }
  if (!data) return null

  const {activeOrder, totalOrders, lifetimeSpend} = data
  const hasHistory = totalOrders > 0
  if (!activeOrder && !hasHistory) {
    // First-touch customer — say so quietly rather than show nothing.
    return (
      <div className="shrink-0 border-b border-line bg-bg/60 px-3 lg:px-5 py-2 text-[12px] text-ink-muted">
        No rentals yet — first-touch customer.
      </div>
    )
  }

  return (
    <div className="shrink-0 border-b border-line bg-bg/60">
      {activeOrder ? (
        <Link
          href={`/p/admin/orders/${activeOrder.id}`}
          className="flex items-center gap-2.5 px-3 lg:px-5 py-2.5 no-underline group hover:bg-surface-muted/60"
        >
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-success/15 text-success text-[14px] shrink-0"
          >
            📦
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-kicker font-extrabold text-success">
                Active rental
              </span>
              <span className="text-[10px] font-mono text-ink-muted truncate">
                {activeOrder.orderRef}
              </span>
            </div>
            <div className="text-[13px] font-bold text-ink truncate">
              {activeOrder.items[0]?.title ?? 'Rental'}
              {activeOrder.items.length > 1 && (
                <span className="text-ink-muted font-normal">
                  {' '}
                  · +{activeOrder.items.length - 1} more
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-ink-muted truncate">
              {activeOrder.startDate
                ? `${formatShortDate(activeOrder.startDate)} → ${formatShortDate(
                    activeOrder.endDate,
                  )}`
                : `Returns ${formatShortDate(activeOrder.endDate)}`}
              {activeOrder.daysRemaining > 0 && (
                <>
                  {' · '}
                  {activeOrder.daysRemaining}d left
                </>
              )}
              {' · '}
              {fmtINR(activeOrder.totalAmount)}
            </div>
          </div>
          <ChevronRightIcon
            size={14}
            className="text-ink-muted shrink-0 group-hover:text-ink"
          />
        </Link>
      ) : null}
      {hasHistory && (
        <div
          className={`flex items-center gap-3 px-3 lg:px-5 py-1.5 text-[11px] font-mono text-ink-muted ${
            activeOrder ? 'border-t border-line-soft' : ''
          }`}
        >
          <span className="font-extrabold uppercase tracking-kicker text-ink-secondary">
            {tier(totalOrders)}
          </span>
          <span>·</span>
          <span>
            {totalOrders} {totalOrders === 1 ? 'rental' : 'rentals'}
          </span>
          {lifetimeSpend > 0 && (
            <>
              <span>·</span>
              <span>{fmtINR(lifetimeSpend)} lifetime</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
