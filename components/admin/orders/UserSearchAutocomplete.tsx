'use client'

import React, {useState, useRef, useEffect} from 'react'
import {FaSearch, FaTimes, FaSpinner} from 'react-icons/fa'
import {IUser} from '../../../app-store/types'
import {useUserSearch} from '../../../hooks/useUserSearch'

interface UserSearchAutocompleteProps {
  onUserSelect: (user: IUser | null) => void
  selectedUser: IUser | null
  placeholder?: string
}

interface UserOptionProps {
  user: IUser
  onSelect: (user: IUser) => void
  isHighlighted: boolean
}

/**
 * Single user option in the dropdown.
 * Single Responsibility: Renders one user option.
 */
const UserOption: React.FC<UserOptionProps> = ({
  user,
  onSelect,
  isHighlighted,
}) => {
  const displayName = [user.firstname, user.lastname].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className={`w-full px-3 py-2 text-left hover:bg-amber-50 focus:bg-amber-50 focus:outline-none ${
        isHighlighted ? 'bg-amber-50' : ''
      }`}
    >
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 text-sm">
          {displayName || 'No Name'}
        </span>
        <span className="text-xs text-gray-500">
          {user.email_address}
          {user.phone && ` • ${user.phone}`}
        </span>
      </div>
    </button>
  )
}

/**
 * Selected user badge component.
 * Single Responsibility: Displays the selected user with clear option.
 */
const SelectedUserBadge: React.FC<{
  user: IUser
  onClear: () => void
}> = ({user, onClear}) => {
  const displayName = [user.firstname, user.lastname].filter(Boolean).join(' ')

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
      <span className="text-sm font-medium text-amber-800">
        {displayName || user.email_address}
      </span>
      <button
        type="button"
        onClick={onClear}
        className="p-1 hover:bg-amber-100 rounded-full"
        aria-label="Clear selection"
      >
        <FaTimes className="h-3 w-3 text-amber-600" />
      </button>
    </div>
  )
}

/**
 * User search autocomplete component.
 * Provides search input with dropdown suggestions for selecting a user.
 *
 * Single Responsibility: Handles user search UI and selection.
 * Open/Closed: Extensible via props for different use cases.
 */
export const UserSearchAutocomplete: React.FC<UserSearchAutocompleteProps> = ({
  onUserSelect,
  selectedUser,
  placeholder = 'Search by name, email, or phone...',
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {searchResults, isSearching, searchUsers, clearResults} =
    useUserSearch()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setHighlightedIndex(-1)

    if (value.length >= 2) {
      searchUsers(value)
      setIsOpen(true)
    } else {
      clearResults()
      setIsOpen(false)
    }
  }

  const handleUserSelect = (user: IUser) => {
    onUserSelect(user)
    setInputValue('')
    setIsOpen(false)
    clearResults()
  }

  const handleClearSelection = () => {
    onUserSelect(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : 0,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : searchResults.length - 1,
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
          handleUserSelect(searchResults[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  if (selectedUser) {
    return (
      <SelectedUserBadge user={selectedUser} onClear={handleClearSelection} />
    )
  }

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <FaSpinner className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <FaSearch className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchResults.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
        />
      </div>

      {isOpen && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {searchResults.map((user, index) => (
            <UserOption
              key={user.id}
              user={user}
              onSelect={handleUserSelect}
              isHighlighted={index === highlightedIndex}
            />
          ))}
        </div>
      )}

      {isOpen && !isSearching && inputValue.length >= 2 && searchResults.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3">
          <p className="text-sm text-gray-500 text-center">No users found</p>
        </div>
      )}
    </div>
  )
}
