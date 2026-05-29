'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {
  IInboxMessage,
  listInboxMessages,
} from '../../../../../api/admin/whatsapp.api'
import {InboxStreamEvent, useInboxStream} from './useInboxStream'

export interface OptimisticMessage extends IInboxMessage {
  optimistic?: 'sending' | 'sent' | 'failed'
  // Client-generated correlation id. The backend echoes it back in the
  // `message.sent` SSE event so we can replace the optimistic bubble
  // with the canonical persisted row without a refetch.
  clientId?: string
}

interface State {
  items: OptimisticMessage[]
  oldestCursor: string | null
  hasMore: boolean
  loadingInitial: boolean
  loadingOlder: boolean
  error: string | null
}

const initial: State = {
  items: [],
  oldestCursor: null,
  hasMore: false,
  loadingInitial: true,
  loadingOlder: false,
  error: null,
}

/**
 * Owns the thread state for a single conversation.
 *
 *  - First page (newest 30) loads on conversation change.
 *  - `loadOlder()` paginates upward using `before=oldestCreatedAt`.
 *  - SSE events:
 *      - message.received: append (it's an inbound message for this thread)
 *      - message.status: in-place update of an existing bubble's ticks
 *  - On stream reconnect or conversation change, the initial page
 *    refetches — anything dropped while disconnected is caught up
 *    without needing historical replay from the stream.
 *  - Optimistic outbound: `appendOptimistic(text)` returns the local id.
 *    `markOptimisticSent(id)` / `markOptimisticFailed(id)` update state.
 *    Optimistic rows hang around until the next refetch (visibility flip
 *    or reconnect) when the real persisted row replaces them; matching
 *    by wamid isn't possible here because the queue worker assigns it
 *    asynchronously.
 *
 * Internal ordering: state.items is stored chronologically (oldest →
 * newest) so the UI just maps in order. The backend returns newest-first
 * for efficient cursor pagination — we reverse on receive.
 */
export function useMessages(conversationId: string | null) {
  const [state, setState] = useState<State>(initial)
  const generationRef = useRef(0)

  const fetchInitial = useCallback(async (id: string) => {
    const myGen = ++generationRef.current
    setState({...initial})
    try {
      const page = await listInboxMessages(id, {limit: 30})
      if (myGen !== generationRef.current) return
      // Backend returns newest-first; reverse to chronological for render.
      const chrono = [...page.items].reverse()
      setState({
        items: chrono,
        oldestCursor: chrono[0]?.createdAt ?? null,
        hasMore: !!page.nextCursor,
        loadingInitial: false,
        loadingOlder: false,
        error: null,
      })
    } catch (e: any) {
      if (myGen !== generationRef.current) return
      setState(s => ({
        ...s,
        loadingInitial: false,
        error: e?.message || 'Could not load messages',
      }))
    }
  }, [])

  // Refetch on conversation change.
  useEffect(() => {
    if (conversationId) fetchInitial(conversationId)
    else setState(initial)
  }, [conversationId, fetchInitial])

  const loadOlder = useCallback(async () => {
    if (!conversationId) return
    setState(s => {
      if (s.loadingOlder || !s.hasMore || !s.oldestCursor) return s
      return {...s, loadingOlder: true}
    })
    const before = state.oldestCursor
    if (!before) return
    try {
      const page = await listInboxMessages(conversationId, {
        before,
        limit: 30,
      })
      const chrono = [...page.items].reverse()
      setState(s => ({
        ...s,
        items: [...chrono, ...s.items],
        oldestCursor: chrono[0]?.createdAt ?? s.oldestCursor,
        hasMore: !!page.nextCursor,
        loadingOlder: false,
      }))
    } catch (e: any) {
      setState(s => ({
        ...s,
        loadingOlder: false,
        error: e?.message || 'Could not load older messages',
      }))
    }
  }, [conversationId, state.oldestCursor])

  const handleEvent = useCallback(
    (event: InboxStreamEvent) => {
      if (!conversationId) return
      switch (event.type) {
        case 'message.received': {
          if (event.conversationId !== conversationId) return
          // Refetch the latest page to pull the new message in shape — the
          // event payload is light (just ids + timestamps), not the full
          // message row. Cheap: 30-message page.
          fetchInitial(conversationId)
          return
        }
        case 'message.sent': {
          if (event.conversationId && event.conversationId !== conversationId) {
            return
          }
          setState(s => {
            // Try to find the matching optimistic bubble by clientId.
            const idx = event.clientId
              ? s.items.findIndex(m => m.clientId === event.clientId)
              : -1
            const persisted: OptimisticMessage = {
              id: event.messageId,
              wamid: event.wamid,
              phone: event.phone,
              direction: 'outbound',
              messageType: event.messageType,
              content: event.content,
              status: event.status,
              createdAt: event.createdAt,
              updatedAt: event.createdAt,
            }
            // If found, swap in place — preserves visual order. Otherwise
            // append (e.g., the message was sent from another tab/session
            // and we have no local optimistic for it).
            if (idx !== -1) {
              const items = s.items.slice()
              items[idx] = persisted
              return {...s, items}
            }
            // Dedup: if a row with the same wamid already exists (refetch
            // raced ahead of the SSE), don't append a duplicate.
            if (s.items.some(m => m.wamid === event.wamid && event.wamid)) {
              return s
            }
            return {...s, items: [...s.items, persisted]}
          })
          return
        }
        case 'message.status': {
          setState(s => {
            const idx = s.items.findIndex(m => m.wamid === event.wamid)
            if (idx === -1) return s
            const items = s.items.slice()
            items[idx] = {...items[idx], status: event.status}
            return {...s, items}
          })
          return
        }
      }
    },
    [conversationId, fetchInitial],
  )

  useInboxStream({
    onEvent: handleEvent,
    onReconnect: () => {
      if (conversationId) fetchInitial(conversationId)
    },
  })

  // Optimistic API for the composer. The returned id doubles as the
  // clientId we pass to the backend so the SSE `message.sent` event can
  // find this bubble to replace it.
  const appendOptimistic = useCallback((text: string): string => {
    const id = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()
    const optimistic: OptimisticMessage = {
      id,
      wamid: '',
      phone: '',
      direction: 'outbound',
      messageType: 'text',
      content: {body: text},
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      optimistic: 'sending',
      clientId: id,
    }
    setState(s => ({...s, items: [...s.items, optimistic]}))
    return id
  }, [])

  /**
   * Optimistic image bubble. `previewUrl` is typically a blob: URL built
   * from the user's File; we render it immediately. After send confirms,
   * the actual persisted URL replaces it on the next refetch — caller
   * should also revoke the blob URL via URL.revokeObjectURL when done.
   */
  const appendOptimisticImage = useCallback(
    (args: {previewUrl: string; caption?: string}): string => {
      const id = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const now = new Date().toISOString()
      const optimistic: OptimisticMessage = {
        id,
        wamid: '',
        phone: '',
        direction: 'outbound',
        messageType: 'image',
        content: {localUrl: args.previewUrl, caption: args.caption},
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        optimistic: 'sending',
        clientId: id,
      }
      setState(s => ({...s, items: [...s.items, optimistic]}))
      return id
    },
    [],
  )

  const markOptimistic = useCallback(
    (id: string, state: 'sent' | 'failed') => {
      setState(s => {
        const idx = s.items.findIndex(m => m.id === id)
        if (idx === -1) return s
        const items = s.items.slice()
        items[idx] = {...items[idx], optimistic: state}
        return {...s, items}
      })
    },
    [],
  )

  const removeOptimistic = useCallback((id: string) => {
    setState(s => ({...s, items: s.items.filter(m => m.id !== id)}))
  }, [])

  return {
    messages: state.items,
    loadingInitial: state.loadingInitial,
    loadingOlder: state.loadingOlder,
    hasMore: state.hasMore,
    error: state.error,
    loadOlder,
    appendOptimistic,
    appendOptimisticImage,
    markOptimistic,
    removeOptimistic,
  }
}
