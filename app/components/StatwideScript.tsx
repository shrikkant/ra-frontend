'use client'
  import React from 'react'
  import {useEffect} from 'react'
  import {useSelector} from 'react-redux'
  import {selectAuthState} from '../../app-store/auth/auth.slice'


  declare global {
    interface Window {
      featurics
      heap
      analytics
      aptrinsic
      pendo
    }
  }

  const TAG = '[STATWIDE-DEBUG]'

  // Dump everything relevant about the tracker's current state
  const dumpState = (label: string) => {
    try {
      const projectId = (window as any)._awa_project_id
      const prefix = `awa-${projectId}-`
      const state = {
        label,
        timestamp: new Date().toISOString(),
        featuricsExists: !!window.featurics,
        featuricsInitType: typeof window.featurics?.init,
        featuricsQueueLen: window.featurics?._q?.length,
        featuricsIsRealInit: window.featurics?.init?.toString?.().slice(0, 60),
        lsIdentified: localStorage.getItem(prefix + 'identified'),
        lsSessionId: localStorage.getItem(prefix + 'sessionId'),
        lsUInfo: localStorage.getItem(prefix + 'uInfo'),
        lsAnonymousId: localStorage.getItem(prefix + 'anonymousId'),
        lsAnonymousSessionCreated: localStorage.getItem(prefix + 'anonymousSessionCreated'),
        lsEnableTracking: localStorage.getItem(prefix + 'enableTracking'),
        lsEnableSessionRecording: localStorage.getItem(prefix + 'enableSessionRecording'),
      }
      console.log(TAG, 'STATE@' + label, state)
    } catch (e) {
      console.log(TAG, 'dumpState failed:', e)
    }
  }

  export const StatwideScript: React.FC = () => {
    const loggedUser = useSelector(selectAuthState)

    // Log every render and what loggedUser looks like
    console.log(TAG, 'RENDER', {
      hasLoggedUser: !!loggedUser,
      loggedUserId: loggedUser?.id,
      loggedUserIdType: typeof loggedUser?.id,
      loggedUserEmail: loggedUser?.email_address,
    })

    useEffect(() => {
      console.log(TAG, 'EFFECT fired', {
        hasLoggedUser: !!loggedUser,
        loggedUserId: loggedUser?.id,
      })
      dumpState('effect-start')

      if (!loggedUser?.id) {
        console.log(TAG, 'EFFECT early-return: loggedUser.id is falsy')
        return
      }

      const timers: ReturnType<typeof setTimeout>[] = []

      const initAnalytics = () => {
        console.log(TAG, 'initAnalytics CALLED', {
          hasFeaturics: !!window.featurics,
          initType: typeof window.featurics?.init,
        })
        dumpState('initAnalytics-before')

        try {
          const payload = {
            visitor: {
              appVisitorId: loggedUser?.id,
              email: loggedUser?.email_address,
              firstName: loggedUser?.firstname || 'User ' + loggedUser?.id,
              lastName: loggedUser?.lastname || '',
              visitorProperties: [
                {key: 'Phone', value: loggedUser?.phone || 'N/A'},
                {key: 'City', value: loggedUser?.city || 'N/A'},
              ],
            },
          }
          console.log(TAG, 'calling featurics.init with payload:', payload)

          const result = window.featurics?.init(payload)
          console.log(TAG, 'featurics.init returned:', result)
        } catch (e) {
          console.log(TAG, 'featurics.init THREW:', e)
        }

        // Dump state a bit later to see if anything changed
        setTimeout(() => dumpState('initAnalytics-after-500ms'), 500)
        setTimeout(() => dumpState('initAnalytics-after-3000ms'), 3000)
      }


      // Init featurics (independent of pendo)
      if (window.featurics) {
        console.log(TAG, 'featurics already present, initing immediately')
        initAnalytics()
      } else {
        console.log(TAG, 'featurics NOT yet present, scheduling polling')
        ;[500, 1500, 3000, 5000].forEach(delay =>
          timers.push(
            setTimeout(() => {
              console.log(TAG, `featurics poll tick@${delay}ms`, {exists: !!window.featurics})
              if (window.featurics) initAnalytics()
              else if (delay === 5000) console.log(TAG, 'featurics poll EXHAUSTED — giving up')
            }, delay),
          ),
        )
      }

      return () => {
        console.log(TAG, 'EFFECT cleanup — clearing', timers.length, 'timers')
        timers.forEach(clearTimeout)
      }
    }, [loggedUser])

    return <></>
  }
