'use client'

import React, {useRef, useState} from 'react'
import {
  sendInboxMediaMessage,
  sendInboxMessage,
} from '../../../../api/admin/whatsapp.api'
import {CloseIcon} from '../../redesign/icons'
import TemplatePicker from './TemplatePicker'
import CannedReplyPicker from './CannedReplyPicker'

interface Props {
  conversationId: string
  windowOpen: boolean
  onOptimistic: (text: string) => string
  onOptimisticImage: (args: {previewUrl: string; caption?: string}) => string
  onSent: (id: string) => void
  onFailed: (id: string, reason?: string) => void
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPT_IMAGE = 'image/jpeg,image/png,image/webp'

const TemplateIcon = ({size = 16}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
)

const BoltIcon = ({size = 16}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
)

const AttachIcon = ({size = 18}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const SendIcon = ({size = 16}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.4 1.1L4 11l9 1-9 1-2 6.3a1 1 0 0 0 1.4 1.1z" />
  </svg>
)

export default function Composer({
  conversationId,
  windowOpen,
  onOptimistic,
  onOptimisticImage,
  onSent,
  onFailed,
}: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [cannedOpen, setCannedOpen] = useState(false)
  // Local file staged for upload — shown as a preview chip above the
  // composer until the user clears it or hits send.
  const [pendingImage, setPendingImage] = useState<{
    file: File
    previewUrl: string
  } | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Auto-resize the textarea up to 5 lines. Beyond that, internal scroll.
  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 5 * 24 + 24) + 'px'
  }

  const sendText = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    if (!windowOpen) {
      setPickerOpen(true)
      return
    }
    setSending(true)
    const optId = onOptimistic(trimmed)
    setText('')
    if (taRef.current) taRef.current.style.height = 'auto'
    try {
      await sendInboxMessage(conversationId, {
        type: 'text',
        text: trimmed,
        clientId: optId,
      })
      onSent(optId)
    } catch (e: any) {
      // Backend rejected with window_closed — surface the picker.
      const code =
        e?.response?.data?.code || e?.code || e?.response?.data?.message
      if (
        typeof code === 'string' &&
        code.toLowerCase().includes('window_closed')
      ) {
        onFailed(optId, 'window_closed')
        setPickerOpen(true)
      } else {
        onFailed(optId, e?.message || 'send_failed')
      }
    } finally {
      setSending(false)
    }
  }

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    // Reset the input so the same file can be re-picked after clearing.
    if (fileInputRef.current) fileInputRef.current.value = ''
    setUploadError(null)
    if (!f) return
    if (!ACCEPT_IMAGE.split(',').includes(f.type)) {
      setUploadError('Images only (JPEG, PNG, or WebP).')
      return
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setUploadError(
        `Image is too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`,
      )
      return
    }
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl)
    setPendingImage({file: f, previewUrl: URL.createObjectURL(f)})
  }

  const clearPending = () => {
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl)
    setPendingImage(null)
    setUploadError(null)
  }

  const sendImage = async () => {
    if (!pendingImage || sending) return
    if (!windowOpen) {
      setUploadError('24h window closed — attachments need a template flow.')
      return
    }
    setSending(true)
    setUploadError(null)
    const caption = text.trim() || undefined
    const {file, previewUrl} = pendingImage
    const optId = onOptimisticImage({previewUrl, caption})
    // Wipe composer state immediately so subsequent typing isn't bound
    // to the just-sent message.
    setText('')
    setPendingImage(null)
    if (taRef.current) taRef.current.style.height = 'auto'
    try {
      await sendInboxMediaMessage(conversationId, file, caption, optId)
      onSent(optId)
      // The blob URL is now redundant — the next refetch will replace
      // the bubble with the persisted server URL. Revoke immediately is
      // tempting but would break the bubble until refetch lands.
    } catch (e: any) {
      const code =
        e?.response?.data?.code || e?.code || e?.response?.data?.message
      if (
        typeof code === 'string' &&
        code.toLowerCase().includes('window_closed')
      ) {
        onFailed(optId, 'window_closed')
      } else {
        onFailed(optId, e?.message || 'send_failed')
      }
      setUploadError(e?.response?.data?.message || e?.message || 'Send failed.')
    } finally {
      setSending(false)
    }
  }

  const sendTemplate = async (
    templateName: string,
    variables: string[],
  ) => {
    setSending(true)
    // Surface as optimistic too — preview shows the template name as a
    // placeholder bubble until the real persisted row arrives.
    const optId = onOptimistic(`📋 ${templateName}`)
    try {
      await sendInboxMessage(conversationId, {
        type: 'template',
        templateName,
        variables,
      })
      onSent(optId)
    } catch (e: any) {
      onFailed(optId, e?.message || 'send_failed')
    } finally {
      setSending(false)
    }
  }

  const onSendClick = () => {
    if (pendingImage) sendImage()
    else sendText()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter sends; Enter alone makes a newline (matches Slack /
    // Linear — chat composers that respect "Enter for newline" win on
    // mobile, where touchscreen autocorrect benefits from line breaks).
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSendClick()
    }
  }

  const canSend =
    !sending && windowOpen && (pendingImage || text.trim().length > 0)

  return (
    <>
      <div className="shrink-0 border-t border-line bg-surface px-3 lg:px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {!windowOpen && (
          <div className="mb-2 text-[11px] text-ink-secondary leading-tight">
            <span className="font-bold text-ink">24h window closed.</span>{' '}
            Free-text won't go now — pick a template.
          </div>
        )}

        {pendingImage && (
          <div className="mb-2 flex items-center gap-2 rounded-[12px] border border-line-soft bg-bg p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pendingImage.previewUrl}
              alt="Pending upload"
              className="w-12 h-12 rounded-[8px] object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-ink truncate">
                {pendingImage.file.name}
              </div>
              <div className="font-mono text-[10px] text-ink-muted">
                {(pendingImage.file.size / 1024).toFixed(0)} KB · add a caption
                below
              </div>
            </div>
            <button
              type="button"
              onClick={clearPending}
              aria-label="Clear attachment"
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-ink-secondary hover:bg-surface-muted"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}
        {uploadError && (
          <div className="mb-2 text-[11px] text-danger">{uploadError}</div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_IMAGE}
          // capture hint surfaces the camera on mobile (Android + iOS
          // Safari respect it; falls through to gallery otherwise).
          capture="environment"
          className="hidden"
          onChange={onPickFile}
        />

        <div className="flex items-end gap-2">
          <button
            type="button"
            aria-label="Attach an image"
            onClick={() => fileInputRef.current?.click()}
            disabled={!windowOpen || sending}
            className="shrink-0 w-10 h-10 rounded-full bg-surface-muted border border-line flex items-center justify-center text-ink hover:bg-bg disabled:opacity-60"
          >
            <AttachIcon />
          </button>
          <button
            type="button"
            aria-label="Canned replies"
            onClick={() => setCannedOpen(true)}
            disabled={!windowOpen || sending}
            className="shrink-0 w-10 h-10 rounded-full bg-surface-muted border border-line flex items-center justify-center text-ink hover:bg-bg disabled:opacity-60"
          >
            <BoltIcon />
          </button>
          <button
            type="button"
            aria-label="Pick a template"
            onClick={() => setPickerOpen(true)}
            className="shrink-0 w-10 h-10 rounded-full bg-surface-muted border border-line flex items-center justify-center text-ink hover:bg-bg"
          >
            <TemplateIcon />
          </button>
          <textarea
            ref={taRef}
            rows={1}
            value={text}
            onChange={onInput}
            onKeyDown={onKeyDown}
            placeholder={
              !windowOpen
                ? 'Templates only (24h closed)'
                : pendingImage
                  ? 'Add a caption (optional)'
                  : 'Write a message…'
            }
            disabled={!windowOpen}
            className="flex-1 resize-none rounded-[18px] bg-bg border border-line px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-muted outline-none focus:border-ink disabled:opacity-60 leading-snug"
            style={{maxHeight: '144px'}}
          />
          <button
            type="button"
            aria-label="Send"
            onClick={onSendClick}
            disabled={!canSend}
            className="shrink-0 w-10 h-10 rounded-full bg-ink text-surface flex items-center justify-center disabled:opacity-30"
          >
            <SendIcon size={18} />
          </button>
        </div>
      </div>

      <TemplatePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={sendTemplate}
      />
      <CannedReplyPicker
        open={cannedOpen}
        onClose={() => setCannedOpen(false)}
        onPick={pickedBody => {
          // Insert at the textarea's cursor (or append) and refocus —
          // common UX is to drop the canned text in and let the rep tweak
          // before sending, rather than ship-it-as-is automatically.
          setText(prev => {
            const el = taRef.current
            if (!el) return prev ? `${prev}\n${pickedBody}` : pickedBody
            const start = el.selectionStart ?? prev.length
            const end = el.selectionEnd ?? prev.length
            return prev.slice(0, start) + pickedBody + prev.slice(end)
          })
          setTimeout(() => taRef.current?.focus(), 0)
        }}
      />
    </>
  )
}
