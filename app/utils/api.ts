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

  const response = await fetch(`http://rentacross.com/api/${url}`, options)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }

  const {resultFormatted} = await response.json()

  return resultFormatted
}
