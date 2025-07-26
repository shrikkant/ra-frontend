import {cookies} from 'next/headers'
import {ENV_CONFIG} from '../../config/environment'

// For static generation (build time)
export const fetchStaticData = async (
  url: string,
  customOptions?: RequestInit,
) => {
  console.log('fetchStaticData', url)
  const commonOptions: RequestInit = {
    redirect: 'follow' as const,
    headers: {
      'Content-Type': 'application/json',
    },
    referrer: ENV_CONFIG.BASE_URL_WWW,
    // Enable caching for static generation
    next: {revalidate: 3600 * 24}, // Revalidate every 24 hours
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  try {
    const response = await fetch(
      `${ENV_CONFIG.SERVER_API_V1_URL}${url}`,
      options,
    )
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    console.error('Error fetching static data:', error)
    throw error
  }
}

// For server-side rendering with authentication
export const fetchData = async (url: string, customOptions?: RequestInit) => {
  console.log('fetchData', url)
  const cookieStore = await cookies()
  const cookieHeader = await cookieStore.toString() // Get cookies as a string
  const accessToken = cookieStore.get('access_token')

  const commonOptions: RequestInit = {
    redirect: 'follow' as const,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken?.value && {authorization: accessToken.value}),
      Cookie: cookieHeader,
    },
    referrer: ENV_CONFIG.BASE_URL_WWW,
    cache: 'no-store' as const,
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  try {
    const response = await fetch(
      `${ENV_CONFIG.SERVER_API_V1_URL}${url}`,
      options,
    )
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
