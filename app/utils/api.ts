import {cookies} from 'next/headers'

// For static generation (build time)
export const fetchStaticData = async (
  url: string,
  customOptions?: RequestInit,
) => {
  const commonOptions: RequestInit = {
    redirect: 'follow' as const,
    headers: {
      'Content-Type': 'application/json',
    },
    referrer: 'https://www.rentacross.com',
    // Enable caching for static generation
    next: {revalidate: 3600 * 24}, // Revalidate every 24 hours
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  try {
    const response = await fetch(`http://rentacross.com/api/v1/${url}`, options)
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    console.error('Error fetching static data:', error)
    throw error
  }
}

// For server-side rendering with authentication
export const fetchData = async (url: string, customOptions?: RequestInit) => {
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
    referrer: 'https://www.rentacross.com',
    cache: 'no-store' as const,
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  try {
    const response = await fetch(`http://rentacross.com/api/v1/${url}`, options)
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
