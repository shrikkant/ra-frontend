import type {IProduct} from '../app-store/types'
import {getCategoryTitle} from './category.util'

export interface IOpenImage {
  url: string
  alt: string
}

export interface IMetadata {
  title: string
  description: string
  openGraph?: {
    title: string
    description: string
    url: string
    siteName: string
    images: IOpenImage[]
    type: string
  }
}

export interface ProductFilter {
  product?: boolean
  subCategory?: any
  city?: string
}

/**
 * Generates structured data for SEO based on filter and product
 * @param filter - Product filter object
 * @param product - Product data (if available)
 * @param slug - URL slug array
 * @param categories - Categories data
 * @returns Structured data object for SEO
 */
export const generateStructuredData = (
  filter: ProductFilter,
  product: IProduct | null,
  slug: string[],
  categories: any[],
) => {
  if (filter.product && product) {
    return generateProductStructuredData(product, slug)
  }

  return generateCategoryStructuredData(filter, slug, categories)
}

/**
 * Generates structured data for a specific product
 * @param product - Product data
 * @param slug - URL slug array
 * @returns Product structured data
 */
const generateProductStructuredData = (product: IProduct, slug: string[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: `https://rentacross.com/api/products/${product.master_product_id}/photo`,
    offers: {
      '@type': 'Offer',
      price: product.rates?.[0]?.rate || 0,
      priceCurrency: 'INR',
      availability:
        product.qty && product.qty > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `https://rentacross.com/${slug.join('/')}`,
    },
    brand: {
      '@type': 'Brand',
      name: 'Unknown',
    },
  }
}

/**
 * Generates structured data for a category page
 * @param filter - Product filter object
 * @param slug - URL slug array
 * @param categories - Categories data
 * @returns Category structured data
 */
const generateCategoryStructuredData = (
  filter: ProductFilter,
  slug: string[],
  categories: any[],
) => {
  const categoryTitle = getCategoryTitle(
    categories,
    filter?.subCategory ?? 0,
    filter?.city,
    true,
  )
  const location = filter?.city ? ` in ${filter.city}` : ''

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryTitle}${location}`,
    description: `Browse and rent ${categoryTitle.toLowerCase()}${location} at affordable rates.`,
    url: `https://rentacross.com/${slug.join('/')}`,
    itemListElement: {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'ItemList',
        name: filter.subCategory?.title,
        description: categoryTitle,
      },
    },
  }
}

/**
 * Generates metadata for a product page
 * @param product - Product data
 * @param slug - URL slug array
 * @returns Product metadata
 */
export const generateProductMetadata = (
  product: IProduct,
  slug: string[],
): IMetadata => {
  const title = 'Rent ' + product?.title
  const rate = (product?.rates?.[0]?.rate || 500) / 2
  const description = `Rent ${product?.title} starting ₹${rate}/day.
    Rent DSLR, Mirrorless, GoPro, Action Cameras & Lenses.
    Doorstep Delivery & Pickup. Zero Deposit.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://rentacross.com/${slug.join('/')}`,
      images: [
        {
          url: `https://rentacross.com/api/products/${product?.master_product_id}/photo`,
          alt: title,
        },
      ],
      type: 'website',
      siteName: 'RentAcross',
    },
  }
}

/**
 * Generates default metadata
 * @returns Default metadata object
 */
export const generateDefaultMetadata = (): IMetadata => {
  return {
    title:
      "Rent DSLR & Mirrorless Cameras, Lenses, Lights & GoPro's. Fast, Affordable, Reliable.",
    description:
      'Capture your moments with Rentacross! Explore a wide range of Sony and Canon cameras and lenses at affordable rental prices. ' +
      'Perfect for beginners and professionals. Easy booking, flexible plans—rent the gear you need today!',
  }
}
