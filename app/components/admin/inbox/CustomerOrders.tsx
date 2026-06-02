'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {format} from 'date-fns'
import {fetchCustomerOrders} from '../../../../api/admin/customers.api'
import {IOrder} from '../../../../app-store/types'
import {resolveOrderStage, formatCurrency} from '../../../../util/global.util'
import {ChevronRightIcon} from '../../redesign/icons'

interface Props {
  userId: number
}

function fmtDate(date: Date | string | undefined): string {
  if (!date) return '—'
  try {
    return format(new Date(date), 'dd MMM yy')
  } catch {
    return '—'
  }
}

const stageBadgeClass = (stage: number): string => {
  switch (stage) {
    case 0:
      return 'bg-yellow-100 text-yellow-800'
    case 1:
      return 'bg-blue-100 text-blue-800'
    case 3:
      return 'bg-green-100 text-green-800'
    case 4:
      return 'bg-emerald-100 text-emerald-800'
    default:
      return 'bg-surface-muted text-ink-secondary'
  }
}

/**
 * Compact rental history for the customer profile pane. Reuses the admin
 * users orders endpoint (every order for the user, regardless of stage).
 */
export default function CustomerOrders({userId}: Props) {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchCustomerOrders(userId)
      .then(data => {
        if (cancelled) return
        setOrders(Array.isArray(data) ? data : [])
      })
      .catch(e => {
        if (cancelled) return
        setError(e?.message || 'Could not load orders')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  return (
    <div className="rounded-[16px] bg-surface border border-line overflow-hidden">
      <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-kicker font-extrabold text-ink-secondary">
          Orders
        </span>
        {!loading && !error && (
          <span className="text-[12px] font-mono text-ink-muted">
            {orders.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="p-4 space-y-2">
          <div className="h-10 rounded-lg bg-surface-muted animate-pulse" />
          <div className="h-10 rounded-lg bg-surface-muted animate-pulse" />
        </div>
      ) : error ? (
        <div className="px-4 py-6 text-center text-[12px] text-ink-muted">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="px-4 py-6 text-center text-[12px] text-ink-muted">
          No orders yet.
        </div>
      ) : (
        <ul className="divide-y divide-line-soft">
          {orders.map(order => (
            <li key={order.id}>
              <Link
                href={`/p/admin/orders/${order.id}`}
                className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-surface-muted/60"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-ink-muted">
                      #{order.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-kicker ${stageBadgeClass(
                        order.stage,
                      )}`}
                    >
                      {resolveOrderStage(order.stage) ?? '—'}
                    </span>
                  </div>
                  <div className="text-[13px] font-bold text-ink truncate mt-0.5">
                    {order.items?.[0]?.product?.title ?? 'Rental'}
                    {order.items && order.items.length > 1 && (
                      <span className="text-ink-muted font-normal">
                        {' '}
                        · +{order.items.length - 1} more
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted truncate mt-0.5">
                    {fmtDate(order.start_date)} → {fmtDate(order.end_date)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-bold text-ink">
                    {formatCurrency(order.total_amount || order.amount)}
                  </div>
                </div>
                <ChevronRightIcon
                  size={14}
                  className="text-ink-muted shrink-0 group-hover:text-ink"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
