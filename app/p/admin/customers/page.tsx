import React from 'react'
import CustomersWorkspace from '../../../components/admin/inbox/CustomersWorkspace'

// The customers index hosts two views behind a toggle: the WhatsApp inbox
// (conversations) and the full customer directory (every customer, including
// email-only signups with no conversation). `?view=customers` selects the
// directory; opening a conversation reaches the chat + customer profile.
export default function Page() {
  return <CustomersWorkspace />
}
