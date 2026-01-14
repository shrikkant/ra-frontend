/**
 * City image mapping for different cities
 */
const CITY_IMAGES: Record<string, string> = {
  pune: '/assets/v2/img/cities/pune-banner.webp',
  mumbai: '/assets/v2/img/cities/mumbai-banner.webp',
  bangalore: '/assets/v2/img/cities/bangalore-banner.webp',
  bengaluru: '/assets/v2/img/cities/bangalore-banner.webp',
  // Add more cities as needed
}

const CITY_IMAGES_MOBILE: Record<string, string> = {
  pune: '/assets/v2/img/cities/pune-banner-mobile.webp',
  mumbai: '/assets/v2/img/cities/mumbai-banner-mobile.webp',
  bangalore: '/assets/v2/img/cities/bangalore-banner-mobile.webp',
  bengaluru: '/assets/v2/img/cities/bangalore-banner-mobile.webp',
}

const DEFAULT_CITY_IMAGE = '/assets/v2/img/cities/default-banner.webp'
const DEFAULT_CITY_IMAGE_MOBILE = '/assets/v2/img/cities/default-banner-mobile.webp'

/**
 * Gets the appropriate banner image for a given city
 * @param city - City name (case insensitive)
 * @returns Path to the city banner image or default image
 */
export const getCityImage = (city: string): string => {
  const normalizedCity = city.toLowerCase()
  return CITY_IMAGES[normalizedCity] || DEFAULT_CITY_IMAGE
}

/**
 * Gets the mobile-optimized banner image for a given city
 * @param city - City name (case insensitive)
 * @returns Path to the mobile city banner image
 */
export const getCityImageMobile = (city: string): string => {
  const normalizedCity = city.toLowerCase()
  return CITY_IMAGES_MOBILE[normalizedCity] || DEFAULT_CITY_IMAGE_MOBILE
}

/**
 * Checks if a city has a specific banner image
 * @param city - City name to check
 * @returns True if city has a custom banner image
 */
export const hasCityImage = (city: string): boolean => {
  const normalizedCity = city.toLowerCase()
  return normalizedCity in CITY_IMAGES
}

/**
 * Gets all available city names that have banner images
 * @returns Array of city names with banner images
 */
export const getAvailableCities = (): string[] => {
  return Object.keys(CITY_IMAGES)
}

/**
 * Gets the city slug from a location city name
 * @param city - City name from location (case insensitive)
 * @returns City slug for URL generation
 */
export const getCitySlug = (city?: string): string => {
  if (!city) return ''
  const normalizedCity = city.toLowerCase().replaceAll(' ', '-')
  return normalizedCity === 'bengaluru' ? 'bangalore' : normalizedCity
}
