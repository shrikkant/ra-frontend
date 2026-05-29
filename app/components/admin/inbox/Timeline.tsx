'use client'

import React, {useEffect, useLayoutEffect, useRef} from 'react'
import MessageBubble from './MessageBubble'
import {OptimisticMessage} from './hooks/useMessages'

interface Props {
  messages: OptimisticMessage[]
  loadingInitial: boolean
  loadingOlder: boolean
  hasMore: boolean
  error: string | null
  onLoadOlder: () => void
}

// Show a day separator above a message whenever its calendar date differs
// from the previous one. Drives the "Today" / "Yesterday" / date pills.
function shouldShowSeparator(
  prev: OptimisticMessage | undefined,
  current: OptimisticMessage,
): boolean {
  if (!prev) return true
  return (
    new Date(prev.createdAt).toDateString() !==
    new Date(current.createdAt).toDateString()
  )
}

export default function Timeline({
  messages,
  loadingInitial,
  loadingOlder,
  hasMore,
  error,
  onLoadOlder,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const topSentinelRef = useRef<HTMLDivElement | null>(null)
  const previousScrollHeightRef = useRef<number>(0)
  const previousLastIdRef = useRef<string | null>(null)
  const previousLengthRef = useRef<number>(0)

  // Auto-scroll behaviour:
  //  - Initial load: jump to bottom (newest).
  //  - New message at the end: if the user is already near the bottom,
  //    follow it; otherwise leave them where they are (Slack-style).
  //  - Loading older: maintain scroll *position* (not offset) — the user
  //    was looking at message X, after prepend they should still see X.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const lastId = messages[messages.length - 1]?.id ?? null
    const lengthGrew = messages.length > previousLengthRef.current
    const newAtBottom =
      lengthGrew &&
      lastId !== previousLastIdRef.current &&
      previousLastIdRef.current !== null

    if (previousLengthRef.current === 0 && messages.length > 0) {
      // First load — scroll to bottom.
      scroller.scrollTop = scroller.scrollHeight
    } else if (loadingOlder === false && previousScrollHeightRef.current > 0) {
      // Just finished loading older — preserve scroll position.
      const delta = scroller.scrollHeight - previousScrollHeightRef.current
      if (delta > 0) {
        scroller.scrollTop = scroller.scrollTop + delta
      }
      previousScrollHeightRef.current = 0
    } else if (newAtBottom) {
      // New message at bottom — follow only if near bottom.
      const distanceFromBottom =
        scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop
      if (distanceFromBottom < 200) {
        scroller.scrollTop = scroller.scrollHeight
      }
    }

    previousLastIdRef.current = lastId
    previousLengthRef.current = messages.length
  }, [messages, loadingOlder])

  // Capture scroll height before a "load older" fetch starts so we can
  // restore scroll position after the prepend.
  const handleLoadOlder = () => {
    if (scrollerRef.current) {
      previousScrollHeightRef.current = scrollerRef.current.scrollHeight
    }
    onLoadOlder()
  }

  // Top sentinel: when it enters view, fetch older.
  useEffect(() => {
    const el = topSentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting) && hasMore && !loadingOlder) {
          handleLoadOlder()
        }
      },
      {rootMargin: '120px'},
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingOlder])

  return (
    <div ref={scrollerRef} className="flex-1 overflow-y-auto bg-bg">
      {hasMore && (
        <div ref={topSentinelRef} className="py-2 text-center">
          {loadingOlder && (
            <span className="text-[12px] text-ink-muted">
              Loading older…
            </span>
          )}
        </div>
      )}

      {loadingInitial && messages.length === 0 ? (
        <SkeletonTimeline />
      ) : error && messages.length === 0 ? (
        <div className="px-4 py-10 text-center text-[13px] text-ink-muted">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <div className="text-[13px] font-bold text-ink">
            No messages yet
          </div>
          <div className="text-[12px] text-ink-muted mt-1">
            Type a message below to start the conversation.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 py-3">
          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              message={m}
              showDaySeparator={shouldShowSeparator(messages[i - 1], m)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SkeletonTimeline() {
  return (
    <div className="flex flex-col gap-3 py-4 px-4">
      {[60, 75, 45, 80, 50].map((w, i) => (
        <div
          key={i}
          className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className="h-9 bg-surface-muted rounded-2xl animate-pulse"
            style={{width: `${w}%`}}
          />
        </div>
      ))}
    </div>
  )
}
