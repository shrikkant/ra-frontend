'use client'

import React, {useState} from 'react'
import {CheckIcon} from '../../redesign/icons'
import {OptimisticMessage} from './hooks/useMessages'
import ImageViewer from './ImageViewer'

interface Props {
  message: OptimisticMessage
  // When true, render the leading timestamp / day separator above this
  // bubble. The parent decides this based on adjacent message times.
  showDaySeparator?: boolean
}

// Prefer our persisted copy (`localUrl`, written on inbound webhook
// ingest) — Meta's `link`/`url` expires ~24h after delivery. Falls
// through for outbound previews or transitional periods where persist
// hasn't completed yet.
function imageSrcOf(content: any): string | null {
  if (!content) return null
  return content.localUrl ?? content.link ?? content.url ?? null
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  if (isToday) return 'Today'
  const yest = new Date(today.getTime() - 86_400_000)
  if (d.toDateString() === yest.toDateString()) return 'Yesterday'
  const sameYear = d.getFullYear() === today.getFullYear()
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : {year: 'numeric'}),
  })
}

function Tick({status, optimistic}: {status: string; optimistic?: string}) {
  if (optimistic === 'failed') {
    return (
      <span className="text-[10px] text-danger font-bold ml-1">Failed</span>
    )
  }
  if (optimistic === 'sending') {
    return (
      <span
        aria-label="Sending"
        className="inline-block w-2 h-2 rounded-full bg-current opacity-40 animate-pulse ml-1"
      />
    )
  }
  // sent / delivered / read
  const lower = status.toLowerCase()
  if (lower === 'read') {
    return (
      <span className="inline-flex items-center -space-x-1 ml-1 text-accent">
        <CheckIcon size={12} strokeWidth={3} />
        <CheckIcon size={12} strokeWidth={3} />
      </span>
    )
  }
  if (lower === 'delivered') {
    return (
      <span className="inline-flex items-center -space-x-1 ml-1 opacity-70">
        <CheckIcon size={12} strokeWidth={2.5} />
        <CheckIcon size={12} strokeWidth={2.5} />
      </span>
    )
  }
  if (lower === 'sent' || lower === 'pending' || lower === 'queued') {
    return (
      <span className="inline-flex ml-1 opacity-60">
        <CheckIcon size={12} strokeWidth={2.5} />
      </span>
    )
  }
  return null
}

function renderContent(
  message: OptimisticMessage,
  onImageTap: (src: string) => void,
): React.ReactNode {
  const type = message.messageType
  const content = message.content
  if (type === 'text') {
    return <p className="whitespace-pre-wrap break-words">{content?.body}</p>
  }
  if (type === 'image') {
    const url = imageSrcOf(content)
    return (
      <div>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={content?.caption ?? 'Image'}
            loading="lazy"
            onClick={() => onImageTap(url)}
            className="rounded-[10px] max-h-72 object-cover cursor-zoom-in"
          />
        ) : (
          <div className="rounded-[10px] bg-black/10 px-3 py-6 text-center text-[12px] opacity-80">
            📷 Image — not yet downloaded
          </div>
        )}
        {content?.caption && (
          <p className="mt-1.5 whitespace-pre-wrap break-words">
            {content.caption}
          </p>
        )}
      </div>
    )
  }
  if (type === 'template') {
    const tplName = message.templateName || 'template'
    return (
      <div className="text-[12px] italic opacity-90">
        Sent template: <span className="font-bold">{tplName}</span>
      </div>
    )
  }
  if (type === 'document') {
    const name = content?.filename || 'Document'
    return <p>📄 {name}</p>
  }
  if (type === 'audio' || type === 'voice') {
    return <p>🎙️ Voice note</p>
  }
  if (type === 'video') {
    return <p>🎬 Video</p>
  }
  return <p className="opacity-70">{type}</p>
}

export default function MessageBubble({message, showDaySeparator}: Props) {
  const isOutbound = message.direction === 'outbound'
  const [viewerSrc, setViewerSrc] = useState<string | null>(null)
  return (
    <>
      {showDaySeparator && (
        <div className="flex justify-center my-3">
          <span className="bg-surface border border-line text-[11px] font-bold text-ink-secondary px-3 py-1 rounded-full">
            {formatDayLabel(message.createdAt)}
          </span>
        </div>
      )}
      <div
        className={`flex ${
          isOutbound ? 'justify-end' : 'justify-start'
        } px-3 lg:px-5`}
      >
        <div
          className={`max-w-[80%] lg:max-w-[68%] rounded-2xl px-3 py-2 text-[14px] leading-snug ${
            isOutbound
              ? 'bg-ink text-surface rounded-br-sm'
              : 'bg-surface-muted text-ink rounded-bl-sm'
          }`}
        >
          {renderContent(message, setViewerSrc)}
          <div
            className={`flex items-center justify-end mt-1 font-mono text-[10px] ${
              isOutbound ? 'text-surface/70' : 'text-ink-muted'
            }`}
          >
            {formatTime(message.createdAt)}
            {isOutbound && (
              <Tick status={message.status} optimistic={message.optimistic} />
            )}
          </div>
        </div>
      </div>
      <ImageViewer
        src={viewerSrc}
        alt={message.content?.caption ?? 'Image'}
        onClose={() => setViewerSrc(null)}
      />
    </>
  )
}
