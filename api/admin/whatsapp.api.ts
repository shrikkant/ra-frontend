import httpClient from '../axios.config'

// Types
export interface IWhatsAppMessage {
  id: string
  body?: string
  timestamp: string
  from: string
  to?: string
  type: string
  status?: string
}

export interface IWhatsAppConversation {
  id: string
  phone: string
  name?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  profilePic?: string
  archived?: boolean
}

export interface IWhatsAppTemplate {
  id: string
  name: string
  language: string
  status: string
  category: string
  components?: any[]
}

// Sync WhatsApp templates
export async function syncWhatsAppTemplates(): Promise<{
  success: boolean
  message?: string
}> {
  const response = await httpClient.post(
    '/v1/whatsapp/inbox/templates/sync',
  )
  return response
}

// Fetch all active conversations
export async function fetchWhatsAppConversations(): Promise<
  IWhatsAppConversation[]
> {
  const response: any = await httpClient.get(
    '/v1/whatsapp/inbox/conversations',
  )
  // Handle paginated response or array response
  if (response?.data !== undefined && Array.isArray(response.data)) {
    return response.data
  }
  return Array.isArray(response) ? response : []
}

// Fetch conversation by phone
export async function fetchWhatsAppConversation(
  phone: string,
): Promise<IWhatsAppConversation> {
  const conversation: IWhatsAppConversation = await httpClient.get(
    `/v1/whatsapp/inbox/conversations/phone/${phone}`,
  )
  return conversation
}

// Fetch conversation history
export async function fetchWhatsAppConversationHistory(
  phone: string,
): Promise<IWhatsAppMessage[]> {
  const response: any = await httpClient.get(
    `/v1/whatsapp/inbox/conversations/${phone}/history`,
  )
  // Handle paginated response or array response
  if (response?.data !== undefined && Array.isArray(response.data)) {
    return response.data
  }
  return Array.isArray(response) ? response : []
}

// Archive conversation
export async function archiveWhatsAppConversation(
  conversationId: string,
): Promise<{success: boolean; message?: string}> {
  const response = await httpClient.post(
    `/v1/whatsapp/inbox/conversations/${conversationId}/archive`,
  )
  return response
}
