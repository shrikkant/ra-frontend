import {ENV_CONFIG} from '../../config/environment'

// Per-request fetch ceiling. Originally added because backend listing
// queries for low-inventory (city × subCategory) combos were taking >5
// minutes to return an empty result, causing every prerender to consume
// its full `staticPageGenerationTimeout` slot before failing. With the
// timeout, the fetch aborts cleanly, the caller catches it, the page
// builds with empty inventory (correct for a zero-inventory category),
// and the build finishes.
const FETCH_TIMEOUT_MS = 15_000

// Static-friendly fetcher. Intentionally has NO `next/headers` import so
// it doesn't disqualify importers from SSG. For authenticated server-side
// fetches use `fetchData` from `./api.server`.
export const fetchStaticData = async (
  url: string,
  customOptions?: RequestInit,
) => {
  console.log('fetchStaticData', url)
  const commonOptions: RequestInit = {
    redirect: 'follow' as const,
    credentials: 'include' as const,
    headers: {
      'Content-Type': 'application/json',
    },
    referrer: ENV_CONFIG.BASE_URL_WWW,
    next: {revalidate: 3600 * 24},
  }

  const options = {
    ...commonOptions,
    ...customOptions,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(
      `${ENV_CONFIG.SERVER_API_V1_URL}${url}`,
      {...options, signal: controller.signal},
    )
    const {resultFormatted} = await response.json()
    return resultFormatted
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      console.warn(
        `fetchStaticData timeout (${FETCH_TIMEOUT_MS}ms): ${url}`,
      )
    } else {
      console.error('Error fetching static data:', error)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
