import {UtmData} from '../app-store/types'

/**
 * Extracts UTM parameters from a params object and returns a UtmData object
 * @param params - Object containing URL parameters (optional, defaults to window.location.search)
 * @returns UtmData object with extracted UTM parameters, or null if no UTM data found
 */
export const extractUTMParams = (
  params?: Record<string, string | string[]>,
): UtmData | null => {
  // If no params provided, extract from window.location.search
  if (!params && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const paramsObj: Record<string, string> = {}
    urlParams.forEach((value, key) => {
      paramsObj[key] = value
    })
    params = paramsObj
  }

  if (!params) return null

  const utmData: UtmData = {}

  // Extract UTM parameters
  const utmSource = getParamValue(params, 'utm_source')
  const utmMedium = getParamValue(params, 'utm_medium')
  const utmCampaign = getParamValue(params, 'utm_campaign')
  const utmTerm = getParamValue(params, 'utm_term')
  const utmContent = getParamValue(params, 'utm_content')

  // Extract Google Ads parameters
  const gclid = getParamValue(params, 'gclid')
  const gadSource = getParamValue(params, 'gad_source')
  const gadCampaignId = getParamValue(params, 'gad_campaignid')
  const gbraid = getParamValue(params, 'gbraid')

  // Only add parameters that exist
  if (utmSource) utmData.utm_source = utmSource
  if (utmMedium) utmData.utm_medium = utmMedium
  if (utmCampaign) utmData.utm_campaign = utmCampaign
  if (utmTerm) utmData.utm_term = utmTerm
  if (utmContent) utmData.utm_content = utmContent
  if (gclid) utmData.gclid = gclid
  if (gadSource) utmData.gad_source = gadSource
  if (gadCampaignId) utmData.gad_campaignid = gadCampaignId
  if (gbraid) utmData.gbraid = gbraid

  // Return null if no UTM data found
  return Object.keys(utmData).length > 0 ? utmData : null
}

/**
 * Helper function to safely extract a single value from params object
 * @param params - Object containing URL parameters
 * @param key - Parameter key to extract
 * @returns String value or undefined if not found
 */
const getParamValue = (
  params: Record<string, string | string[]>,
  key: string,
): string | undefined => {
  const value = params[key]
  if (!value) return undefined

  // Handle both string and string[] cases
  if (Array.isArray(value)) {
    return value[0] || undefined
  }

  return value
}
