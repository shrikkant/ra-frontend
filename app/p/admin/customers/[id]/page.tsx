import React from 'react'
import InboxScreen from '../../../../components/admin/inbox/InboxScreen'

// `id` is the WhatsApp conversation UUID (not the user id). Picking a
// row in the list navigates here and InboxScreen shows the chat pane.
type Params = Promise<{id: string}>

export default async function Page(props: {params: Params}) {
  const {id} = await props.params
  return <InboxScreen selectedId={id} />
}
