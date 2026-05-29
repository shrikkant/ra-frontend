import React from 'react'
import InboxScreen from '../../../components/admin/inbox/InboxScreen'

// The customers index is now the WhatsApp inbox. The previous card-grid
// list lives in the WhatsAppInbox.client component family and has been
// superseded by the two-pane inbox — open a conversation to reach the
// customer's profile + KYC + orders in the right pane (next turn).
export default function Page() {
  return <InboxScreen />
}
