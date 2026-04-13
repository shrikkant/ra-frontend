'use client'
import React from 'react'
import {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../app-store/auth/auth.slice'

declare global {
  interface Window {
    featurics
  }
}

export const StatwideScript: React.FC = () => {
  const loggedUser = useSelector(selectAuthState)

  useEffect(() => {
    console.log('[StatwideScript] loggedUser:', loggedUser?.id, loggedUser?.email_address)

    if (!loggedUser?.id) {
      console.log('[StatwideScript] No logged user, skipping init')
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    let initialized = false

    const initFeaturics = () => {
      if (initialized) return
      console.log('[StatwideScript] Initializing featurics for user:', loggedUser.id)
      window.featurics?.init({
        visitor: {
          appVisitorId: loggedUser.id,
          email: loggedUser.email_address,
          firstName: loggedUser.firstname || 'User ' + loggedUser.id,
          lastName: loggedUser.lastname || '',
          visitorProperties: [
            {
              key: 'Phone',
              value: loggedUser.phone || 'N/A',
            },
            {
              key: 'City',
              value: loggedUser.city || 'N/A',
            },
          ],
        },
      })
      initialized = true
      console.log('[StatwideScript] Featurics initialized successfully')
    }

    if (window.featurics) {
      initFeaturics()
    } else {
      console.log('[StatwideScript] Waiting for featurics to load...')
      ;[500, 1500, 3000, 5000].forEach(delay =>
        timers.push(setTimeout(() => {
          if (window.featurics) {
            console.log(`[StatwideScript] featurics available after ${delay}ms`)
            initFeaturics()
          } else {
            console.log(`[StatwideScript] featurics still not available after ${delay}ms`)
          }
        }, delay)),
      )
    }

    return () => timers.forEach(clearTimeout)
  }, [loggedUser])

  return <></>
}
