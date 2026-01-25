import {useState, useCallback, useRef} from 'react'
import {IUser} from '../app-store/types'
import {fetchCustomers} from '../api/admin/customers.api'

const DEBOUNCE_DELAY = 300
const MIN_SEARCH_LENGTH = 2

interface UseUserSearchResult {
  searchResults: IUser[]
  isSearching: boolean
  searchError: string | null
  searchUsers: (query: string) => void
  clearResults: () => void
}

/**
 * Hook for searching users with debounce support.
 * Searches by name, email, or phone using the admin users API.
 *
 * Single Responsibility: Only handles user search logic and state.
 */
export function useUserSearch(): UseUserSearchResult {
  const [searchResults, setSearchResults] = useState<IUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const executeSearch = useCallback(async (query: string) => {
    if (query.length < MIN_SEARCH_LENGTH) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const users = await fetchCustomers(query)
      setSearchResults(users)
    } catch (error) {
      setSearchError('Failed to search users')
      setSearchResults([])
      console.error('User search error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const searchUsers = useCallback(
    (query: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      if (query.length < MIN_SEARCH_LENGTH) {
        setSearchResults([])
        return
      }

      debounceTimerRef.current = setTimeout(() => {
        executeSearch(query)
      }, DEBOUNCE_DELAY)
    },
    [executeSearch],
  )

  const clearResults = useCallback(() => {
    setSearchResults([])
    setSearchError(null)
  }, [])

  return {
    searchResults,
    isSearching,
    searchError,
    searchUsers,
    clearResults,
  }
}
