'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {
  IInboxOrderContext,
  getInboxOrderContext,
} from '../../../../../api/admin/whatsapp.api'

interface State {
  data: IInboxOrderContext | null
  loading: boolean
  error: string | null
}

const initial: State = {data: null, loading: true, error: null}

/**
 * Customer's active rental + lifetime stats for the right pane.
 *
 * Fetched once per conversation. Orders change relatively slowly (a few
 * times a day at most), so we don't bother subscribing to live updates
 * here — the rep can hit refresh if a new order lands mid-chat. Cheap
 * to add an SSE hook later when we plumb order events into the bus.
 */
export function useOrderContext(conversationId: string | null) {
  const [state, setState] = useState<State>(initial)
  const generationRef = useRef(0)

  const fetchIt = useCallback(async (id: string) => {
    const myGen = ++generationRef.current
    setState(s => ({...s, loading: true, error: null}))
    try {
      const data = await getInboxOrderContext(id)
      if (myGen !== generationRef.current) return
      setState({data, loading: false, error: null})
    } catch (e: any) {
      if (myGen !== generationRef.current) return
      setState({
        data: null,
        loading: false,
        error: e?.message || 'Could not load order context',
      })
    }
  }, [])

  useEffect(() => {
    if (conversationId) fetchIt(conversationId)
    else setState(initial)
  }, [conversationId, fetchIt])

  return {
    ...state,
    refetch: () => conversationId && fetchIt(conversationId),
  }
}
