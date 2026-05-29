'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {InboxStreamEvent, useInboxStream} from './useInboxStream'
import {
  IInboxConversationRow,
  getInboxConversation,
} from '../../../../../api/admin/whatsapp.api'

const STORAGE_KEY = 'inbox-notifications-asked'

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

function readBrowserPermission(): PermissionState {
  if (typeof window === 'undefined') return 'unsupported'
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission as PermissionState
}

/**
 * Browser notifications for inbound messages when the tab isn't focused.
 *
 *  - Asks for permission lazily (button-driven; never auto-prompted on
 *    mount — that's hostile UX and modern browsers block silent asks).
 *  - Suppresses notifications while the document is visible — the inbox
 *    is already showing the message in-pane.
 *  - Coalesces by conversation id with a `tag` so a chatty thread shows
 *    one rolling notification, not a stack of them.
 *  - Title carries the customer's name (resolved from `conversationsById`
 *    if known, or falls back to "+91 <phone>"). Body is the preview text.
 *  - Tab-title unread counter falls back from notifications when
 *    permission isn't granted.
 */
export function useInboxNotifications(args: {
  conversationsById: Map<string, IInboxConversationRow>
}) {
  const {conversationsById} = args
  const [permission, setPermission] = useState<PermissionState>(() =>
    readBrowserPermission(),
  )
  const [hasAsked, setHasAsked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === '1'
  })
  // Track unread bumps so we can flicker the tab title for users who
  // didn't grant notifications (or are on an OS that suppresses banners).
  const unseenRef = useRef<number>(0)

  // Restore the title whenever the tab gains focus.
  useEffect(() => {
    const restore = () => {
      if (document.visibilityState === 'visible') {
        unseenRef.current = 0
        document.title = document.title.replace(/^\(\d+\)\s+/, '')
      }
    }
    document.addEventListener('visibilitychange', restore)
    window.addEventListener('focus', restore)
    return () => {
      document.removeEventListener('visibilitychange', restore)
      window.removeEventListener('focus', restore)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    try {
      const result = await Notification.requestPermission()
      setPermission(result as PermissionState)
      localStorage.setItem(STORAGE_KEY, '1')
      setHasAsked(true)
    } catch {
      // Older Safari throws on requestPermission; ignore.
    }
  }, [])

  const dismissAsk = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1')
    setHasAsked(true)
  }, [])

  const notify = useCallback(
    (event: Extract<InboxStreamEvent, {type: 'message.received'}>) => {
      // Bump tab title — always (cheap, works without permission).
      if (document.visibilityState !== 'visible') {
        unseenRef.current += 1
        const count = unseenRef.current
        const stripped = document.title.replace(/^\(\d+\)\s+/, '')
        document.title = `(${count}) ${stripped}`
      }
      if (permission !== 'granted') return
      if (document.visibilityState === 'visible') return

      const row = conversationsById.get(event.conversationId)
      const name = row?.customer
        ? [row.customer.firstname, row.customer.lastname]
            .filter(Boolean)
            .join(' ')
            .trim() || `+91 ${row.phone}`
        : `+91 ${event.phone}`
      const preview = row?.lastMessage?.text || 'sent a new message'
      try {
        const n = new Notification(name, {
          body: preview,
          tag: event.conversationId,
          renotify: true,
          icon: '/favicon.ico',
        } as NotificationOptions)
        n.onclick = () => {
          window.focus()
          window.location.href = `/p/admin/customers/${event.conversationId}`
          n.close()
        }
      } catch {
        // Some platforms (locked phones, etc.) throw on construction.
      }
    },
    [permission, conversationsById],
  )

  /**
   * If the SSE event payload doesn't have a preview yet, fall back to
   * fetching the detail. Cheaper than refetching the entire list, and
   * only used when the in-memory list doesn't already know about this
   * conversation (e.g. brand-new customer just signed up).
   */
  const notifyAsync = useCallback(
    async (event: Extract<InboxStreamEvent, {type: 'message.received'}>) => {
      if (conversationsById.has(event.conversationId)) {
        notify(event)
        return
      }
      try {
        const detail = await getInboxConversation(event.conversationId)
        const name =
          [detail.customer?.firstname, detail.customer?.lastname]
            .filter(Boolean)
            .join(' ')
            .trim() || `+91 ${detail.phone}`
        if (
          permission === 'granted' &&
          document.visibilityState !== 'visible'
        ) {
          const n = new Notification(name, {
            body: 'sent a new message',
            tag: event.conversationId,
            renotify: true,
            icon: '/favicon.ico',
          } as NotificationOptions)
          n.onclick = () => {
            window.focus()
            window.location.href = `/p/admin/customers/${event.conversationId}`
            n.close()
          }
        }
      } catch {
        notify(event)
      }
    },
    [conversationsById, notify, permission],
  )

  // Subscribe to the SSE stream and fire a notification on every
  // message.received. Skips other event types — assignment/status
  // updates don't warrant a banner.
  useInboxStream({
    onEvent: event => {
      if (event.type === 'message.received') notifyAsync(event)
    },
  })

  return {
    permission,
    hasAsked,
    requestPermission,
    dismissAsk,
  }
}
