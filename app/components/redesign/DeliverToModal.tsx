'use client'

import React, {useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useDispatch} from 'react-redux'
import {
  fetchAddressByPlaceId,
  IGooglePlaceSuggestion,
  lookupAddressSuggestions,
} from '../../../api/user/index.api'
import {detectLocation} from '../../../api/location.api'
import {setUserLocation} from '../../../app-store/session/session.slice'
import {CloseIcon, PinIcon, SearchIcon} from './icons'

interface Props {
  open: boolean
  onClose: () => void
  currentCity: string
}

// Cities we actually deliver to. Google Places returns "Bengaluru" so we
// normalise it to "Bangalore" to match how the rest of the app slugs URLs
// (mirrors util/search.util.ts#locationCity).
const SUPPORTED_CITIES = ['Pune', 'Mumbai', 'Bangalore', 'Nashik']

function normalizeCity(name: string): string {
  const lower = name.toLowerCase().trim()
  if (lower === 'bengaluru') return 'Bangalore'
  const hit = SUPPORTED_CITIES.find(c => c.toLowerCase() === lower)
  return hit ?? name
}

function isSupported(name: string): boolean {
  return SUPPORTED_CITIES.some(
    c => c.toLowerCase() === normalizeCity(name).toLowerCase(),
  )
}

function citySlug(name: string): string {
  const s = normalizeCity(name).toLowerCase().trim().replaceAll(' ', '-')
  return s
}

// Returns a new pathname with the city segment swapped, or null if the
// current pathname doesn't start with the old city (e.g. /, /blog, /p/...).
// Handles both /[city]/... and /[country]/[city]/... shapes.
function swapCityInPath(
  pathname: string,
  oldSlug: string,
  newSlug: string,
): string | null {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null
  if (segments[0].toLowerCase() === oldSlug) {
    segments[0] = newSlug
    return '/' + segments.join('/')
  }
  if (
    segments.length >= 2 &&
    segments[0].length === 2 &&
    segments[1].toLowerCase() === oldSlug
  ) {
    segments[1] = newSlug
    return '/' + segments.join('/')
  }
  return null
}

export default function DeliverToModal({open, onClose, currentCity}: Props) {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<IGooglePlaceSuggestion[]>([])
  const [searching, setSearching] = useState(false)
  const [applying, setApplying] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reqIdRef = useRef(0)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setSuggestions([])
    setError(null)
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
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

  useEffect(() => {
    if (!open) return
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
        if (myReq === reqIdRef.current) setSuggestions(results)
      } catch {
        if (myReq === reqIdRef.current) setSuggestions([])
      } finally {
        if (myReq === reqIdRef.current) setSearching(false)
      }
    }, 280)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, open])

  const applyCity = (city: string, area: string, postal: string) => {
    dispatch(setUserLocation({city, area, postal}))
    const oldSlug = citySlug(currentCity || '')
    const newSlug = citySlug(city)
    const swapped =
      oldSlug && newSlug && oldSlug !== newSlug
        ? swapCityInPath(pathname, oldSlug, newSlug)
        : null
    if (swapped) {
      const qs = searchParams?.toString()
      router.push(qs ? `${swapped}?${qs}` : swapped)
    }
    onClose()
  }

  const pickSuggestion = async (s: IGooglePlaceSuggestion) => {
    setApplying(true)
    setError(null)
    try {
      const data = await fetchAddressByPlaceId(s.place_id)
      if (!data.city) {
        setError('Could not determine the city for that place. Try another.')
        return
      }
      if (!isSupported(data.city)) {
        setError(
          `We don't deliver to ${data.city} yet. Pick a city below.`,
        )
        return
      }
      applyCity(
        normalizeCity(data.city),
        data.addressLine2 ?? '',
        data.postalCode ?? '',
      )
    } catch {
      setError('Could not load that place. Try another result.')
    } finally {
      setApplying(false)
    }
  }

  const useCurrent = async () => {
    setDetecting(true)
    setError(null)
    try {
      const loc = await detectLocation()
      if (!loc || !loc.city) {
        setError('Could not detect your location. Try searching instead.')
        return
      }
      if (!isSupported(loc.city)) {
        setError(
          `We don't deliver to ${loc.city} yet. Pick a city below.`,
        )
        return
      }
      applyCity(normalizeCity(loc.city), loc.area ?? '', loc.postal ?? '')
    } catch {
      setError('Could not detect your location. Try searching instead.')
    } finally {
      setDetecting(false)
    }
  }

  const pickQuickCity = (city: string) => {
    applyCity(city, '', '')
  }

  if (!open) return null
  if (typeof document === 'undefined') return null

  const body = (
    <div
      className="fixed inset-0 z-[100] flex md:items-start md:justify-center md:pt-[8vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your delivery location"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative bg-surface w-full md:w-[480px] md:max-w-[calc(100vw-2rem)] md:rounded-2xl md:max-h-[80vh] md:shadow-2xl flex flex-col h-full md:h-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted">
              Deliver to
            </div>
            <div className="text-[18px] font-extrabold text-ink leading-tight mt-0.5">
              Choose your location
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

        <div className="px-5 pb-3 shrink-0">
          <button
            type="button"
            onClick={useCurrent}
            disabled={detecting || applying}
            className="w-full flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3 py-3 text-left hover:bg-surface-muted disabled:opacity-60"
          >
            <span className="w-9 h-9 rounded-full bg-accent/15 text-ink flex items-center justify-center shrink-0">
              <PinIcon size={16} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-extrabold text-ink">
                {detecting ? 'Detecting…' : 'Use my current location'}
              </span>
              <span className="block text-[12px] text-ink-muted truncate">
                Based on your network
              </span>
            </span>
          </button>
        </div>

        <div className="px-5 pb-3 shrink-0">
          <div className="flex items-center gap-2 rounded-[12px] border border-line-soft bg-surface-muted px-3 py-2.5">
            <SearchIcon size={16} className="text-ink-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for area, city or pin code"
              className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-muted outline-none min-w-0"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="text-ink-muted shrink-0"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="px-5 pb-3 shrink-0">
          <div className="text-[10px] uppercase tracking-kicker font-bold text-ink-muted mb-2">
            Cities we deliver to
          </div>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CITIES.map(city => {
              const active =
                citySlug(currentCity || '') === citySlug(city)
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => pickQuickCity(city)}
                  disabled={applying}
                  className={`text-[12px] font-bold rounded-full px-3 py-1.5 border transition-colors disabled:opacity-60 ${
                    active
                      ? 'bg-ink text-surface border-ink'
                      : 'bg-surface text-ink border-line hover:bg-surface-muted'
                  }`}
                >
                  {city}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {error && (
            <div className="mx-3 mb-2 text-[12px] text-red-600">{error}</div>
          )}
          {searching && (
            <div className="px-5 py-3 text-[12px] text-ink-muted">
              Searching…
            </div>
          )}
          {!searching && query.trim().length >= 3 && suggestions.length === 0 && (
            <div className="px-5 py-3 text-[12px] text-ink-muted">
              No matches. Try a nearby area or pin code.
            </div>
          )}
          {!searching && query.trim().length < 3 && (
            <div className="px-5 py-3 text-[12px] text-ink-muted">
              Type at least 3 characters to search.
            </div>
          )}
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map(s => {
                const main = s.structured_formatting?.main_text ?? s.description
                const secondary = s.structured_formatting?.secondary_text
                return (
                  <li key={s.place_id}>
                    <button
                      type="button"
                      onClick={() => pickSuggestion(s)}
                      disabled={applying}
                      className="w-full flex items-start gap-3 text-left px-3 py-2.5 rounded-[10px] hover:bg-surface-muted disabled:opacity-60"
                    >
                      <span className="w-8 h-8 rounded-full bg-surface-muted text-ink-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <PinIcon size={14} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-bold text-ink leading-tight truncate">
                          {main}
                        </span>
                        {secondary && (
                          <span className="block text-[12px] text-ink-muted mt-0.5 leading-tight truncate">
                            {secondary}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(body, document.body)
}
