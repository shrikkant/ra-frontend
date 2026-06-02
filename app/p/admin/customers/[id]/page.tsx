import React from 'react'
import CustomersWorkspace from '../../../../components/admin/inbox/CustomersWorkspace'

// `id` is the WhatsApp conversation UUID (not the user id). Picking a
// row in the list navigates here and the inbox shows the chat pane.
type Params = Promise<{id: string}>

export default async function Page(props: {params: Params}) {
  const {id} = await props.params
  return <CustomersWorkspace conversationId={id} />
}
