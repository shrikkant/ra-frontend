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
  }
}

export const StatwideScript: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)

  useEffect(() => {
    if (!loggedUser?.id) {
      return
    }

    const initAnalytics = () => {
      console.log(
        '[StatwideScript] Initializing analytics for user:',
        loggedUser.id,
      )

      window.featurics?.init({
        account: {
          accountName: loggedUser?.city || 'N/A',
          accountProperties: [
            {
              key: 'City',
              value: loggedUser?.city,
            },
          ],
        },
        visitor: {
          appVisitorId: loggedUser?.id,
          email: loggedUser?.email_address,
          firstName: loggedUser?.firstname || 'User ' + loggedUser?.id,
          lastName: loggedUser?.lastname || '',
          visitorProperties: [
            {
              key: 'OrganizationId',
              value: loggedUser?.id,
            },
            {
              key: 'City',
              value: loggedUser?.city || '',
            },
          ],
        },
      })
    }

    // If featurics is ready, init immediately
    if (window.featurics) {
      initAnalytics()
    } else {
      // Wait for GTM to load featurics (retry a few times)
      console.log('[StatwideScript] Waiting for featurics to load...')
      const retryTimes = [500, 1500, 3000, 5000]
      const timers = retryTimes.map((delay) =>
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
