import {cookies} from 'next/headers'

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
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  try {
    const response = await fetch(
      `https://rentacross.com/api/v1/${url}`,
      options,
    )
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function fetchDataSSR(url: string) {
  const res = await fetch(`http://raapp:8082/api/v1/${url}`, {
    method: 'GET',
    cache: 'no-store', // force SSR call
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    console.error(`Error fetching: ${res.status} ${res.statusText}`)
    throw new Error('Failed to fetch data from Nest')
  }

  const {resultFormatted} = await res.json()

  return resultFormatted
}
