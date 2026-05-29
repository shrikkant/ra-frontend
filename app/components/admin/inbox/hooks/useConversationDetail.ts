'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {
  IInboxConversationDetail,
  IInboxWindowStatus,
  getInboxConversation,
  getInboxWindowStatus,
} from '../../../../../api/admin/whatsapp.api'
import {InboxStreamEvent, useInboxStream} from './useInboxStream'

interface State {
  detail: IInboxConversationDetail | null
  window: IInboxWindowStatus | null
  loading: boolean
  error: string | null
}

const initial: State = {
  detail: null,
  window: null,
  loading: true,
  error: null,
}

/**
 * Header data for the chat right pane: conversation + customer + window
 * status. Refetches when the conversation id changes.
 *
 * Window status is also polled every 60s. The 24h gate flips in real
 * time as the clock ticks — without polling, the composer could think
 * "free text OK" 5 seconds after the window technically closed. Cheap
 * polling at a coarse interval is the simplest correct fix.
 *
 * SSE-driven patches:
 *  - conversation.assigned / status_changed / read / unread_changed →
 *    in-place updates so the header stays live without a fetch.
 */
export function useConversationDetail(conversationId: string | null) {
  const [state, setState] = useState<State>(initial)
  const generationRef = useRef(0)

  const fetchDetail = useCallback(async (id: string) => {
    const myGen = ++generationRef.current
    setState(s => ({...s, loading: true, error: null}))
    try {
      const [detail, window] = await Promise.all([
        getInboxConversation(id),
        getInboxWindowStatus(id),
      ])
      if (myGen !== generationRef.current) return
      setState({detail, window, loading: false, error: null})
    } catch (e: any) {
      if (myGen !== generationRef.current) return
      setState({
        detail: null,
        window: null,
        loading: false,
        error: e?.message || 'Could not load conversation',
      })
    }
  }, [])

  useEffect(() => {
    if (conversationId) fetchDetail(conversationId)
    else setState(initial)
  }, [conversationId, fetchDetail])

  // Coarse 60s poll of the window status. We could derive secondsRemaining
  // from lastInboundAt client-side, but the server is the source of truth
  // and the round-trip cost (single small GET per minute) is trivial.
  useEffect(() => {
    if (!conversationId) return
    const tick = async () => {
      try {
        const window = await getInboxWindowStatus(conversationId)
        setState(s => (s.detail ? {...s, window} : s))
      } catch {
        // Ignore — next tick retries.
      }
    }
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [conversationId])

  const handleEvent = useCallback(
    (event: InboxStreamEvent) => {
      if (!conversationId) return
      if (
        'conversationId' in event &&
        event.conversationId !== conversationId
      ) {
        return
      }
      setState(s => {
        if (!s.detail) return s
        switch (event.type) {
          case 'conversation.assigned':
            return {
              ...s,
              detail: {
                ...s.detail,
                assignedAdmin: event.assignedAdminId
                  ? s.detail.assignedAdmin?.id === event.assignedAdminId
                    ? s.detail.assignedAdmin
                    : {id: event.assignedAdminId, name: 'Assigned'}
                  : null,
              },
            }
          case 'conversation.status_changed':
            return {...s, detail: {...s.detail, status: event.status}}
          case 'conversation.read':
            return {...s, detail: {...s.detail, adminUnreadCount: 0}}
          case 'conversation.unread_changed':
            return {
              ...s,
              detail: {
                ...s.detail,
                adminUnreadCount: event.adminUnreadCount,
              },
            }
          case 'message.received':
            return {
              ...s,
              detail: {
                ...s.detail,
                lastInboundAt: event.createdAt,
                lastMessageAt: event.createdAt,
              },
              window: {
                open: true,
                secondsRemaining: 24 * 3600,
                lastInboundAt: event.createdAt,
              },
            }
          default:
            return s
        }
      })
    },
    [conversationId],
  )

  useInboxStream({
    onEvent: handleEvent,
    onReconnect: () => {
      if (conversationId) fetchDetail(conversationId)
    },
  })

  return {...state, refetch: () => conversationId && fetchDetail(conversationId)}
}
