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

export const StatwideScript: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)

  useEffect(() => {
    if (!loggedUser?.id) {
      return
    }

    const initPendo = () => {
        window.pendo.initialize({
        visitor: {
            id: loggedUser?.id,
            email: loggedUser?.email_address,
            firstName: loggedUser?.firstname,
            lastName: loggedUser?.lastname,
        },
      })
    }

    const initAnalytics = () => {
      window.featurics?.init({
        visitor: {
          appVisitorId: loggedUser?.id,
          email: loggedUser?.email_address,
          firstName: loggedUser?.firstname || 'User ' + loggedUser?.id,
          lastName: loggedUser?.lastname || '',
          visitorProperties: [
            {
              key: 'Phone',
              value: loggedUser?.phone || 'N/A',
            },
            {
              key: 'City',
              value: loggedUser?.city || 'N/A',
            },
          ],
        },
      })
    }

    if (window.pendo) {
      initPendo()
    } else {
      console.log('Waiting for pendo to load...')
      const retryTimes = [500, 1500, 3000, 5000]
      const timers = retryTimes.map(delay =>
        setTimeout(() => {
          if (window.pendo) {
            initPendo()
          }
        }, delay),
      )

      return () => timers.forEach(clearTimeout)
    }

    // If featurics is ready, init immediately
    if (window.featurics) {
      initAnalytics()
    } else {
      // Wait for GTM to load featurics (retry a few times)
      console.log('[StatwideScript] Waiting for featurics to load...')
      const retryTimes = [500, 1500, 3000, 5000]
      const timers = retryTimes.map(delay =>
        setTimeout(() => {
          if (window.featurics) {
            initAnalytics()
          }
        }, delay),
      )

      return () => timers.forEach(clearTimeout)
    }
  }, [loggedUser])

  return <></>
}
