'use client'

import React from 'react'
import {useSearchParams} from 'next/navigation'
import InboxScreen from './InboxScreen'
import CustomerDirectoryScreen from './CustomerDirectoryScreen'
import ViewToggle, {CustomersView} from './ViewToggle'

interface Props {
  // WhatsApp conversation id from the /p/admin/customers/[id] route. When
  // present the inbox view is forced (a chat is open).
  conversationId?: string | null
}

/**
 * Top-level shell for /p/admin/customers. Owns the Inbox / All customers
 * toggle and renders the matching two-pane screen:
 *
 *   /p/admin/customers                          → inbox (conversations)
 *   /p/admin/customers?view=customers           → customer directory
 *   /p/admin/customers?view=customers&uid=123   → directory + profile
 *   /p/admin/customers/:conversationId          → inbox + open chat
 *
 * Both screens render the same toggle at the top of their left pane, so it
 * stays put when switching views.
 */
export default function CustomersWorkspace({conversationId = null}: Props) {
  const searchParams = useSearchParams()
  const viewParam = searchParams?.get('view')
  // A selected conversation always means we're in the inbox.
  const view: CustomersView =
    !conversationId && viewParam === 'customers' ? 'customers' : 'inbox'

  const uidParam = searchParams?.get('uid')
  const selectedUserId =
    uidParam && /^\d+$/.test(uidParam) ? Number(uidParam) : null

  const toggle = <ViewToggle active={view} />

  if (view === 'customers') {
    return (
      <CustomerDirectoryScreen
        selectedUserId={selectedUserId}
        topSlot={toggle}
      />
    )
  }

  return <InboxScreen selectedId={conversationId} topSlot={toggle} />
}
