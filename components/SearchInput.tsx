/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useRef, useCallback} from 'react'

const SearchIcon = ({className}: {className?: string}) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
  </svg>
)

interface SearchInputProps {
  currentVal: any
  onChange: (val: string) => void
  onSearch: (val: string) => void
}
export const SearchInput = React.memo(function SearchInput({
  currentVal,
  onChange,
  onSearch,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleReturn = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputRef.current) {
        inputRef.current.blur()
      }
      onSearch((e.target as HTMLInputElement).value)
    }
  }, [onSearch])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  const handleClick = useCallback(() => {
    onSearch(inputRef.current?.value || '')
  }, [onSearch])

  return (
    <div className=" w-full sm:w-80 lg:w-96 gap-x-3 text-gray-800 relative my-2">
      <input
        ref={inputRef}
        defaultValue={currentVal}
        type="text"
        className="h-10 rounded px-2 w-full"
        placeholder="Canon 200D"
        onChange={handleChange}
        onKeyUp={handleReturn}
      />
      <button
        type="button"
        aria-label="Search"
        onClick={handleClick}
        className="h-10 w-10 bg-amber-500 absolute top-0 right-0 flex justify-center content-center p-2 rounded-br rounded-tr"
      >
        <SearchIcon className="h-7 w-7 text-gray-800" />
      </button>
    </div>
  )
})
