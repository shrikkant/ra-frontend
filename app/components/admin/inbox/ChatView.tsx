'use client'

import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../../app-store/auth/auth.slice'
import {markInboxConversationRead} from '../../../../api/admin/whatsapp.api'
import CustomerHeader from './CustomerHeader'
import OrderContext from './OrderContext'
import Timeline from './Timeline'
import Composer from './Composer'
import InternalNotesTab from './InternalNotesTab'
import DetailsTab from './DetailsTab'
import {useConversationDetail} from './hooks/useConversationDetail'
import {useMessages} from './hooks/useMessages'
import {useOrderContext} from './hooks/useOrderContext'
import {useKeyboardOffset} from './hooks/useKeyboardOffset'

interface Props {
  conversationId: string
}

type Tab = 'chat' | 'notes' | 'details'

export default function ChatView({conversationId}: Props) {
  const auth = useSelector(selectAuthState)
  const currentAdminId = (auth as any)?.id ?? null

  const {detail, window: windowStatus, refetch} =
    useConversationDetail(conversationId)
  const {
    messages,
    loadingInitial,
    loadingOlder,
    hasMore,
    error,
    loadOlder,
    appendOptimistic,
    appendOptimisticImage,
    markOptimistic,
  } = useMessages(conversationId)
  const {data: orderContext, loading: orderContextLoading} =
    useOrderContext(conversationId)
  // Mobile keyboard handling: shrink the chat container by the
  // keyboard height so the composer stays above the keyboard instead
  // of disappearing behind it (iOS Safari's default 100vh doesn't
  // follow the visual viewport).
  const keyboardOffset = useKeyboardOffset()

  const [tab, setTab] = useState<Tab>('chat')

  // Auto-mark-read when the thread opens. Deliberately fire once per
  // conversation id, not per render — re-firing on every re-render would
  // spam the endpoint.
  useEffect(() => {
    if (!conversationId) return
    markInboxConversationRead(conversationId).catch(() => {
      // Best-effort; SSE will re-sync if the read marker matters.
    })
  }, [conversationId])

  // Smooth-transition the height so the composer slides up with the
  // keyboard rather than jumping. 150ms matches the iOS keyboard
  // animation closely enough that the two feel coordinated.
  const containerStyle: React.CSSProperties = {
    height: keyboardOffset > 0 ? `calc(100% - ${keyboardOffset}px)` : '100%',
    transition: 'height 0.15s ease-out',
  }

  if (!detail) {
    return (
      <div className="flex flex-col bg-surface" style={containerStyle}>
        <div className="h-14 border-b border-line shrink-0 flex items-center px-3 lg:px-5">
          <div className="text-[13px] text-ink-muted">Loading…</div>
        </div>
        <div className="flex-1" />
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-surface" style={containerStyle}>
      <CustomerHeader
        detail={detail}
        window={windowStatus}
        currentAdminId={currentAdminId}
        onChange={refetch}
      />

      <OrderContext data={orderContext} loading={orderContextLoading} />

      <div className="shrink-0 border-b border-line bg-bg px-3 lg:px-5 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1">
          <TabButton active={tab === 'chat'} onClick={() => setTab('chat')}>
            Chat
          </TabButton>
          <TabButton
            active={tab === 'notes'}
            onClick={() => setTab('notes')}
          >
            Notes
          </TabButton>
          <TabButton
            active={tab === 'details'}
            onClick={() => setTab('details')}
          >
            Details
          </TabButton>
        </div>
      </div>

      {tab === 'chat' && (
        <>
          <Timeline
            messages={messages}
            loadingInitial={loadingInitial}
            loadingOlder={loadingOlder}
            hasMore={hasMore}
            error={error}
            onLoadOlder={loadOlder}
          />
          <Composer
            conversationId={conversationId}
            windowOpen={!!windowStatus?.open}
            onOptimistic={appendOptimistic}
            onOptimisticImage={appendOptimisticImage}
            onSent={id => markOptimistic(id, 'sent')}
            onFailed={id => markOptimistic(id, 'failed')}
          />
        </>
      )}
      {tab === 'notes' && (
        <InternalNotesTab userId={detail.customer?.id ?? null} />
      )}
      {tab === 'details' && (
        <DetailsTab userId={detail.customer?.id ?? null} />
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-[12px] uppercase tracking-kicker font-extrabold py-2.5 px-3 transition-colors ${
        active ? 'text-ink' : 'text-ink-muted hover:text-ink-secondary'
      }`}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute left-3 right-3 -bottom-px h-[2px] bg-ink rounded-full"
        />
      )}
    </button>
  )
}
