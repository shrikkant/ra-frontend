'use client'

import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  getUserLocation,
  setUserLocation,
} from '../../../app-store/session/session.slice'
import {detectLocation} from '../../../api/location.api'

const FALLBACK_CITY = 'Pune'

interface DetectedLocation {
  city: string
  area: string
  postal: string
}

// Reads the cached user location from the session slice and, on first
// mount when nothing's cached, fires a single /api/location/detect
// call. Result is persisted by redux-persist (session is whitelisted in
// store.ts), so subsequent visits read straight from localStorage with
// no network roundtrip. Falls back to "Pune" with no area when the
// IP can't be mapped (VPN / localhost / unknown).
export function useDetectedLocation(): DetectedLocation {
  const dispatch = useDispatch()
  const stored = useSelector(getUserLocation)

  useEffect(() => {
    if (stored) return
    let cancelled = false
    detectLocation().then(loc => {
      if (cancelled || !loc || !loc.city) return
      dispatch(setUserLocation(loc))
    })
    return () => {
      cancelled = true
    }
  }, [stored, dispatch])

  return {
    city: stored?.city || FALLBACK_CITY,
    area: stored?.area || '',
    postal: stored?.postal || '',
  }
}
