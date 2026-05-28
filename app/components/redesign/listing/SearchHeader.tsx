'use client'

import React, {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {ArrowLeftIcon, CloseIcon, SearchIcon} from '../icons'

interface SearchHeaderProps {
  initialQuery?: string
  /** When true, the input mounts focused. */
  autoFocus?: boolean
  /**
   * City slug that searches should land on (e.g. "pune"). Searches drop
   * the current subcategory so results are category-agnostic — submitting
   * "gopro" on /pune/rent-camera lands on /pune?q=gopro and surfaces all
   * matching gear across categories.
   */
  citySlug: string
}

export default function SearchHeader({
  initialQuery = '',
  autoFocus = false,
  citySlug,
}: SearchHeaderProps) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const submit = (q: string) => {
    const target = `/${citySlug}`
    // Preserve other URL state (sort, brand, rate) but reset page since
    // search changes the result set. Reading window.location avoids
    // useSearchParams() here, which would deopt the parent listing page
    // from static rendering.
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : '',
    )
    if (q) params.set('q', q)
    else params.delete('q')
    params.delete('page')
    const search = params.toString()
    router.replace(search ? `${target}?${search}` : target)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValue(next)
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => submit(next), 300)
  }

  const onClear = () => {
    setValue('')
    submit('')
    inputRef.current?.focus()
  }

  return (
    <div className="px-4 md:px-0 pt-1.5 md:pt-6 pb-2 flex items-center gap-2.5">
      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.back()}
        className="md:hidden w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink shrink-0"
      >
        <ArrowLeftIcon size={20} />
      </button>
      <div className="flex-1 flex items-center gap-2.5 bg-surface border border-line rounded-[18px] h-12 md:h-14 pl-3.5 pr-3">
        <SearchIcon size={20} className="text-ink-secondary shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={onChange}
          placeholder="Search Canon, GoPro, 50mm…"
          aria-label="Search products"
          className="flex-1 min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-muted outline-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={onClear}
            className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-ink"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
