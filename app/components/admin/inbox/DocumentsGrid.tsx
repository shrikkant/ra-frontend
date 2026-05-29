'use client'

import React, {useRef, useState} from 'react'
import {uploadDocument} from '../../../../api/admin/customers.api'
import {IDocument} from '../../../../app-store/app-defaults/types'
import {CheckIcon, CloseIcon, PlusIcon} from '../../redesign/icons'
import ImageViewer from './ImageViewer'

interface Props {
  userId: number
  documents: IDocument[]
  onChange: (next: IDocument[]) => void
}

interface DocSlot {
  type: string
  label: string
  // Marks the two slots required for the standard KYC predicate so the
  // grid surfaces "required vs. nice-to-have" without a separate legend.
  required?: boolean
}

const SLOTS: DocSlot[] = [
  {type: 'driving_license', label: 'Driving License', required: true},
  {type: 'passport', label: 'Passport', required: true},
  {type: 'utility_bill', label: 'Utility Bill', required: true},
  {type: 'pan_card', label: 'PAN Card'},
  {type: 'bank_statement', label: 'Bank Statement'},
  {type: 'rent_agreement', label: 'Rent Agreement'},
  {type: 'index2', label: 'Index 2'},
]

const ALLOWED_TYPES =
  'image/jpeg,image/png,image/webp,application/pdf'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB — KYC PDFs run bigger than chat photos

function isImage(doc: IDocument): boolean {
  return (doc.file_type || '').toLowerCase().startsWith('image/')
}

function previewUrl(doc: IDocument): string | null {
  // Prefer canonical url; fallbacks let us render historical doc rows
  // that only stored individual sides (front/back).
  return doc.url || doc.front || doc.back || null
}

/**
 * Wrap the legacy callback-style uploadDocument in a promise so the UI
 * can await it cleanly. The underlying call streams progress through
 * `onProgress`; we ignore it here for MVP simplicity (overall upload
 * spinner is enough signal in a side pane).
 */
function uploadDocPromise(
  userId: number,
  file: File,
  documentType: string,
): Promise<IDocument> {
  return new Promise((resolve, reject) => {
    uploadDocument(
      userId,
      file,
      documentType,
      'front',
      () => {},
      (data: any) => resolve(data?.data ?? data),
      (err: any) => reject(err),
    )
  })
}

/**
 * Touch-friendly documents grid. Two-column on mobile, three on desktop.
 * Each tile is either:
 *   - empty: dashed border + "Upload" with a plus icon, tap → file picker
 *   - filled: preview thumbnail (image) or filename pill (PDF / other),
 *             tap → full-screen viewer for images, opens in tab for PDFs
 * "Re-upload" affordance on filled tiles for replacing an existing doc.
 */
export default function DocumentsGrid({userId, documents, onChange}: Props) {
  const [uploading, setUploading] = useState<string | null>(null) // doc type currently uploading
  const [error, setError] = useState<string | null>(null)
  const [viewerSrc, setViewerSrc] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const onPick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string,
  ) => {
    const file = e.target.files?.[0]
    if (inputRefs.current[docType])
      (inputRefs.current[docType] as HTMLInputElement).value = ''
    if (!file) return
    setError(null)
    if (!ALLOWED_TYPES.split(',').includes(file.type)) {
      setError(`${docType}: only JPEG, PNG, WebP, or PDF.`)
      return
    }
    if (file.size > MAX_BYTES) {
      setError(
        `${docType}: file too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`,
      )
      return
    }
    setUploading(docType)
    try {
      const created = await uploadDocPromise(userId, file, docType)
      const next = documents.filter(d => d.document_type !== docType)
      onChange([...next, created])
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          'Upload failed. Try again.',
      )
    } finally {
      setUploading(null)
    }
  }

  const open = (docType: string) => inputRefs.current[docType]?.click()

  return (
    <section className="bg-surface border border-line rounded-[16px] overflow-hidden">
      <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
            Documents
          </div>
          <div className="text-[15px] font-extrabold text-ink leading-tight mt-0.5">
            KYC files
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
          Max 10 MB · PDF or image
        </span>
      </div>

      {error && (
        <div className="px-4 pt-3 text-[12px] text-danger">{error}</div>
      )}

      <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-3">
        {SLOTS.map(slot => {
          const existing = documents.find(d => d.document_type === slot.type)
          const isUploading = uploading === slot.type
          const url = existing ? previewUrl(existing) : null
          return (
            <div
              key={slot.type}
              className={`relative rounded-[12px] overflow-hidden ${
                existing
                  ? 'border border-line bg-surface'
                  : 'border border-dashed border-line bg-surface-muted'
              }`}
            >
              <input
                ref={el => {
                  inputRefs.current[slot.type] = el
                }}
                type="file"
                accept={ALLOWED_TYPES}
                capture="environment"
                className="hidden"
                onChange={e => onPick(e, slot.type)}
              />
              {existing ? (
                <button
                  type="button"
                  onClick={() => {
                    if (existing && isImage(existing) && url) {
                      setViewerSrc(url)
                    } else if (url) {
                      window.open(url, '_blank', 'noreferrer')
                    }
                  }}
                  className="block w-full text-left"
                  aria-label={`Open ${slot.label}`}
                >
                  <div className="aspect-[4/3] bg-bg flex items-center justify-center overflow-hidden">
                    {isImage(existing) && url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={slot.label}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[24px]">📄</span>
                    )}
                  </div>
                  <div className="px-3 py-2 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-extrabold text-ink truncate">
                        {slot.label}
                      </div>
                      <div className="text-[10px] text-ink-muted truncate font-mono">
                        {existing.file_name ?? existing.document_name ?? 'On file'}
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success text-surface shrink-0"
                      aria-label="Uploaded"
                    >
                      <CheckIcon size={10} strokeWidth={3} />
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => open(slot.type)}
                  disabled={isUploading}
                  className="block w-full text-center disabled:opacity-60"
                  aria-label={`Upload ${slot.label}`}
                >
                  <div className="aspect-[4/3] flex items-center justify-center">
                    {isUploading ? (
                      <span className="text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted">
                        Uploading…
                      </span>
                    ) : (
                      <span className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink">
                        <PlusIcon size={18} />
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-2">
                    <div className="text-[11px] font-extrabold text-ink truncate">
                      {slot.label}
                    </div>
                    <div className="text-[10px] text-ink-muted mt-0.5">
                      {slot.required ? 'Required' : 'Optional'}
                    </div>
                  </div>
                </button>
              )}

              {existing && (
                <button
                  type="button"
                  onClick={() => open(slot.type)}
                  disabled={isUploading}
                  aria-label={`Replace ${slot.label}`}
                  className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink/70 text-surface hover:bg-ink disabled:opacity-60"
                >
                  {isUploading ? (
                    <span
                      aria-hidden
                      className="w-2 h-2 rounded-full bg-surface animate-pulse"
                    />
                  ) : (
                    <CloseIcon size={12} />
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <ImageViewer
        src={viewerSrc}
        alt="Document"
        onClose={() => setViewerSrc(null)}
      />
    </section>
  )
}
