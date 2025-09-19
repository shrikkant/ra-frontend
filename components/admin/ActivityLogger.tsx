'use client'

import React, {useEffect, useState, useRef} from 'react'
import {
  IActivity,
  createActivity,
  getActivities,
  deleteActivity,
} from '../../api/admin/customers.api'
import {getRelativeTime} from '../../util/timeUtils'
import {FaTrash, FaUser, FaPaperPlane} from 'react-icons/fa'

interface ActivityLoggerProps {
  userId: number
  currentAdminName?: string
}

export default function ActivityLogger({
  userId,
  currentAdminName = 'Admin',
}: ActivityLoggerProps) {
  const [activities, setActivities] = useState<IActivity[]>([])
  const [newNote, setNewNote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  const loadActivities = async () => {
    try {
      setIsLoading(true)
      const fetchedActivities = await getActivities(userId)
      setActivities(fetchedActivities || [])
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Failed to load activities:', error)
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendActivity = async () => {
    if (!newNote.trim()) return

    setIsSending(true)
    try {
      const activity: Omit<IActivity, 'id'> = {
        user_id: userId,
        type: 1,
        notes: newNote.trim(),
        admin_name: currentAdminName,
        activity_time: new Date().toISOString(),
      }

      const newActivity = await createActivity(userId, activity)
      setActivities(prev => [...prev, newActivity])
      setNewNote('')
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Failed to create activity:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteActivity = async (activityId: number) => {
    if (!confirm('Are you sure you want to delete this activity?')) return

    try {
      await deleteActivity(userId, activityId)
      setActivities(prev => prev.filter(a => a.id !== activityId))
    } catch (error) {
      console.error('Failed to delete activity:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendActivity()
    }
  }

  useEffect(() => {
    if (userId) {
      loadActivities()
    }
  }, [userId])

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">Activity Log</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            Loading activities...
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No activities yet. Start by adding a note below.
          </div>
        ) : (
          activities.map(activity => (
            <div
              key={activity.id}
              className="group relative bg-gray-50 rounded-lg p-2 sm:p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-medium text-xs sm:text-sm text-gray-900">
                          {activity.admin_name || 'Admin'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getRelativeTime(
                            activity.activity_time || activity.created_ts || '',
                          )}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {activity.notes}
                      </p>
                    </div>
                    <button
                      onClick={() => activity.id && handleDeleteActivity(activity.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                      title="Delete activity"
                    >
                      <FaTrash className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 sm:p-4">
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note about this customer..."
            className="flex-1 px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isSending}
          />
          <button
            onClick={handleSendActivity}
            disabled={isSending || !newNote.trim()}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <FaPaperPlane className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isSending ? 'Sending...' : 'Send'}</span>
            <span className="sm:hidden">{isSending ? '...' : ''}</span>
          </button>
        </div>
      </div>
    </div>
  )
}