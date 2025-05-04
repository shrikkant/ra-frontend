// components/SetUTMCookie.tsx
'use client'

import {useEffect} from 'react'

export default function SetUTMCookie() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ]
    const utmData: Record<string, string> = {}

    utmKeys.forEach(key => {
      const value = urlParams.get(key)
      if (value) {
        utmData[key] = value
      }
    })

    // Only set cookie if UTM params exist and cookie is not already set
    if (
      Object.keys(utmData).length > 0 &&
      !document.cookie.includes('utm_data=')
    ) {
      document.cookie = `utm=${encodeURIComponent(JSON.stringify(utmData))}; path=/; max-age=2592000` // 30 days
    }
  }, [])

  return null
}
