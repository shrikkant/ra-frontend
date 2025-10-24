import React, {useEffect, useRef, useState} from 'react'
import {
  IWhatsAppConversation,
  IWhatsAppMessage,
} from '../../../api/admin/whatsapp.api'

interface ChatBoxProps {
  conversation: IWhatsAppConversation | null
  messages: IWhatsAppMessage[]
  loading?: boolean
  onSendMessage?: (message: string) => void
  onArchive?: () => void
}

const ChatBox: React.FC<ChatBoxProps> = ({
  conversation,
  messages,
  loading = false,
  onSendMessage,
  onArchive,
}) => {
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (messageText.trim() && onSendMessage) {
      onSendMessage(messageText.trim())
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Empty state when no conversation selected
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Select a conversation
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Choose a chat from the list to start messaging
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {conversation.profilePic ? (
            <img
              src={conversation.profilePic}
              alt={conversation.name || conversation.phone}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white font-semibold">
                {(conversation.name || conversation.phone).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {conversation.name || conversation.phone}
            </h2>
            <p className="text-xs text-gray-500">{conversation.phone}</p>
          </div>
        </div>

        {onArchive && (
          <button
            onClick={onArchive}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Archive conversation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map(message => {
            const isOutgoing = message.from !== conversation.phone
            return (
              <div
                key={message.id}
                className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOutgoing
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-900'
                  } shadow-sm`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.body}
                  </p>
                  <div
                    className={`text-xs mt-1 ${
                      isOutgoing ? 'text-green-100' : 'text-gray-500'
                    } flex items-center justify-end space-x-1`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    {isOutgoing && message.status && (
                      <span>
                        {message.status === 'delivered' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end space-x-3">
          <textarea
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
