'use client'

import React, {useEffect, useRef} from 'react'
import {useDocumentUpload} from '../../../../../hooks/useDocumentUpload'
import {IDocument} from '../../../../../app-store/app-defaults/types'
import {Spinner} from './StepCard'
import {CheckIcon, PlusIcon} from '../../icons'

interface DocumentCardProps {
  title: string
  hint: string
  documentType: string
  existingDocument?: IDocument
  onUpload: (doc: IDocument) => void
}

export default function DocumentCard({
  title,
  hint,
  documentType,
  existingDocument,
  onUpload,
}: DocumentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const {document, uploading, handleFileUpload, removeFile, setDocument} =
    useDocumentUpload({documentType, onUpload})

  useEffect(() => {
    if (existingDocument) setDocument(existingDocument)
  }, [existingDocument, setDocument])

  // Uploaded — show a confirmation row with a replace affordance.
  if (document && !uploading) {
    return (
      <div className="border border-line-soft rounded-[14px] p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-success/15 text-success flex items-center justify-center shrink-0">
          <CheckIcon size={16} strokeWidth={3} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-ink truncate">
            {title}
          </div>
          <div className="text-[11px] text-ink-muted truncate">
            {document.file_name || 'Uploaded'}
          </div>
        </div>
        <button
          type="button"
          onClick={removeFile}
          className="text-[12px] font-extrabold text-ink underline shrink-0"
        >
          Replace
        </button>
      </div>
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        disabled={uploading}
        onChange={e =>
          e.target.files?.[0] && handleFileUpload(e.target.files[0])
        }
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-line rounded-[14px] p-3 flex items-center gap-3 text-left bg-surface disabled:opacity-70"
      >
        <div className="w-9 h-9 rounded-[10px] bg-surface-muted text-ink-secondary flex items-center justify-center shrink-0">
          {uploading ? <Spinner dark /> : <PlusIcon size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-ink">{title}</div>
          <div className="text-[11px] text-ink-muted">
            {uploading ? 'Uploading…' : hint}
          </div>
        </div>
      </button>
    </>
  )
}
