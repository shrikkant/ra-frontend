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

// ───── 2026 admin inbox API ─────────────────────────────────────────
// New endpoints introduced for the redesigned admin inbox. Cursor-paged,
// rich shape (customer + admin + window state). The old fetchWhatsApp*
// functions above stay for backward compatibility while the legacy
// /p/admin/whatsapp page is still mounted.

export type ConversationStatus = 'OPEN' | 'RESOLVED' | 'SNOOZED'

export interface IInboxCustomer {
  id: number | null
  firstname: string | null
  lastname: string | null
  phone: string
  profilePic: string | null
  verified: number
}

export interface IInboxAdmin {
  id: number
  name: string
}

export interface IInboxLastMessage {
  text: string
  direction: 'inbound' | 'outbound'
  type: string
  status: string
  createdAt: string
}

export interface IInboxConversationRow {
  id: string
  phone: string
  status: ConversationStatus
  snoozedUntil: string | null
  lastMessageAt: string
  lastInboundAt: string | null
  adminUnreadCount: number
  windowOpen: boolean
  assignedAdmin: IInboxAdmin | null
  customer: IInboxCustomer | null
  lastMessage: IInboxLastMessage | null
}

export interface IInboxConversationDetail extends IInboxConversationRow {
  lastAdminReadAt: string | null
  snoozedUntil: string | null
  customer:
    | (IInboxCustomer & {
        email: string | null
        signinSource: string | null
        createdAt: string | null
        city: string | null
      })
    | null
}

export interface IInboxMessage {
  id: string
  wamid: string
  phone: string
  direction: 'inbound' | 'outbound'
  messageType: string
  content: any
  status: string
  templateName?: string | null
  conversationId?: string | null
  createdAt: string
  updatedAt: string
}

export interface IInboxListFilters {
  status?: ConversationStatus
  assignedTo?: 'me' | 'unassigned' | number
  q?: string
  cursor?: string
  limit?: number
}

export interface IInboxListPage {
  items: IInboxConversationRow[]
  nextCursor: string | null
}

export interface IInboxThreadPage {
  items: IInboxMessage[]
  nextCursor: string | null
}

export interface IInboxWindowStatus {
  open: boolean
  secondsRemaining: number
  lastInboundAt: string | null
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') usp.set(k, String(v))
  }
  const s = usp.toString()
  return s ? `?${s}` : ''
}

export async function listInboxConversations(
  filters: IInboxListFilters = {},
): Promise<IInboxListPage> {
  return httpClient.get(
    `/v1/whatsapp/inbox/conversations${buildQuery({
      status: filters.status,
      assignedTo:
        typeof filters.assignedTo === 'number'
          ? filters.assignedTo
          : filters.assignedTo,
      q: filters.q,
      cursor: filters.cursor,
      limit: filters.limit,
    })}`,
  )
}

export async function getInboxConversation(
  id: string,
): Promise<IInboxConversationDetail> {
  return httpClient.get(`/v1/whatsapp/inbox/conversations/${id}`)
}

export async function listInboxMessages(
  id: string,
  opts: {before?: string; limit?: number} = {},
): Promise<IInboxThreadPage> {
  return httpClient.get(
    `/v1/whatsapp/inbox/conversations/${id}/messages${buildQuery({
      before: opts.before,
      limit: opts.limit,
    })}`,
  )
}

export async function getInboxWindowStatus(
  id: string,
): Promise<IInboxWindowStatus> {
  return httpClient.get(
    `/v1/whatsapp/inbox/conversations/${id}/window-status`,
  )
}

export async function sendInboxMessage(
  id: string,
  body:
    | {type: 'text'; text: string; clientId?: string}
    | {
        type: 'template'
        templateName: string
        variables?: string[]
        clientId?: string
      },
): Promise<{queued: true; jobId: string}> {
  return httpClient.post(
    `/v1/whatsapp/inbox/conversations/${id}/messages`,
    body,
  )
}

export async function markInboxConversationRead(
  id: string,
): Promise<{success: boolean}> {
  return httpClient.post(`/v1/whatsapp/inbox/conversations/${id}/read`)
}

export async function assignInboxConversation(
  id: string,
  adminId: number | 'me' | null,
): Promise<{success: boolean}> {
  return httpClient.post(
    `/v1/whatsapp/inbox/conversations/${id}/assign`,
    {adminId},
  )
}

export async function setInboxConversationStatus(
  id: string,
  status: ConversationStatus,
  snoozedUntil?: string | null,
): Promise<{success: boolean}> {
  return httpClient.post(`/v1/whatsapp/inbox/conversations/${id}/status`, {
    status,
    snoozedUntil,
  })
}

export interface ICannedReply {
  id: number
  title: string
  body: string
  shared: boolean
  mine: boolean
  createdAt: string
}

export async function listCannedReplies(): Promise<ICannedReply[]> {
  return httpClient.get('/v1/whatsapp/inbox/canned-replies')
}

export async function createCannedReply(args: {
  title: string
  body: string
  shared?: boolean
}): Promise<ICannedReply> {
  return httpClient.post('/v1/whatsapp/inbox/canned-replies', args)
}

export async function updateCannedReply(
  id: number,
  args: {title?: string; body?: string},
): Promise<ICannedReply> {
  return httpClient.post(`/v1/whatsapp/inbox/canned-replies/${id}`, args)
}

export async function deleteCannedReply(
  id: number,
): Promise<{success: boolean}> {
  return httpClient.post(`/v1/whatsapp/inbox/canned-replies/${id}/delete`)
}

export interface IInboxTemplate {
  id: number
  name: string
  category: string
  language: string
  status: string
  templateData?: any
}

export async function listInboxTemplates(
  status: string = 'APPROVED',
): Promise<IInboxTemplate[]> {
  return httpClient.get(`/v1/whatsapp/inbox/templates?status=${status}`)
}

export interface IInboxOrderItem {
  productId: number
  title: string
  qty: number
  rent: number
}

export interface IInboxActiveOrder {
  id: number
  orderRef: string
  startDate: string | null
  endDate: string
  daysRemaining: number
  totalAmount: number
  stage: number
  items: IInboxOrderItem[]
}

export interface IInboxOrderContext {
  activeOrder: IInboxActiveOrder | null
  totalOrders: number
  lifetimeSpend: number
}

export async function getInboxOrderContext(
  id: string,
): Promise<IInboxOrderContext> {
  return httpClient.get(`/v1/whatsapp/inbox/conversations/${id}/order-context`)
}

export interface SendInboxMediaResult {
  queued: true
  jobId: string
  url: string
  bytes: number
}

// Multipart upload — needs to override the JSON content-type that
// httpClient defaults to. Axios sets the right multipart boundary when
// we pass FormData and let it generate the header itself (don't set
// Content-Type manually or the boundary is missing and the server can't
// parse the body).
export async function sendInboxMediaMessage(
  id: string,
  file: File,
  caption?: string,
  clientId?: string,
): Promise<SendInboxMediaResult> {
  const form = new FormData()
  form.append('file', file)
  if (caption && caption.trim()) form.append('caption', caption.trim())
  if (clientId) form.append('clientId', clientId)
  return httpClient.post(
    `/v1/whatsapp/inbox/conversations/${id}/messages/media`,
    form,
  )
}
