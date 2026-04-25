/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from './axios.config'

export interface DetectedLocation {
  ip: string
  city: string
  area: string
  postal: string
}

// Hits toffee /api/location/detect — server reads x-forwarded-for,
// looks up GeoLite2 + postalpincode.in (no Google) and returns city
// + locality. Cached client-side in session.userLocation so this
// fires at most once per fresh storage.
export async function detectLocation(): Promise<DetectedLocation | null> {
  try {
    const response: any = await httpClient.get('location/detect')
    return response ?? null
  } catch {
    return null
  }
}
