'use client'

import {useEffect, useState} from 'react'
import {
  IInboxTemplate,
  listInboxTemplates,
} from '../../../../../api/admin/whatsapp.api'

interface State {
  templates: IInboxTemplate[]
  loading: boolean
  error: string | null
}

const initial: State = {templates: [], loading: false, error: null}

let cache: IInboxTemplate[] | null = null
let cacheAt = 0
const CACHE_TTL = 5 * 60 * 1000

// Approved templates list for the picker. Templates are static-ish (admins
// don't add new ones often, and Meta approval is a separate flow), so a
// small module-level cache keeps the picker open snappy and saves a round
// trip when bouncing between conversations.
export function useTemplates(enabled: boolean = false) {
  const [state, setState] = useState<State>(initial)

  useEffect(() => {
    if (!enabled) return
    if (cache && Date.now() - cacheAt < CACHE_TTL) {
      setState({templates: cache, loading: false, error: null})
      return
    }
    let cancelled = false
    setState({templates: cache ?? [], loading: true, error: null})
    listInboxTemplates('APPROVED')
      .then(list => {
        if (cancelled) return
        cache = list
        cacheAt = Date.now()
        setState({templates: list, loading: false, error: null})
      })
      .catch(e => {
        if (cancelled) return
        setState({
          templates: cache ?? [],
          loading: false,
          error: e?.message || 'Could not load templates',
        })
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return state
}
