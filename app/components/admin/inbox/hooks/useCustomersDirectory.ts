'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {
  fetchCustomersDirectory,
  ICustomerDirectoryRow,
} from '../../../../../api/admin/customers.api'

const PAGE_LIMIT = 30

interface State {
  items: ICustomerDirectoryRow[]
  total: number
  page: number
  loading: boolean
  loadingMore: boolean
  error: string | null
}

const initial: State = {
  items: [],
  total: 0,
  page: 1,
  loading: true,
  loadingMore: false,
  error: null,
}

/**
 * Owns the "All customers" directory list state.
 *
 *  - Refetches the first page when the search query changes.
 *  - Page-based "load more" pagination (infinite scroll), mirroring the
 *    conversation inbox list interaction.
 *  - A request-generation guard drops out-of-order responses so a slow
 *    earlier fetch can't clobber a newer one.
 */
export function useCustomersDirectory(q?: string) {
  const [state, setState] = useState<State>(initial)
  const generationRef = useRef(0)

  const fetchPage = useCallback(
    async (mode: 'replace' | 'append', page: number) => {
      const myGen = ++generationRef.current
      setState(s => ({
        ...s,
        loading: mode === 'replace',
        loadingMore: mode === 'append',
        error: null,
      }))
      try {
        const res = await fetchCustomersDirectory({q, page, limit: PAGE_LIMIT})
        if (myGen !== generationRef.current) return
        setState(s => ({
          items: mode === 'replace' ? res.items : [...s.items, ...res.items],
          total: res.total,
          page: res.page,
          loading: false,
          loadingMore: false,
          error: null,
        }))
      } catch (e: any) {
        if (myGen !== generationRef.current) return
        setState(s => ({
          ...s,
          loading: false,
          loadingMore: false,
          error: e?.message || 'Could not load customers',
        }))
      }
    },
    [q],
  )

  useEffect(() => {
    fetchPage('replace', 1)
  }, [fetchPage])

  const hasMore = state.items.length < state.total
  const loadMore = useCallback(() => {
    if (state.loadingMore || !hasMore) return
    fetchPage('append', state.page + 1)
  }, [state.loadingMore, hasMore, state.page, fetchPage])

  const refresh = useCallback(() => fetchPage('replace', 1), [fetchPage])

  return {
    customers: state.items,
    total: state.total,
    loading: state.loading,
    loadingMore: state.loadingMore,
    hasMore,
    error: state.error,
    loadMore,
    refresh,
  }
}
