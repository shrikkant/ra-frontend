'use client'

import React, {useEffect, useRef, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'
import {ArrowLeftIcon, CloseIcon, SearchIcon} from '../icons'

interface SearchHeaderProps {
  initialQuery?: string
  /** When true, the input mounts focused. */
  autoFocus?: boolean
}

export default function SearchHeader({
  initialQuery = '',
  autoFocus = false,
}: SearchHeaderProps) {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const [value, setValue] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const submit = (q: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    const search = params.toString()
    router.replace(search ? `${pathname}?${search}` : pathname)
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
    <div className="px-4 pt-1.5 pb-2 flex items-center gap-2.5">
      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.back()}
        className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-ink shrink-0"
      >
        <ArrowLeftIcon size={20} />
      </button>
      <div className="flex-1 flex items-center gap-2.5 bg-surface border border-line rounded-[18px] h-12 pl-3.5 pr-3">
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
