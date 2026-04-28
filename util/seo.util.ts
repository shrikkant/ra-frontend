import {Metadata} from 'next'
import type {IProduct} from '../app-store/types'
import type {IFAQ} from '../app-store/app-defaults/types'
import {capitalizeCity, getCategoryTitle} from './category.util'

export interface ProductFilter {
  product?: boolean | string
  subCategory?: any
  city?: string
  state?: string
}

interface BuildOptions {
  products?: IProduct[]
  faqs?: IFAQ[]
  priceFrom?: number
}

const BASE_URL = 'https://rentacross.com'

const KNOWN_BRANDS = [
  'Canon',
  'Sony',
  'Nikon',
  'GoPro',
  'DJI',
  'Godox',
  'Insta360',
  'Samyang',
  'Sigma',
  'Tamron',
  'Zhiyun',
  'Rode',
  'Sennheiser',
  'Fujifilm',
  'Panasonic',
]

function extractBrand(title?: string): string {
  if (!title) return 'RentAcross'
  const t = title.toLowerCase()
  return KNOWN_BRANDS.find(b => t.includes(b.toLowerCase())) || 'RentAcross'
}

function findSubCategory(categories: any[], id?: number) {
  if (!id) return null
  for (const cat of categories ?? []) {
    const sc = cat.subCategories?.find((s: any) => s.id === id)
    if (sc) return sc
  }
  return null
}

// Flattens Sanity Portable Text to a plain string for the FAQ schema's
// acceptedAnswer.text (which must be a string, not blocks).
function portableTextToPlain(blocks: any): string {
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((block: any) => {
      if (block?._type !== 'block' || !Array.isArray(block.children)) return ''
      return block.children.map((c: any) => c?.text ?? '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

export const generateStructuredData = (
  filter: ProductFilter,
  product: IProduct | null,
  slug: string[],
  categories: any[],
  options?: BuildOptions,
): object[] => {
  const breadcrumb = generateBreadcrumbList(filter, slug, categories)

  if (filter.product && product) {
    return [generateProductStructuredData(product, slug), breadcrumb]
  }

  const itemList = generateItemListStructuredData(
    filter,
    slug,
    categories,
    options?.products ?? [],
  )
  const schemas: object[] = [itemList, breadcrumb]

  // LocalBusiness — only for India city pages (no real NZ ops yet, and
  // it's not a "real" business address — it's a service area).
  const isCountryPrefixed =
    slug.length > 0 && slug[0].length === 2 && slug[0] !== filter?.city
  if (filter?.city && !isCountryPrefixed) {
    schemas.push(generateLocalBusinessSchema(filter.city, options?.priceFrom))
  }

  if (options?.faqs && options.faqs.length > 0) {
    const faqPage = generateFaqPageSchema(options.faqs)
    if (faqPage) schemas.push(faqPage)
  }

  return schemas
}

const generateProductStructuredData = (product: IProduct, slug: string[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: `${BASE_URL}/api/products/${product.master_product_id}/photo`,
    offers: {
      '@type': 'Offer',
      price: product.rates?.[0]?.rate || 0,
      priceCurrency: 'INR',
      availability:
        product.qty && product.qty > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/${slug.join('/')}`,
    },
    brand: {
      '@type': 'Brand',
      name: extractBrand(product.title),
    },
  }
}

const generateItemListStructuredData = (
  filter: ProductFilter,
  slug: string[],
  categories: any[],
  products: IProduct[],
) => {
  const subCategory = findSubCategory(categories, filter.subCategory)
  const categoryTitle = getCategoryTitle(
    categories,
    filter?.subCategory ?? 0,
    filter?.city,
    true,
  )
  const cityLabel = filter?.city ? ` in ${capitalizeCity(filter.city)}` : ''
  const url = `${BASE_URL}/${slug.join('/')}`

  const itemListElement = products.slice(0, 24).map((p, i) => {
    const productUrl = p.slug
      ? `${BASE_URL}/${slug.join('/')}/${p.slug}`
      : url
    const item: Record<string, unknown> = {
      '@type': 'Product',
      name: p.title,
      url: productUrl,
    }
    if (p.master_product_id) {
      item.image = `${BASE_URL}/api/products/${p.master_product_id}/photo`
    }
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        ...item,
        offers: {
          '@type': 'Offer',
          price: p.rates?.[0]?.rate ?? 0,
          priceCurrency: 'INR',
          availability:
            p.qty && p.qty > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url: productUrl,
        },
        brand: {
          '@type': 'Brand',
          name: extractBrand(p.title),
        },
      },
    }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryTitle}${cityLabel}`,
    description: `Browse and rent ${(subCategory?.title || categoryTitle).toLowerCase()}${cityLabel} at affordable rates.`,
    url,
    numberOfItems: products.length,
    itemListElement,
  }
}

const generateBreadcrumbList = (
  filter: ProductFilter,
  slug: string[],
  categories: any[],
) => {
  const items: Array<Record<string, unknown>> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
  ]

  // For non-India routes the URL has a country prefix (e.g. /nz/auckland/...).
  // Detect by length: a 2-letter first segment that doesn't match the city.
  const isCountryPrefixed =
    slug.length > 0 && slug[0].length === 2 && slug[0] !== filter?.city

  if (filter?.city) {
    const cityHrefSegments = isCountryPrefixed ? slug.slice(0, 2) : [filter.city]
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: capitalizeCity(filter.city),
      item: `${BASE_URL}/${cityHrefSegments.join('/')}`,
    })
  } else if (filter?.state) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: capitalizeCity(filter.state),
      item: `${BASE_URL}/${filter.state}`,
    })
  }

  if (filter?.subCategory) {
    const sc = findSubCategory(categories, filter.subCategory)
    const name = sc?.title ?? slug.at(-1) ?? 'Category'
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name,
      item: `${BASE_URL}/${slug.join('/')}`,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

// Per-city LocalBusiness. Phone is the same national support line used
// on the homepage; we treat each city as a service area rather than a
// physical store (we don't have per-city pickup hub addresses yet).
const generateLocalBusinessSchema = (city: string, priceFrom?: number) => {
  const cityLabel = capitalizeCity(city)
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/${city}#business`,
    name: `RentAcross ${cityLabel}`,
    description: `Camera and photography gear rental in ${cityLabel}. DSLR, mirrorless, lenses, drones, lights and action cameras with free home delivery.`,
    url: `${BASE_URL}/${city}`,
    telephone: '+91-9112005954',
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityLabel,
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: cityLabel,
    },
  }
  if (priceFrom && priceFrom > 0) {
    schema.priceRange = `₹${priceFrom}+ /day`
  }
  return schema
}

const generateFaqPageSchema = (faqs: IFAQ[]): object | null => {
  const mainEntity = faqs
    .map(faq => {
      const text = portableTextToPlain(faq.answer)
      if (!text || !faq.question) return null
      return {
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text,
        },
      }
    })
    .filter(Boolean)

  if (mainEntity.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
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
): Metadata => {
  const title = 'Rent ' + product?.title
  const rate = (product?.rates?.[0]?.rate || 500) / 2
  const description = `Rent ${product?.title} starting ₹${rate}/day.
    Rent DSLR, Mirrorless, GoPro, Action Cameras & Lenses.
    Doorstep Delivery & Pickup. Zero Deposit.`

  return {
    title,
    description,
    alternates: {
      canonical: `/${slug.join('/')}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${slug.join('/')}`,
      images: [
        {
          url: `${BASE_URL}/api/products/${product?.master_product_id}/photo`,
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
export const generateDefaultMetadata = (): Metadata => {
  return {
    title:
      "Rent DSLR & Mirrorless Cameras, Lenses, Lights & GoPro's. Fast, Affordable, Reliable.",
    description:
      'Capture your moments with Rentacross! Explore a wide range of Sony and Canon cameras and lenses at affordable rental prices. ' +
      'Perfect for beginners and professionals. Easy booking, flexible plans—rent the gear you need today!',
  }
}
