import {useState, useEffect, useCallback} from 'react'
import {
  IWhatsAppConversation,
  IWhatsAppMessage,
  fetchWhatsAppConversations,
  fetchWhatsAppConversationHistory,
  archiveWhatsAppConversation,
  syncWhatsAppTemplates,
} from '../api/admin/whatsapp.api'

export const useWhatsAppInbox = () => {
  const [conversations, setConversations] = useState<IWhatsAppConversation[]>(
    [],
  )
  const [messages, setMessages] = useState<IWhatsAppMessage[]>([])
  const [selectedConversation, setSelectedConversation] =
    useState<IWhatsAppConversation | null>(null)
  const [loading, setLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load all conversations
  const loadConversations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWhatsAppConversations()
      setConversations(data)
    } catch (err) {
      setError('Failed to load conversations')
      console.error('Failed to load conversations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load messages for a specific conversation
  const loadMessages = useCallback(async (phone: string) => {
    setMessagesLoading(true)
    setError(null)
    try {
      const data = await fetchWhatsAppConversationHistory(phone)
      setMessages(data)
    } catch (err) {
      setError('Failed to load messages')
      console.error('Failed to load messages:', err)
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  // Select a conversation and load its messages
  const selectConversation = useCallback(
    async (conversation: IWhatsAppConversation) => {
      setSelectedConversation(conversation)
      await loadMessages(conversation.phone)
    },
    [loadMessages],
  )

  // Archive a conversation
  const archiveConversation = useCallback(
    async (conversationId: string) => {
      try {
        await archiveWhatsAppConversation(conversationId)
        // Remove from list and clear selection if it was selected
        setConversations(prev =>
          prev.filter(conv => conv.id !== conversationId),
        )
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null)
          setMessages([])
        }
      } catch (err) {
        setError('Failed to archive conversation')
        console.error('Failed to archive conversation:', err)
      }
    },
    [selectedConversation],
  )

  // Sync WhatsApp templates
  const syncTemplates = useCallback(async () => {
    setSyncing(true)
    setError(null)
    try {
      const result = await syncWhatsAppTemplates()
      if (result.success) {
        // Optionally show success message
        console.log('Templates synced successfully')
      }
    } catch (err) {
      setError('Failed to sync templates')
      console.error('Failed to sync templates:', err)
    } finally {
      setSyncing(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return {
    conversations,
    messages,
    selectedConversation,
    loading,
    messagesLoading,
    syncing,
    error,
    syncTemplates,
    selectConversation,
    archiveConversation,
    loadConversations,
  }
}
