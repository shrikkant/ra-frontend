'use client'

import React, {useEffect, useMemo, useRef, useState} from 'react'
import ChatListItem from './ChatListItem'
import ChatFilters from './ChatFilters'
import {InboxFilters, useConversations} from './hooks/useConversations'
import {useInboxNotifications} from './hooks/useInboxNotifications'

interface Props {
  selectedId: string | null
  filters: InboxFilters
  onFiltersChange: (next: InboxFilters) => void
}

const PTR_THRESHOLD = 70 // px pull required to trigger refresh

export default function ChatList({
  selectedId,
  filters,
  onFiltersChange,
}: Props) {
  const {
    conversations,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  } = useConversations(filters)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  // Conversation lookup map for the notifications hook (so it can title
  // the banner with the customer's name, not just the phone).
  const conversationsById = useMemo(() => {
    const m = new Map<string, (typeof conversations)[number]>()
    for (const c of conversations) m.set(c.id, c)
    return m
  }, [conversations])
  const {permission, hasAsked, requestPermission, dismissAsk} =
    useInboxNotifications({conversationsById})

  // Infinite scroll: load the next page when the bottom sentinel enters
  // the viewport. IntersectionObserver is gentler than scroll handlers
  // on mobile.
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

  // Pull-to-refresh: when the user drags down at the top of the list,
  // show a pull indicator and fire refresh() once they cross the
  // threshold. Touch-only — desktops can hit the existing "Refresh"
  // affordance (none yet, follow-up).
  const [pullDistance, setPullDistance] = useState(0)
  const pullStartYRef = useRef<number | null>(null)
  const refreshingRef = useRef(false)

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller || scroller.scrollTop > 0) return
    pullStartYRef.current = e.touches[0].clientY
  }
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pullStartYRef.current === null) return
    const dy = e.touches[0].clientY - pullStartYRef.current
    if (dy <= 0) {
      setPullDistance(0)
      return
    }
    // Resist the pull a bit so it feels rubbery instead of 1:1 drag.
    setPullDistance(Math.min(dy * 0.5, PTR_THRESHOLD * 1.6))
  }
  const onTouchEnd = async () => {
    const distance = pullDistance
    pullStartYRef.current = null
    setPullDistance(0)
    if (distance >= PTR_THRESHOLD && !refreshingRef.current) {
      refreshingRef.current = true
      try {
        await refresh()
      } finally {
        refreshingRef.current = false
      }
    }
  }

  const showNotificationsCta =
    permission === 'default' && !hasAsked

  return (
    <div className="h-full flex flex-col bg-bg">
      <ChatFilters filters={filters} onChange={onFiltersChange} />

      {showNotificationsCta && (
        <div className="shrink-0 border-b border-line bg-accent/15 px-3 py-2 flex items-center gap-2">
          <span className="text-[12px] text-ink flex-1 leading-tight">
            <span className="font-extrabold">Get notified</span> on new
            messages when this tab isn't focused.
          </span>
          <button
            type="button"
            onClick={requestPermission}
            className="shrink-0 text-[11px] font-extrabold uppercase tracking-kicker bg-ink text-surface rounded-full px-2.5 py-1"
          >
            Enable
          </button>
          <button
            type="button"
            onClick={dismissAsk}
            aria-label="Dismiss"
            className="shrink-0 text-[18px] leading-none text-ink-secondary px-1"
          >
            ×
          </button>
        </div>
      )}

      {pullDistance > 0 && (
        <div
          className="shrink-0 flex items-center justify-center text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted overflow-hidden"
          style={{height: `${pullDistance}px`}}
        >
          {pullDistance >= PTR_THRESHOLD ? 'Release to refresh' : 'Pull…'}
        </div>
      )}

      <div
        ref={scrollerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="flex-1 overflow-y-auto"
      >
        {loading && conversations.length === 0 ? (
          <SkeletonList />
        ) : error ? (
          <div className="px-4 py-10 text-center text-[13px] text-ink-muted">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="text-[13px] font-bold text-ink">
              No conversations here
            </div>
            <div className="text-[12px] text-ink-muted mt-1">
              {filters.q
                ? 'Try a different search.'
                : 'Inbound WhatsApp messages will appear here.'}
            </div>
          </div>
        ) : (
          <>
            {conversations.map(row => (
              <ChatListItem
                key={row.id}
                row={row}
                selected={row.id === selectedId}
              />
            ))}
            <div ref={sentinelRef} className="h-1" />
            {loadingMore && (
              <div className="px-4 py-3 text-center text-[12px] text-ink-muted">
                Loading…
              </div>
            )}
            {!hasMore && conversations.length > 0 && (
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
            <div className="h-2.5 w-1/3 bg-surface-muted rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-surface-muted rounded animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  )
}
