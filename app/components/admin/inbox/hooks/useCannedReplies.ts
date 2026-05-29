'use client'

import {useCallback, useEffect, useState} from 'react'
import {
  ICannedReply,
  createCannedReply,
  deleteCannedReply,
  listCannedReplies,
  updateCannedReply,
} from '../../../../../api/admin/whatsapp.api'

interface State {
  items: ICannedReply[]
  loading: boolean
  error: string | null
}

const initial: State = {items: [], loading: false, error: null}

let cache: ICannedReply[] | null = null
let cacheAt = 0
const TTL = 60 * 1000

/**
 * Canned replies CRUD with a small module-level cache. Templates evolve
 * slowly across a session — caching keeps the picker popover snappy and
 * avoids re-fetching every time it opens. Mutations refresh the cache.
 */
export function useCannedReplies(enabled: boolean = true) {
  const [state, setState] = useState<State>(() =>
    cache ? {items: cache, loading: false, error: null} : initial,
  )

  const refresh = useCallback(async () => {
    setState(s => ({...s, loading: true, error: null}))
    try {
      const items = await listCannedReplies()
      cache = items
      cacheAt = Date.now()
      setState({items, loading: false, error: null})
    } catch (e: any) {
      setState(s => ({
        ...s,
        loading: false,
        error: e?.message || 'Could not load replies',
      }))
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    if (cache && Date.now() - cacheAt < TTL) {
      setState({items: cache, loading: false, error: null})
      return
    }
    refresh()
  }, [enabled, refresh])

  const create = useCallback(
    async (args: {title: string; body: string; shared?: boolean}) => {
      const created = await createCannedReply(args)
      cache = cache ? [...cache, created] : [created]
      cacheAt = Date.now()
      setState(s => ({...s, items: [...s.items, created]}))
      return created
    },
    [],
  )

  const update = useCallback(
    async (id: number, args: {title?: string; body?: string}) => {
      const updated = await updateCannedReply(id, args)
      cache = (cache ?? []).map(r => (r.id === id ? updated : r))
      cacheAt = Date.now()
      setState(s => ({
        ...s,
        items: s.items.map(r => (r.id === id ? updated : r)),
      }))
      return updated
    },
    [],
  )

  const remove = useCallback(async (id: number) => {
    await deleteCannedReply(id)
    cache = (cache ?? []).filter(r => r.id !== id)
    cacheAt = Date.now()
    setState(s => ({...s, items: s.items.filter(r => r.id !== id)}))
  }, [])

  return {...state, refresh, create, update, remove}
}
