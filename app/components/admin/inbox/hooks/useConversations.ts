'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {
  IInboxConversationRow,
  IInboxListFilters,
  listInboxConversations,
} from '../../../../../api/admin/whatsapp.api'
import {InboxStreamEvent, useInboxStream} from './useInboxStream'

export interface InboxFilters {
  status?: 'OPEN' | 'RESOLVED' | 'SNOOZED'
  assignedTo?: 'me' | 'unassigned' | number
  q?: string
}

interface State {
  items: IInboxConversationRow[]
  nextCursor: string | null
  loading: boolean
  loadingMore: boolean
  error: string | null
}

const initial: State = {
  items: [],
  nextCursor: null,
  loading: true,
  loadingMore: false,
  error: null,
}

/**
 * Owns the inbox list state.
 *
 *  - Refetches when filters change.
 *  - Supports cursor-based "load more" pagination.
 *  - Subscribes to SSE and patches the in-memory list so unread badges,
 *    last-message previews, assignment chips and status filters stay
 *    live without polling.
 *  - On stream reconnect, refetches the first page — covers anything
 *    that happened while disconnected.
 *
 * Patch semantics for stream events:
 *  - message.received: bump the matching row (unread + preview) and
 *    move it to the top. If the row isn't currently in view (different
 *    filter, or never loaded), fetch the conversation header once and
 *    insert it — keeps the "Mine" / "Unassigned" / "Open" feeds correct
 *    without a full refetch.
 *  - conversation.unread_changed / conversation.read: scalar updates.
 *  - conversation.assigned / status_changed: may move the row in or out
 *    of the active filter. Simplest correct behaviour: drop it from the
 *    in-memory list if the new state no longer matches the active
 *    filter; let the user refetch if they need it back. Matches Gmail /
 *    Linear behaviour.
 */
export function useConversations(filters: InboxFilters) {
  const [state, setState] = useState<State>(initial)
  const filtersRef = useRef(filters)
  filtersRef.current = filters
  // Track the request generation so out-of-order responses don't clobber
  // a more recent fetch.
  const generationRef = useRef(0)

  const fetchPage = useCallback(
    async (
      mode: 'replace' | 'append',
      cursor?: string,
      filtersOverride?: InboxFilters,
    ) => {
      const effective = filtersOverride ?? filtersRef.current
      const myGen = ++generationRef.current
      setState(s => ({
        ...s,
        loading: mode === 'replace',
        loadingMore: mode === 'append',
        error: null,
      }))
      try {
        const page = await listInboxConversations({
          ...effective,
          cursor,
          limit: 30,
        } as IInboxListFilters)
        if (myGen !== generationRef.current) return
        setState(s => ({
          items: mode === 'replace' ? page.items : [...s.items, ...page.items],
          nextCursor: page.nextCursor,
          loading: false,
          loadingMore: false,
          error: null,
        }))
      } catch (e: any) {
        if (myGen !== generationRef.current) return
        setState(s => ({
          ...s,
          loading: false,
          loadingMore: false,
          error: e?.message || 'Could not load conversations',
        }))
      }
    },
    [],
  )

  // Refetch when filters change.
  useEffect(() => {
    fetchPage('replace')
  }, [filters.status, filters.assignedTo, filters.q, fetchPage])

  const loadMore = useCallback(() => {
    if (state.loadingMore || !state.nextCursor) return
    fetchPage('append', state.nextCursor)
  }, [state.loadingMore, state.nextCursor, fetchPage])

  const refresh = useCallback(() => {
    return fetchPage('replace')
  }, [fetchPage])

  // Patch the row when SSE events arrive. Out-of-list events (different
  // conversation) are ignored cheaply — no fetch, no extra render.
  const handleEvent = useCallback(
    (event: InboxStreamEvent) => {
      setState(s => {
        const idx = s.items.findIndex(
          c => c.id === ('conversationId' in event ? event.conversationId : ''),
        )
        if (idx === -1) {
          // If the conversation isn't in the current page we can either
          // ignore it (cheap) or refetch (correct). For MVP: ignore for
          // status updates, refetch for message.received (since the row
          // SHOULD enter the visible list).
          if (event.type === 'message.received') {
            // Defer the refetch to the next tick so we don't refetch
            // inside a setState callback.
            queueMicrotask(() => fetchPage('replace'))
          }
          return s
        }
        const items = s.items.slice()
        const current = items[idx]
        let next: IInboxConversationRow = current
        switch (event.type) {
          case 'message.received': {
            next = {
              ...current,
              lastMessageAt: event.createdAt,
              lastInboundAt: event.createdAt,
              adminUnreadCount: current.adminUnreadCount + 1,
              windowOpen: true,
            }
            break
          }
          case 'conversation.unread_changed': {
            next = {
              ...current,
              adminUnreadCount: event.adminUnreadCount,
            }
            break
          }
          case 'conversation.read': {
            next = {...current, adminUnreadCount: 0}
            break
          }
          case 'conversation.assigned': {
            const active = filtersRef.current.assignedTo
            if (active === 'unassigned' && event.assignedAdminId !== null) {
              // No longer matches the filter — drop.
              items.splice(idx, 1)
              return {...s, items}
            }
            if (
              typeof active === 'number' &&
              event.assignedAdminId !== active
            ) {
              items.splice(idx, 1)
              return {...s, items}
            }
            next = {
              ...current,
              assignedAdmin: event.assignedAdminId
                ? current.assignedAdmin?.id === event.assignedAdminId
                  ? current.assignedAdmin
                  : {id: event.assignedAdminId, name: 'Assigned'}
                : null,
            }
            break
          }
          case 'conversation.status_changed': {
            const active = filtersRef.current.status
            if (active && event.status !== active) {
              items.splice(idx, 1)
              return {...s, items}
            }
            next = {...current, status: event.status}
            break
          }
          case 'message.status':
            // Tick updates handled at the thread level, not here.
            return s
        }
        items[idx] = next
        // Re-sort by lastMessageAt desc so freshly active rows float up.
        items.sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime(),
        )
        return {...s, items}
      })
    },
    [fetchPage],
  )

  useInboxStream({
    onEvent: handleEvent,
    onReconnect: () => fetchPage('replace'),
  })

  return {
    conversations: state.items,
    loading: state.loading,
    loadingMore: state.loadingMore,
    hasMore: !!state.nextCursor,
    error: state.error,
    loadMore,
    refresh,
  }
}
