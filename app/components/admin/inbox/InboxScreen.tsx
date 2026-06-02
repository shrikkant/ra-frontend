'use client'

import React, {useMemo, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import ChatList from './ChatList'
import ChatView from './ChatView'
import {InboxFilters} from './hooks/useConversations'

interface Props {
  selectedId?: string | null
  // Rendered at the very top of the left pane (above the chat list) — used
  // to inject the Inbox / All customers view toggle.
  topSlot?: React.ReactNode
}

// URL <-> filter mapping. Filters live in query params so a refreshed or
// shared link lands on the same view. Status and assignedTo are the only
// axes worth round-tripping; the search box is intentionally local
// (re-typing on reload is fine and avoids polluting the URL).
function readFilters(params: URLSearchParams | null): InboxFilters {
  if (!params) return {}
  const status = params.get('status')
  const assignedTo = params.get('assignedTo')
  const next: InboxFilters = {}
  if (status === 'OPEN' || status === 'RESOLVED' || status === 'SNOOZED') {
    next.status = status
  }
  if (assignedTo === 'me' || assignedTo === 'unassigned') {
    next.assignedTo = assignedTo
  } else if (assignedTo && /^\d+$/.test(assignedTo)) {
    next.assignedTo = Number(assignedTo)
  }
  return next
}

function writeFilters(base: URLSearchParams, filters: InboxFilters): string {
  const p = new URLSearchParams(base)
  if (filters.status) p.set('status', filters.status)
  else p.delete('status')
  if (filters.assignedTo !== undefined)
    p.set('assignedTo', String(filters.assignedTo))
  else p.delete('assignedTo')
  return p.toString()
}

/**
 * Two-pane on desktop, single-pane navigation on mobile. The URL drives
 * which conversation is selected:
 *   /p/admin/customers           → list only
 *   /p/admin/customers/:id       → list (desktop) / chat (mobile)
 */
export default function InboxScreen({selectedId = null, topSlot}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlFilters = useMemo(
    () => readFilters(searchParams ?? null),
    [searchParams],
  )
  // Local-only search query — not persisted to URL (see readFilters note).
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  const filters: InboxFilters = useMemo(
    () => ({...urlFilters, q: searchQuery}),
    [urlFilters, searchQuery],
  )

  const onFiltersChange = (next: InboxFilters) => {
    setSearchQuery(next.q)
    const base = new URLSearchParams(searchParams?.toString() ?? '')
    const qs = writeFilters(base, next)
    const pathname = selectedId
      ? `/p/admin/customers/${selectedId}`
      : '/p/admin/customers'
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div
      className="flex bg-bg text-ink"
      style={{height: 'calc(100vh - 64px)'}}
    >
      <aside
        className={`${
          selectedId ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-[360px] xl:w-[400px] shrink-0 flex-col border-r border-line`}
      >
        {topSlot}
        <ChatList
          selectedId={selectedId}
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      </aside>

      <main
        className={`${
          selectedId ? 'flex' : 'hidden lg:flex'
        } flex-1 flex-col min-w-0`}
      >
        {selectedId ? (
          <ChatView conversationId={selectedId} />
        ) : (
          <EmptyPane />
        )}
      </main>
    </div>
  )
}

function EmptyPane() {
  return (
    <div className="h-full flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <div className="w-14 h-14 rounded-full bg-surface border border-line mx-auto mb-4 flex items-center justify-center text-[24px]">
          💬
        </div>
        <div className="text-[15px] font-extrabold text-ink mb-1">
          Pick a conversation
        </div>
        <div className="text-[12px] text-ink-muted leading-relaxed">
          Customer enquiries land here as they come in. Filters above narrow
          the list — assign yourself one and dive in.
        </div>
      </div>
    </div>
  )
}
