export interface Category {
  id: number
  title: string
  subCategories?: SubCategory[]
}

export interface SubCategory {
  id: number
  title: string
  seo_title?: string
  seo_description?: string
}

const getFallbackDescription = (city?: string): string => {
  if (city) {
    const capitalizedCity = capitalizeCity(city)
    return `Professional Camera Rental in ${capitalizedCity} - DSLR & Mirrorless Cameras | RentAcross`
  }
  return 'Professional Camera Rental - DSLR & Mirrorless Cameras | RentAcross'
}

export const getCategoryDescription = (
  categories: Category[],
  subCategoryId: number = 0,
  city?: string,
): string => {
  for (const category of categories) {
    const subCategory = category.subCategories?.find(
      sc => sc.id === subCategoryId,
    )
    if (subCategory?.seo_description) {
      if (city && subCategory.seo_description) {
        const capitalizedCity = capitalizeCity(city)
        return subCategory.seo_description.replace('${city}', capitalizedCity)
      }
      return subCategory.seo_description
    }
    if (city) {
      const defaultDescription =
        'Professional Camera Rental in ${city} - DSLR & Mirrorless Cameras'
      const capitalizedCity = capitalizeCity(city)
      return defaultDescription.replace('${city}', capitalizedCity)
    }
  }
  return getFallbackDescription(city)
}
/**
 * Gets the appropriate category title based on subcategory ID and city
 * @param categories - Array of categories with subcategories
 * @param subCategoryId - ID of the subcategory to find
 * @param city - Optional city name for location-specific titles
 * @param useSeoTitle - Whether to use SEO title or display title
 * @returns Formatted category title
 */
export const getCategoryTitle = (
  categories: Category[],
  subCategoryId: number = 0,
  city?: string,
  useSeoTitle: boolean = false,
): string => {
  for (const category of categories) {
    const subCategory = category.subCategories?.find(
      sc => sc.id === subCategoryId,
    )
    if (subCategory) {
      if (city && subCategory.seo_title && useSeoTitle) {
        const capitalizedCity = capitalizeCity(city)
        return subCategory.seo_title.replace('${city}', capitalizedCity)
      }
      if (city && subCategory.seo_title) {
        const capitalizedCity = capitalizeCity(city)
        return subCategory.seo_title.replace('${city}', capitalizedCity)
      }
      return useSeoTitle
        ? subCategory.seo_title || subCategory.title
        : subCategory.title
    } else if (city) {
      const defaultTitle = 'Rent DSLR & Mirrorless Cameras in ${city}'
      const capitalizedCity = capitalizeCity(city)

      return defaultTitle.replace('${city}', capitalizedCity)
    }
  }

  return getFallbackTitle(city, useSeoTitle)
}

/**
 * Title-cases a city name, handling multi-word and hyphenated forms.
 * "pune" → "Pune", "PUNE" → "Pune", "Navi Mumbai" → "Navi Mumbai",
 * "navi-mumbai" → "Navi Mumbai", "new york" → "New York".
 */
export const capitalizeCity = (city: string): string => {
  if (!city) return city
  return city
    .split(/[-\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Gets fallback title when no subcategory is found
 * @param city - Optional city name
 * @param useSeoTitle - Whether to use SEO format
 * @returns Fallback title
 */
const getFallbackTitle = (
  city?: string,
  useSeoTitle: boolean = false,
): string => {
  if (city) {
    const capitalizedCity = capitalizeCity(city)
    return useSeoTitle
      ? `Professional Camera Rental in ${capitalizedCity} - DSLR & Mirrorless Cameras | RentAcross`
      : `Professional Camera Rental in ${capitalizedCity}- DSLR & Mirrorless Cameras`
  }

  return useSeoTitle
    ? 'Professional Camera Rental - DSLR & Mirrorless Cameras | RentAcross'
    : 'Cameras & Equipment'
}
