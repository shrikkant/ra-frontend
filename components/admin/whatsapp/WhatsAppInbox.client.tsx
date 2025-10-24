'use client'

import React, {useState} from 'react'
import {FaSync} from 'react-icons/fa'
import MyPageHeader from '../../MyPageHeader'
import ChatList from './ChatList'
import ChatBox from './ChatBox'
import {useWhatsAppInbox} from '../../../hooks/useWhatsAppInbox'

export default function WhatsAppInbox() {
  const {
    conversations,
    messages,
    selectedConversation,
    loading,
    messagesLoading,
    error,
    syncTemplates,
    syncing,
    selectConversation,
    archiveConversation,
  } = useWhatsAppInbox()

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              WhatsApp Inbox
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage customer conversations
            </p>
          </div>
          <button
            onClick={syncTemplates}
            disabled={syncing}
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <FaSync className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Templates'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Conversations
            </h2>
          </div>
          <ChatList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={selectConversation}
            loading={loading}
          />
        </div>

        {/* Right Side - Chat Box */}
        <ChatBox
          conversation={selectedConversation}
          messages={messages}
          loading={messagesLoading}
          onArchive={
            selectedConversation
              ? () => archiveConversation(selectedConversation.id)
              : undefined
          }
        />
      </div>
    </div>
  )
}
