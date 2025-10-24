import React from 'react'
import {IWhatsAppConversation} from '../../../api/admin/whatsapp.api'

interface ChatListProps {
  conversations: IWhatsAppConversation[]
  selectedConversation: IWhatsAppConversation | null
  onSelectConversation: (conversation: IWhatsAppConversation) => void
  loading?: boolean
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading = false,
}) => {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200">
            <div className="flex space-x-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No conversations yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conversation => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation)}
          className={`w-full p-4 flex items-center space-x-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
            selectedConversation?.id === conversation.id
              ? 'bg-gray-100 border-l-4 border-l-green-500'
              : ''
          }`}
        >
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            {conversation.profilePic ? (
              <img
                src={conversation.profilePic}
                alt={conversation.name || conversation.phone}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {(conversation.name || conversation.phone).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                </span>
              </div>
            )}
          </div>

          {/* Conversation Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {conversation.name || conversation.phone}
              </h3>
              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                {formatTime(conversation.lastMessageTime)}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {conversation.lastMessage || 'No messages yet'}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ChatList
