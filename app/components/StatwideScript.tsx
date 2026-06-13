'use client'
import React, {useEffect} from 'react'
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

// The Statwide/featurics agent itself is injected by GTM. This component
// only feeds it the logged-in visitor's identity once the agent is ready.
// The agent loads async, so we init immediately if it's present, otherwise
// poll a few times before giving up.
const POLL_DELAYS = [500, 1500, 3000, 5000]

export const StatwideScript: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)

  useEffect(() => {
    if (!loggedUser?.id) return

    const initAnalytics = () => {
      try {
        window.featurics?.init({
          visitor: {
            appVisitorId: loggedUser.id,
            email: loggedUser.email_address,
            firstName: loggedUser.firstname || 'User ' + loggedUser.id,
            lastName: loggedUser.lastname || '',
            visitorProperties: [
              {key: 'Phone', value: loggedUser.phone || 'N/A'},
              {key: 'City', value: loggedUser.city || 'N/A'},
            ],
          },
        })
      } catch {
        // Agent not ready / not loaded — nothing actionable here.
      }
    }

    if (window.featurics) {
      initAnalytics()
      return
    }

    let done = false
    const timers = POLL_DELAYS.map(delay =>
      setTimeout(() => {
        if (done || !window.featurics) return
        done = true
        initAnalytics()
      }, delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [loggedUser])

  return <></>
}
