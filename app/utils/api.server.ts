import {cookies} from 'next/headers'
import {ENV_CONFIG} from '../../config/environment'

// Server-side authenticated fetch — reads the access_token cookie and
// forwards it to the backend. Lives in a separate file so importing the
// "static" fetcher (api.ts) doesn't drag next/headers into the SSG path
// and force pages dynamic.
export const fetchData = async (url: string, customOptions?: RequestInit) => {
  console.log('fetchData', url)
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const accessToken = cookieStore.get('access_token')

  const commonOptions: RequestInit = {
    redirect: 'follow' as const,
    credentials: 'include' as const,
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
