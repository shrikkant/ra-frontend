'use client'

import React, {useEffect, useRef, useState} from 'react'
import {SearchIcon, CloseIcon} from '../../redesign/icons'
import CustomerListItem from './CustomerListItem'
import {useCustomersDirectory} from './hooks/useCustomersDirectory'

interface Props {
  selectedUserId: number | null
}

/**
 * Left-pane list for the "All customers" view: a users-driven directory so
 * every customer appears — including email-only signups with no WhatsApp
 * conversation. Search + infinite scroll, mirroring the conversation inbox.
 */
export default function CustomerDirectory({selectedUserId}: Props) {
  // Debounce the search box so each keystroke doesn't fire a request.
  const [rawQuery, setRawQuery] = useState('')
  const [query, setQuery] = useState<string | undefined>(undefined)
  useEffect(() => {
    const t = setTimeout(
      () => setQuery(rawQuery.trim() || undefined),
      300,
    )
    return () => clearTimeout(t)
  }, [rawQuery])

  const {customers, total, loading, loadingMore, hasMore, error, loadMore} =
    useCustomersDirectory(query)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting) && hasMore && !loadingMore) {
          loadMore()
        }
      },
      {rootMargin: '160px'},
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, loadingMore, loadMore])

  return (
    <div className="h-full flex flex-col bg-bg">
      <div className="shrink-0 border-b border-line bg-bg/95 backdrop-blur sticky top-0 z-10">
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2 bg-surface border border-line rounded-full h-9 px-3">
            <SearchIcon size={14} className="text-ink-muted shrink-0" />
            <input
              type="search"
              value={rawQuery}
              onChange={e => setRawQuery(e.target.value)}
              placeholder="Search name, email or phone"
              aria-label="Search customers"
              className="flex-1 min-w-0 bg-transparent text-[13px] text-ink placeholder:text-ink-muted outline-none"
            />
            {rawQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setRawQuery('')}
                className="text-ink-muted shrink-0"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
        </div>
        {!loading && !error && (
          <div className="px-4 pb-2 text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted">
            {total.toLocaleString('en-IN')}{' '}
            {total === 1 ? 'customer' : 'customers'}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && customers.length === 0 ? (
          <SkeletonList />
        ) : error ? (
          <div className="px-4 py-10 text-center text-[13px] text-ink-muted">
            {error}
          </div>
        ) : customers.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="text-[13px] font-bold text-ink">
              No customers found
            </div>
            <div className="text-[12px] text-ink-muted mt-1">
              {query ? 'Try a different search.' : 'Customers will appear here.'}
            </div>
          </div>
        ) : (
          <>
            {customers.map(row => (
              <CustomerListItem
                key={row.id}
                row={row}
                selected={row.id === selectedUserId}
              />
            ))}
            <div ref={sentinelRef} className="h-1" />
            {loadingMore && (
              <div className="px-4 py-3 text-center text-[12px] text-ink-muted">
                Loading…
              </div>
            )}
            {!hasMore && customers.length > 0 && (
              <div className="px-4 py-4 text-center text-[11px] text-ink-muted">
                End of list
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SkeletonList() {
  return (
    <ul>
      {Array.from({length: 8}).map((_, i) => (
        <li
          key={i}
          className="flex items-start gap-3 px-3 py-3 border-b border-line-soft"
        >
          <div className="w-11 h-11 rounded-full bg-surface-muted animate-pulse" />
          <div className="flex-1 min-w-0 space-y-1.5 pt-1">
            <div className="h-3 w-1/2 bg-surface-muted rounded animate-pulse" />
            <div className="h-2.5 w-2/3 bg-surface-muted rounded animate-pulse" />
            <div className="h-2.5 w-1/3 bg-surface-muted rounded animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  )
}
