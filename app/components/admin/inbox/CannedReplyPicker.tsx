'use client'

import React, {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {CloseIcon} from '../../redesign/icons'
import {useCannedReplies} from './hooks/useCannedReplies'

interface Props {
  open: boolean
  onClose: () => void
  onPick: (body: string) => void
}

type Mode = 'list' | 'new' | {edit: number}

export default function CannedReplyPicker({open, onClose, onPick}: Props) {
  const {items, loading, error, create, update, remove, refresh} =
    useCannedReplies(open)
  const [mode, setMode] = useState<Mode>('list')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [shared, setShared] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) {
      setMode('list')
      setTitle('')
      setBody('')
      setShared(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const startEdit = (id: number) => {
    const reply = items.find(r => r.id === id)
    if (!reply) return
    setTitle(reply.title)
    setBody(reply.body)
    setShared(reply.shared)
    setMode({edit: id})
  }

  const submit = async () => {
    const t = title.trim()
    const b = body.trim()
    if (!t || !b) return
    setSaving(true)
    try {
      if (mode === 'new') {
        await create({title: t, body: b, shared})
      } else if (typeof mode === 'object') {
        await update(mode.edit, {title: t, body: b})
      }
      setMode('list')
      setTitle('')
      setBody('')
      setShared(false)
    } catch (e: any) {
      console.error('Save reply failed', e)
    } finally {
      setSaving(false)
    }
  }

  const askDelete = async (id: number) => {
    if (!confirm('Delete this reply?')) return
    try {
      await remove(id)
    } catch (e: any) {
      console.error('Delete reply failed', e)
    }
  }

  if (!open) return null
  if (typeof document === 'undefined') return null

  const sharedReplies = items.filter(r => r.shared)
  const myReplies = items.filter(r => !r.shared)

  const content = (
    <div
      className="fixed inset-0 z-[100] flex md:items-center md:justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Canned replies"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative bg-surface w-full md:w-[480px] md:max-w-[calc(100vw-2rem)] md:rounded-2xl md:max-h-[80vh] md:shadow-2xl flex flex-col h-full md:h-auto mt-auto md:mt-0">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
              Canned replies
            </div>
            <div className="text-[16px] font-extrabold text-ink leading-tight mt-0.5">
              {mode === 'list'
                ? 'Pick a saved reply'
                : mode === 'new'
                  ? 'New reply'
                  : 'Edit reply'}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-ink-secondary hover:bg-surface-muted"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {error && (
            <div className="px-3 py-2 text-[12px] text-danger">{error}</div>
          )}

          {mode === 'list' && (
            <>
              {loading && items.length === 0 ? (
                <div className="px-3 py-6 text-[12px] text-ink-muted">
                  Loading…
                </div>
              ) : items.length === 0 ? (
                <div className="px-3 py-6 text-[12px] text-ink-muted">
                  No replies yet. Hit "New reply" below to save your first.
                </div>
              ) : (
                <>
                  {sharedReplies.length > 0 && (
                    <ReplyGroup
                      label="Shared with team"
                      replies={sharedReplies}
                      onPick={r => {
                        onPick(r.body)
                        onClose()
                      }}
                      onEdit={startEdit}
                      onDelete={askDelete}
                    />
                  )}
                  {myReplies.length > 0 && (
                    <ReplyGroup
                      label="Mine"
                      replies={myReplies}
                      onPick={r => {
                        onPick(r.body)
                        onClose()
                      }}
                      onEdit={startEdit}
                      onDelete={askDelete}
                    />
                  )}
                </>
              )}
            </>
          )}

          {(mode === 'new' || typeof mode === 'object') && (
            <div className="space-y-3 px-1">
              <label className="block">
                <span className="block text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted mb-1">
                  Title
                </span>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Out of stock"
                  maxLength={120}
                  className="w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[14px] text-ink outline-none focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="block text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted mb-1">
                  Body
                </span>
                <textarea
                  rows={6}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Type the reply…"
                  className="w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[14px] text-ink outline-none focus:border-ink resize-none"
                />
              </label>
              {mode === 'new' && (
                <label className="flex items-center gap-2 text-[13px] text-ink-secondary">
                  <input
                    type="checkbox"
                    checked={shared}
                    onChange={e => setShared(e.target.checked)}
                    className="w-4 h-4 accent-ink"
                  />
                  Share with the whole sales team
                </label>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line px-3 py-3 flex gap-2">
          {mode === 'list' ? (
            <>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="flex-1 bg-surface border border-line text-ink text-[14px] font-extrabold rounded-full py-2.5 disabled:opacity-60"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => setMode('new')}
                className="flex-1 bg-ink text-surface text-[14px] font-extrabold rounded-full py-2.5"
              >
                New reply
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMode('list')}
                disabled={saving}
                className="flex-1 bg-surface border border-line text-ink text-[14px] font-extrabold rounded-full py-2.5 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={saving || !title.trim() || !body.trim()}
                className="flex-1 bg-ink text-surface text-[14px] font-extrabold rounded-full py-2.5 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

function ReplyGroup({
  label,
  replies,
  onPick,
  onEdit,
  onDelete,
}: {
  label: string
  replies: import('../../../../api/admin/whatsapp.api').ICannedReply[]
  onPick: (
    reply: import('../../../../api/admin/whatsapp.api').ICannedReply,
  ) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="mb-2">
      <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
        {label}
      </div>
      <ul className="space-y-1">
        {replies.map(r => (
          <li key={r.id}>
            <div className="rounded-[12px] border border-line bg-surface px-3 py-2.5 hover:bg-surface-muted">
              <button
                type="button"
                onClick={() => onPick(r)}
                className="block w-full text-left"
              >
                <div className="text-[13px] font-extrabold text-ink leading-tight">
                  {r.title}
                </div>
                <p className="text-[12px] text-ink-secondary mt-1 line-clamp-2 whitespace-pre-wrap">
                  {r.body}
                </p>
              </button>
              {r.mine && (
                <div className="flex gap-3 mt-2 pl-1">
                  <button
                    type="button"
                    onClick={() => onEdit(r.id)}
                    className="text-[11px] font-bold text-ink-secondary hover:text-ink"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="text-[11px] font-bold text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
