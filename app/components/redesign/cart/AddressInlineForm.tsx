'use client'

import React, {useEffect, useRef, useState} from 'react'
import {
  addNewAddress,
  fetchAddressByPlaceId,
  IAddressPlaceDetails,
  IGooglePlaceSuggestion,
  lookupAddressSuggestions,
} from '../../../../api/user/index.api'
import {ILocation} from '../../../../app-store/types'
import {ArrowLeftIcon, CloseIcon, SearchIcon} from '../icons'

interface Props {
  onCancel: () => void
  onSaved: (address: ILocation) => void
  canGoBack?: boolean
}

export default function AddressInlineForm({
  onCancel,
  onSaved,
  canGoBack = true,
}: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<IGooglePlaceSuggestion[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<IGooglePlaceSuggestion | null>(null)
  const [details, setDetails] = useState<IAddressPlaceDetails | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [line1, setLine1] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const flatRef = useRef<HTMLInputElement | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reqIdRef = useRef(0)

  useEffect(() => {
    if (selected) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = query.trim()
    if (trimmed.length < 3) {
      setSuggestions([])
      setSearching(false)
      return
    }
    setSearching(true)
    const myReq = ++reqIdRef.current
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await lookupAddressSuggestions(trimmed)
        if (myReq === reqIdRef.current) {
          setSuggestions(results)
        }
      } catch {
        if (myReq === reqIdRef.current) setSuggestions([])
      } finally {
        if (myReq === reqIdRef.current) setSearching(false)
      }
    }, 280)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, selected])

  const pickSuggestion = async (s: IGooglePlaceSuggestion) => {
    setSelected(s)
    setQuery(s.description)
    setSuggestions([])
    setDetails(null)
    setDetailsLoading(true)
    try {
      const data = await fetchAddressByPlaceId(s.place_id)
      setDetails(data)
      setTimeout(() => flatRef.current?.focus(), 50)
    } catch {
      setError('Could not fetch address details. Try another result.')
      setSelected(null)
    } finally {
      setDetailsLoading(false)
    }
  }

  const clearSelection = () => {
    setSelected(null)
    setDetails(null)
    setQuery('')
    setLine1('')
    setError(null)
  }

  const save = async () => {
    if (!selected || !line1.trim()) return
    setSaving(true)
    setError(null)
    try {
      const newAddress = await addNewAddress(selected.place_id, line1.trim())
      onSaved(newAddress)
    } catch {
      setError('Could not save address. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const canSave = !!selected && !!details && line1.trim().length > 0 && !saving

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 -ml-1">
        {canGoBack && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Back to addresses"
            className="p-1.5 -ml-1.5 text-ink"
          >
            <ArrowLeftIcon size={20} />
          </button>
        )}
        <div className="text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
          Add new address
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 rounded-[12px] border border-line-soft bg-surface-muted px-3 py-2.5">
          <SearchIcon size={16} className="text-ink-muted shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => {
              if (selected) setSelected(null)
              setDetails(null)
              setQuery(e.target.value)
            }}
            placeholder="Search your locality, area or pin code"
            className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted outline-none min-w-0"
            autoComplete="off"
          />
          {selected && (
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Clear"
              className="text-ink-muted shrink-0"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {!selected && suggestions.length > 0 && (
          <div className="absolute z-10 left-0 right-0 mt-1 rounded-[12px] border border-line-soft bg-surface shadow-lg max-h-64 overflow-y-auto">
            {suggestions.map(s => {
              const main = s.structured_formatting?.main_text
              const secondary = s.structured_formatting?.secondary_text
              return (
                <button
                  type="button"
                  key={s.place_id}
                  onClick={() => pickSuggestion(s)}
                  className="w-full text-left px-3 py-2.5 hover:bg-surface-muted border-b border-line-soft last:border-b-0"
                >
                  <div className="text-[13px] font-bold text-ink leading-tight">
                    {main ?? s.description}
                  </div>
                  {secondary && (
                    <div className="text-[12px] text-ink-muted mt-0.5 leading-tight">
                      {secondary}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {!selected && searching && (
          <div className="absolute z-10 left-0 right-0 mt-1 rounded-[12px] border border-line-soft bg-surface px-3 py-2.5 text-[12px] text-ink-muted">
            Searching…
          </div>
        )}

        {!selected && !searching && query.trim().length >= 3 && suggestions.length === 0 && (
          <div className="absolute z-10 left-0 right-0 mt-1 rounded-[12px] border border-line-soft bg-surface px-3 py-2.5 text-[12px] text-ink-muted">
            No matches. Try a nearby area or pin code.
          </div>
        )}
      </div>

      {selected && (
        <div className="space-y-3">
          {detailsLoading ? (
            <div className="h-16 rounded-[12px] bg-surface-muted animate-pulse" />
          ) : details ? (
            <div className="rounded-[12px] bg-surface-muted px-3 py-2.5">
              <div className="text-[12px] text-ink-muted uppercase tracking-kicker font-bold">
                Detected
              </div>
              <div className="text-[13px] text-ink mt-1 leading-snug">
                {[details.addressLine2, details.city, details.state, details.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            </div>
          ) : null}

          <div>
            <label className="block text-[12px] font-bold text-ink-secondary mb-1.5">
              Flat / House no., Building name
            </label>
            <input
              ref={flatRef}
              type="text"
              value={line1}
              onChange={e => setLine1(e.target.value)}
              placeholder="e.g. 402, Lotus Heights"
              className="w-full rounded-[12px] border border-line-soft bg-surface px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ink"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="text-[12px] text-red-600">{error}</div>
      )}

      <button
        type="button"
        onClick={save}
        disabled={!canSave}
        className="w-full bg-ink text-surface text-[14px] font-extrabold rounded-full py-3 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save address'}
      </button>
    </div>
  )
}
