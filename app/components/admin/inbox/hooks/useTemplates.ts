'use client'

import {useCallback, useEffect, useState} from 'react'
import {
  IInboxTemplate,
  listInboxTemplates,
  syncWhatsAppTemplates,
} from '../../../../../api/admin/whatsapp.api'

export type SyncState = 'idle' | 'syncing' | 'synced' | 'failed'

interface State {
  templates: IInboxTemplate[]
  loading: boolean
  error: string | null
  syncState: SyncState
  syncError: string | null
}

const initial: State = {
  templates: [],
  loading: false,
  error: null,
  syncState: 'idle',
  syncError: null,
}

let cache: IInboxTemplate[] | null = null
let cacheAt = 0
const CACHE_TTL = 5 * 60 * 1000

/**
 * Approved templates list for the picker. Templates are static-ish
 * (admins don't add new ones often, and Meta approval is a separate
 * flow), so a small module-level cache keeps the picker open snappy.
 *
 * Exposes a `sync()` action to force-pull the latest list from Meta:
 * pings caramel's templates/sync endpoint (which re-fetches every
 * template from the Graph API and refreshes the local
 * whatsapp_template cache), then re-loads the approved list so the
 * picker reflects the new state. Use when a template was just
 * approved on Meta's side and isn't yet visible locally.
 */
export function useTemplates(enabled: boolean = false) {
  const [state, setState] = useState<State>(initial)

  const load = useCallback(async () => {
    setState(s => ({...s, loading: true, error: null}))
    try {
      const list = await listInboxTemplates('APPROVED')
      cache = list
      cacheAt = Date.now()
      setState(s => ({...s, templates: list, loading: false, error: null}))
    } catch (e: any) {
      setState(s => ({
        ...s,
        loading: false,
        error: e?.message || 'Could not load templates',
      }))
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    if (cache && Date.now() - cacheAt < CACHE_TTL) {
      setState(s => ({
        ...s,
        templates: cache!,
        loading: false,
        error: null,
      }))
      return
    }
    load()
  }, [enabled, load])

  const sync = useCallback(async () => {
    setState(s => ({...s, syncState: 'syncing', syncError: null}))
    try {
      await syncWhatsAppTemplates()
      // Invalidate the cache so the follow-up load actually hits the
      // server instead of returning the pre-sync list.
      cache = null
      cacheAt = 0
      await load()
      setState(s => ({...s, syncState: 'synced'}))
      // Flick back to idle after a moment so the "Synced" pill doesn't
      // linger — gives the admin a clear "done" signal then fades.
      setTimeout(() => {
        setState(s =>
          s.syncState === 'synced' ? {...s, syncState: 'idle'} : s,
        )
      }, 2500)
    } catch (e: any) {
      setState(s => ({
        ...s,
        syncState: 'failed',
        syncError:
          e?.response?.data?.message || e?.message || 'Sync failed',
      }))
    }
  }, [load])

  return {...state, sync}
}
