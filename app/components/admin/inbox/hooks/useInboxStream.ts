'use client'

import {useEffect, useRef} from 'react'
import {ENV_CONFIG} from '../../../../../config/environment'

// Event shapes mirror caramel's InboxEvent union. Kept loose (the
// frontend doesn't need exhaustive discrimination at the listener boundary)
// — consumers can refine via `event.type`.
export type InboxStreamEvent =
  | {
      type: 'message.received'
      conversationId: string
      phone: string
      messageId: string
      direction: 'inbound'
      createdAt: string
    }
  | {
      type: 'message.sent'
      conversationId: string | null
      phone: string
      messageId: string
      wamid: string
      messageType: string
      content: any
      status: string
      createdAt: string
      clientId?: string
    }
  | {
      type: 'message.status'
      messageId: string
      wamid: string
      status: string
    }
  | {
      type: 'conversation.assigned'
      conversationId: string
      assignedAdminId: number | null
    }
  | {
      type: 'conversation.status_changed'
      conversationId: string
      status: 'OPEN' | 'RESOLVED' | 'SNOOZED'
    }
  | {
      type: 'conversation.read'
      conversationId: string
      readByAdminId: number
    }
  | {
      type: 'conversation.unread_changed'
      conversationId: string
      adminUnreadCount: number
    }

export type InboxStreamStatus = 'connecting' | 'open' | 'reconnecting'

interface UseInboxStreamOptions {
  /** Called for every inbox event (heartbeats are filtered out). */
  onEvent: (event: InboxStreamEvent) => void
  /**
   * Called whenever the stream re-opens (initial connect + every
   * reconnect). Use this to re-sync — e.g. refetch the conversation list
   * — so anything dropped while disconnected gets picked up via REST.
   */
  onReconnect?: () => void
  /** Optional status hook for a "Reconnecting…" UI indicator. */
  onStatusChange?: (status: InboxStreamStatus) => void
}

/**
 * Subscribe to the caramel inbox SSE stream.
 *
 * Behaviour:
 *  - Opens an EventSource (auth via JWT cookie — EventSource can't send
 *    custom headers).
 *  - On error, closes the connection and reconnects with exponential
 *    backoff (1s → 2s → … capped at 30s).
 *  - On `visibilitychange = visible`, re-opens if the connection died
 *    while the tab was backgrounded — mobile networks drop SSE
 *    aggressively when a tab is hidden.
 *  - Heartbeats are filtered before the consumer's onEvent fires.
 *  - On every successful reopen, calls onReconnect — wire this to a
 *    REST refetch so dropped events get caught up via the list/thread
 *    endpoints rather than expecting historical replay from the stream.
 *
 * The hook intentionally takes callbacks via refs (not via deps) so
 * consumers don't have to memoise them — preventing the SSE from
 * tearing down and reconnecting on every render.
 */
export function useInboxStream(opts: UseInboxStreamOptions) {
  const onEventRef = useRef(opts.onEvent)
  const onReconnectRef = useRef(opts.onReconnect)
  const onStatusChangeRef = useRef(opts.onStatusChange)
  onEventRef.current = opts.onEvent
  onReconnectRef.current = opts.onReconnect
  onStatusChangeRef.current = opts.onStatusChange

  useEffect(() => {
    const url = `${ENV_CONFIG.CLIENT_API_V1_URL}whatsapp/inbox/stream`
    let es: EventSource | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let reconnectDelay = 1000
    let stopped = false

    const setStatus = (status: InboxStreamStatus) => {
      onStatusChangeRef.current?.(status)
    }

    const open = () => {
      if (stopped) return
      setStatus(es ? 'reconnecting' : 'connecting')
      try {
        es = new EventSource(url, {withCredentials: true})
      } catch {
        scheduleReconnect()
        return
      }

      es.onopen = () => {
        reconnectDelay = 1000
        setStatus('open')
        onReconnectRef.current?.()
      }

      es.onmessage = e => {
        try {
          const parsed = JSON.parse(e.data)
          if (parsed?.type && parsed.type !== 'heartbeat') {
            onEventRef.current?.(parsed as InboxStreamEvent)
          }
        } catch {
          // Skip malformed payloads silently — server-side bug fixed
          // upstream is more useful than dumping to the console here.
        }
      }

      es.onerror = () => {
        // EventSource will auto-retry in some browsers, but the recovery
        // is opaque (no backoff, no max attempts) — own the lifecycle
        // ourselves for predictable behaviour.
        es?.close()
        es = null
        scheduleReconnect()
      }
    }

    const scheduleReconnect = () => {
      if (stopped) return
      setStatus('reconnecting')
      if (reconnectTimer) clearTimeout(reconnectTimer)
      reconnectTimer = setTimeout(open, reconnectDelay)
      reconnectDelay = Math.min(reconnectDelay * 2, 30000)
    }

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      // Mobile browsers + corporate proxies will silently drop the SSE
      // when the tab is hidden. Reopen on return — onReconnect will
      // re-sync state via REST.
      if (!es) {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer)
          reconnectTimer = null
        }
        reconnectDelay = 1000
        open()
      }
    }

    open()
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      stopped = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      es?.close()
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
}
