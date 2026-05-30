'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {createPortal} from 'react-dom'
import {CloseIcon} from '../../redesign/icons'
import {useTemplates} from './hooks/useTemplates'
import {IInboxTemplate} from '../../../../api/admin/whatsapp.api'

interface Props {
  open: boolean
  onClose: () => void
  onPick: (templateName: string, variables: string[]) => void
}

// Keep TemplatePicker focused on templates (Phase 1 surface). Canned
// replies are a separate composer affordance — see CannedReplyPicker.

// Count {{1}}, {{2}}, … in any of the template body strings. Returns the
// max index so we know how many variable inputs to render.
function countVariables(t: IInboxTemplate): number {
  const data = t.templateData
  if (!data) return 0
  const haystack = JSON.stringify(data)
  let max = 0
  const re = /\{\{(\d+)\}\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(haystack)) !== null) {
    const n = Number(m[1])
    if (n > max) max = n
  }
  return max
}

// Coerce whatever caramel ships into a string. Shapes seen in the wild:
//   "auth_otp"                ← plain string (expected)
//   { value: "auth_otp" }     ← TemplateName VO leaked through caramel's
//                                toObject(); JSON-serializes its private
//                                `value` field as a property
//   { text: "Hi {{1}}" }      ← template body sometimes double-nested
//
// Anything non-string returned here, when rendered as JSX, raises React
// error #31. Defaulting to '' lets callers degrade to a friendly value.
function strFrom(v: unknown): string {
  if (typeof v === 'string') return v
  if (v && typeof v === 'object') {
    const obj = v as Record<string, unknown>
    if (typeof obj.value === 'string') return obj.value
    if (typeof obj.text === 'string') return obj.text
  }
  return ''
}

const tName = (t: IInboxTemplate): string => strFrom(t.name) || '(unnamed)'
const tCategory = (t: IInboxTemplate): string => strFrom(t.category)
const tLanguage = (t: IInboxTemplate): string => strFrom(t.language)

// Pull a human-readable body preview out of the template_data JSON. The
// shape Meta returns nests components by type; we walk for the first BODY
// component's text. Falls back to template name if nothing obvious.
function previewBody(t: IInboxTemplate): string {
  const data = t.templateData
  if (!data) return tName(t)
  const components = data.components ?? data.template_data?.components
  if (Array.isArray(components)) {
    for (const c of components) {
      if (c?.type?.toUpperCase?.() === 'BODY' && c.text) {
        const str = strFrom(c.text)
        if (str) return str
      }
    }
  }
  if (typeof data.body === 'string') return data.body
  return tName(t)
}

export default function TemplatePicker({open, onClose, onPick}: Props) {
  const {templates, loading, error, syncState, syncError, sync} =
    useTemplates(open)
  const [selected, setSelected] = useState<IInboxTemplate | null>(null)
  const [vars, setVars] = useState<string[]>([])

  useEffect(() => {
    if (!open) {
      setSelected(null)
      setVars([])
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

  const varCount = useMemo(
    () => (selected ? countVariables(selected) : 0),
    [selected],
  )
  const ready =
    !!selected && vars.slice(0, varCount).every(v => v.trim().length > 0)

  const submit = () => {
    if (!selected || !ready) return
    // Coerce — see strFrom comment. selected.name may arrive as a
    // {value: "..."} VO object from caramel; the backend send endpoint
    // expects a plain string templateName.
    onPick(tName(selected), vars.slice(0, varCount))
    onClose()
  }

  if (!open) return null
  if (typeof document === 'undefined') return null

  const body = (
    <div
      className="fixed inset-0 z-[100] flex md:items-center md:justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Pick a message template"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative bg-surface w-full md:w-[480px] md:max-w-[calc(100vw-2rem)] md:rounded-2xl md:max-h-[80vh] md:shadow-2xl flex flex-col h-full md:h-auto mt-auto md:mt-0">
        <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-3 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted">
              Send a template
            </div>
            <div className="text-[16px] font-extrabold text-ink leading-tight mt-0.5 truncate">
              {selected ? tName(selected) : 'Pick an approved template'}
            </div>
          </div>
          {/* Sync pulls the latest template list from Meta and refreshes
              the local whatsapp_template cache. Use whenever a new
              template's just been approved on Meta's side and isn't
              showing up here yet. */}
          {!selected && (
            <button
              type="button"
              onClick={sync}
              disabled={syncState === 'syncing'}
              className={`shrink-0 inline-flex items-center gap-1 text-[11px] uppercase tracking-kicker font-extrabold rounded-full px-2.5 py-1 border transition-colors disabled:opacity-60 ${
                syncState === 'synced'
                  ? 'bg-success/15 text-success border-success/30'
                  : syncState === 'failed'
                    ? 'bg-danger/10 text-danger border-danger/30'
                    : 'bg-surface text-ink-secondary border-line hover:text-ink hover:bg-surface-muted'
              }`}
              title={
                syncState === 'failed' && syncError
                  ? syncError
                  : 'Refresh templates from Meta'
              }
            >
              {syncState === 'syncing'
                ? 'Syncing…'
                : syncState === 'synced'
                  ? '✓ Synced'
                  : syncState === 'failed'
                    ? 'Retry'
                    : 'Sync'}
            </button>
          )}
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
          {loading && (
            <div className="px-3 py-6 text-[12px] text-ink-muted">
              Loading templates…
            </div>
          )}
          {error && (
            <div className="px-3 py-3 text-[12px] text-danger">{error}</div>
          )}

          {!selected && !loading && (
            <>
              {templates.length === 0 ? (
                <div className="px-3 py-6 text-[12px] text-ink-muted">
                  No approved templates yet. Submit one in Meta Business
                  Manager.
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {templates.map(t => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(t)
                          setVars(Array(countVariables(t)).fill(''))
                        }}
                        className="w-full text-left rounded-[12px] border border-line bg-surface hover:bg-surface-muted px-3 py-2.5"
                      >
                        <div className="text-[13px] font-extrabold text-ink">
                          {tName(t)}
                        </div>
                        <div className="text-[11px] text-ink-muted uppercase tracking-kicker font-bold mt-0.5">
                          {tCategory(t)} · {tLanguage(t)}
                        </div>
                        <p className="text-[12px] text-ink-secondary mt-1 line-clamp-3 whitespace-pre-wrap">
                          {previewBody(t)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {selected && (
            <div className="space-y-3 px-1">
              <div className="rounded-[12px] bg-surface-muted px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-kicker font-extrabold text-ink-muted mb-1">
                  Preview
                </div>
                <p className="text-[13px] text-ink whitespace-pre-wrap">
                  {previewBody(selected).replace(
                    /\{\{(\d+)\}\}/g,
                    (_, n) => vars[Number(n) - 1]?.trim() || `{{${n}}}`,
                  )}
                </p>
              </div>
              {varCount === 0 ? (
                <div className="text-[12px] text-ink-muted">
                  This template has no variables.
                </div>
              ) : (
                Array.from({length: varCount}).map((_, i) => (
                  <label key={i} className="block">
                    <span className="block text-[11px] uppercase tracking-kicker font-extrabold text-ink-muted mb-1">
                      Variable {`{{${i + 1}}}`}
                    </span>
                    <input
                      type="text"
                      value={vars[i] ?? ''}
                      onChange={e => {
                        const next = vars.slice()
                        next[i] = e.target.value
                        setVars(next)
                      }}
                      className="w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[14px] text-ink outline-none focus:border-ink"
                    />
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {selected && (
          <div className="shrink-0 px-3 pb-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSelected(null)
                setVars([])
              }}
              className="flex-1 bg-surface border border-line text-ink text-[14px] font-extrabold rounded-full py-3"
            >
              Back
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!ready}
              className="flex-1 bg-ink text-surface text-[14px] font-extrabold rounded-full py-3 disabled:opacity-50"
            >
              Send template
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(body, document.body)
}
