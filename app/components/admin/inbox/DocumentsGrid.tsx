'use client'

import React, {useRef, useState} from 'react'
import {
  uploadDocument,
  setDocumentStatus,
  DocumentReviewStatus,
} from '../../../../api/admin/customers.api'
import {IDocument} from '../../../../app-store/app-defaults/types'
import {ENV_CONFIG} from '../../../../config/environment'
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

const ALLOWED_TYPES = 'image/jpeg,image/png,image/webp,application/pdf'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB — KYC PDFs run bigger than chat photos

// Backend serves document bytes from the admin-gated media endpoints. The
// browser sends the auth cookie cross-origin (same path the inbox uses for
// chat images), so we point <img>/<iframe> straight at them.
const API_BASE = ENV_CONFIG.CLIENT_API_URL.replace(/\/?$/, '/')

function photoUrl(userId: number, id: number, width?: number): string {
  return `${API_BASE}admin/users/${userId}/documents/${id}/photo${
    width ? `?width=${width}` : ''
  }`
}

function pdfUrl(userId: number, id: number): string {
  return `${API_BASE}admin/users/${userId}/documents/${id}/pdf`
}

function isImageDoc(doc: IDocument): boolean {
  return (doc.file_type || '').toLowerCase().startsWith('image/')
}

function isPdfDoc(doc: IDocument): boolean {
  return (doc.file_type || '').toLowerCase() === 'application/pdf'
}

type DocStatus = DocumentReviewStatus

function statusOf(doc: IDocument): DocStatus {
  const v = Number(doc.verified)
  if (v === 1) return 'approved'
  if (v === 2) return 'rejected'
  return 'pending'
}

const STATUS_PILL: Record<DocStatus, string> = {
  pending: 'bg-accent/30 text-ink',
  approved: 'bg-success/15 text-success',
  rejected: 'bg-danger/15 text-danger',
}

const STATUS_LABEL: Record<DocStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
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
 * Touch-friendly KYC documents grid. Two-column on mobile, three on desktop.
 * Each tile is either:
 *   - empty: dashed border + "Upload" with a plus icon, tap → file picker
 *   - filled: live preview (image thumbnail or embedded PDF first page),
 *             tap → full-screen viewer; an action footer shows the review
 *             state with Approve / Reject controls.
 *
 * Review workflow: customer uploads land as Pending; an admin approves or
 * rejects here. Documents the admin uploads are auto-approved server-side.
 */
export default function DocumentsGrid({userId, documents, onChange}: Props) {
  const [uploading, setUploading] = useState<string | null>(null) // doc type uploading
  const [reviewing, setReviewing] = useState<number | null>(null) // doc id under review
  const [error, setError] = useState<string | null>(null)
  const [viewer, setViewer] = useState<{src: string; pdf: boolean} | null>(null)
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
        e?.response?.data?.message || e?.message || 'Upload failed. Try again.',
      )
    } finally {
      setUploading(null)
    }
  }

  const open = (docType: string) => inputRefs.current[docType]?.click()

  const openViewer = (doc: IDocument) => {
    if (!doc.id) return
    if (isPdfDoc(doc)) {
      setViewer({src: pdfUrl(userId, doc.id), pdf: true})
    } else if (isImageDoc(doc)) {
      setViewer({src: photoUrl(userId, doc.id, 1400), pdf: false})
    }
  }

  const review = async (doc: IDocument, status: DocStatus) => {
    if (!doc.id || reviewing) return
    // Toggle off when tapping the already-active state → back to pending.
    const next = statusOf(doc) === status ? 'pending' : status
    setReviewing(doc.id)
    setError(null)
    try {
      const result = await setDocumentStatus(userId, doc.id, next)
      onChange(
        documents.map(d =>
          d.id === doc.id ? {...d, verified: result.verified} : d,
        ),
      )
    } catch (e: any) {
      setError(e?.message || 'Could not update document status.')
    } finally {
      setReviewing(null)
    }
  }

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

          if (!existing) {
            return (
              <div
                key={slot.type}
                className="relative rounded-[12px] overflow-hidden border border-dashed border-line bg-surface-muted"
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
              </div>
            )
          }

          const status = statusOf(existing)
          const isReviewing = reviewing === existing.id

          return (
            <div
              key={slot.type}
              className="relative rounded-[12px] overflow-hidden border border-line bg-surface flex flex-col"
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

              {/* Preview — click to open full-screen */}
              <button
                type="button"
                onClick={() => openViewer(existing)}
                className="block w-full text-left"
                aria-label={`Open ${slot.label}`}
              >
                <div className="relative aspect-[4/3] bg-bg overflow-hidden">
                  {isImageDoc(existing) && existing.id ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoUrl(userId, existing.id, 400)}
                      alt={slot.label}
                      loading="lazy"
                      crossOrigin="use-credentials"
                      className="w-full h-full object-cover"
                    />
                  ) : isPdfDoc(existing) && existing.id ? (
                    <iframe
                      src={`${pdfUrl(userId, existing.id)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      title={slot.label}
                      // Non-interactive: the wrapping button owns the click.
                      className="pointer-events-none absolute inset-0 w-full h-full bg-white"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[24px]">
                      📄
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 text-[9px] uppercase tracking-kicker font-extrabold bg-ink/70 text-surface rounded px-1.5 py-0.5">
                    {isPdfDoc(existing) ? 'PDF' : 'Image'}
                  </span>
                </div>
              </button>

              {/* Meta */}
              <div className="px-3 pt-2">
                <div className="text-[11px] font-extrabold text-ink truncate">
                  {slot.label}
                </div>
                <div className="text-[10px] text-ink-muted truncate font-mono">
                  {existing.file_name ?? existing.document_name ?? 'On file'}
                </div>
              </div>

              {/* Action footer — review state + approve / reject */}
              <div className="mt-2 flex items-center gap-1.5 border-t border-line-soft px-2 py-1.5">
                <span
                  className={`inline-flex items-center text-[9px] uppercase tracking-kicker font-extrabold rounded-full px-2 py-0.5 ${STATUS_PILL[status]}`}
                >
                  {STATUS_LABEL[status]}
                </span>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => review(existing, 'approved')}
                  disabled={isReviewing}
                  aria-label="Approve document"
                  title="Approve"
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors disabled:opacity-50 ${
                    status === 'approved'
                      ? 'bg-success text-surface'
                      : 'text-success hover:bg-success/10'
                  }`}
                >
                  <CheckIcon size={13} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onClick={() => review(existing, 'rejected')}
                  disabled={isReviewing}
                  aria-label="Reject document"
                  title="Reject"
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors disabled:opacity-50 ${
                    status === 'rejected'
                      ? 'bg-danger text-surface'
                      : 'text-danger hover:bg-danger/10'
                  }`}
                >
                  <CloseIcon size={13} />
                </button>
              </div>

              {/* Replace affordance */}
              <button
                type="button"
                onClick={() => open(slot.type)}
                disabled={isUploading}
                className="absolute top-2 right-2 text-[9px] uppercase tracking-kicker font-extrabold bg-ink/70 text-surface rounded-full px-2 py-1 hover:bg-ink disabled:opacity-60"
              >
                {isUploading ? '…' : 'Replace'}
              </button>
            </div>
          )
        })}
      </div>

      <ImageViewer
        src={viewer?.src ?? null}
        pdf={viewer?.pdf}
        alt="Document"
        onClose={() => setViewer(null)}
      />
    </section>
  )
}
