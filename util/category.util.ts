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
    }
  }

  return getFallbackTitle(city, useSeoTitle)
}

/**
 * Capitalizes the first letter of a city name and makes the rest lowercase
 * @param city - City name to capitalize
 * @returns Properly capitalized city name
 */
export const capitalizeCity = (city: string): string => {
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
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
