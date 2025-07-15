import {cookies} from 'next/headers'

// Function for static generation that doesn't require cookies
export const fetchDataStatic = async (url: string) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache' as RequestCache,
  }

  try {
    const response = await fetch(`http://caramel:8484/api/v1/${url}`, options)
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const fetchData = async (url, customOptions?) => {
  const cookieStore = await cookies()
  const cookieHeader = await cookieStore.toString() // Get cookies as a string
  const accessToken = cookieStore.get('access_token')

  const commonOptions = {
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken?.value,
    },
    referrer: 'https://www.rentacross.com',
    Cookie: cookieHeader,
    // Use cache for static generation, but allow override
    cache: customOptions?.cache || 'force-cache',
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  try {
    const response = await fetch(`http://caramel:8484/api/v1/${url}`, options)
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
