/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metadata} from 'next'
import React from 'react'
import {getProductFilter} from 'util/search.util'
import {fetchProductBySlug, fetchProducts} from 'api/products.api'
import {generateProductMetadata, generateDefaultMetadata} from 'util/seo.util'
import {IProduct} from '../../app-store/types'
import {fetchData, fetchDataStatic} from '../utils/api'
import {notFound} from 'next/navigation'
import COUNTRIES from '../../config/constants'

// Import the new specialized components
import {ProductDetailPage} from './components/ProductDetailPage'
import {CityListingPage} from './components/CityListingPage'

interface PageProps {
  params: any
  searchParams: any
}

// Generate static params for city and city+subcategory pages only
// Product detail pages are excluded to avoid generating too many static pages
// This will pre-generate pages for:
// - /city (for India: /pune, /mumbai, etc.)
// - /country/city (for other countries: /nz/auckland, etc.)
// - /city/subcategory (for India: /pune/rent-camera, etc.)
// - /country/city/subcategory (for other countries: /nz/auckland/rent-camera, etc.)
export async function generateStaticParams() {
  try {
    const categories = await fetchDataStatic(`categories`)
    const staticParams: {slug: string[]}[] = []

    // Generate params for each country
    for (const country of COUNTRIES) {
      const countryCode = country.code.toLowerCase()

      // Generate city-only pages for each city in the country
      for (const city of country.locations) {
        const citySlug = city.toLowerCase().replaceAll(' ', '-')
        const citySlugNormalized =
          citySlug === 'bengaluru' ? 'bangalore' : citySlug

        // Add city-only page
        if (country.code === 'IN') {
          staticParams.push({slug: [citySlugNormalized]})
        } else {
          staticParams.push({slug: [countryCode, citySlugNormalized]})
        }

        // Generate city + subcategory pages for each subcategory
        for (const category of categories) {
          for (const subCategory of category.subCategories) {
            if (country.code === 'IN') {
              staticParams.push({slug: [citySlugNormalized, subCategory.slug]})
            } else {
              staticParams.push({
                slug: [countryCode, citySlugNormalized, subCategory.slug],
              })
            }
          }
        }
      }

      // Generate state-only pages for India
      if (country.code === 'IN') {
        for (const state of country.states) {
          const stateSlug = state.toLowerCase().replaceAll(' ', '-')
          staticParams.push({slug: [stateSlug]})

          // Generate state + subcategory pages
          for (const category of categories) {
            for (const subCategory of category.subCategories) {
              staticParams.push({slug: [stateSlug, subCategory.slug]})
            }
          }
        }
      }
    }

    return staticParams
  } catch (error) {
    console.warn('Failed to generate static params:', error)
    return []
  }
}

// Revalidate static pages every 24 hours
export const revalidate = 86400

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const metadata: Metadata = generateDefaultMetadata()
  const localParams = await params
  const categories = await fetchDataStatic(`categories`)

  const filter = getProductFilter(localParams, categories)

  if (filter) {
    if (filter.product) {
      const productSlug = localParams.slug.toString().split(',').at(-1)
      const product = productSlug ? await fetchProductBySlug(productSlug) : null

      if (product) {
        return generateProductMetadata(product, localParams.slug)
      }
    } else {
      if (filter.subCategory) {
        const {getCategoryTitle, getCategoryDescription} = await import(
          'util/category.util'
        )
        metadata.title = getCategoryTitle(
          categories,
          filter.subCategory,
          filter.city,
          true,
        )
        metadata.description = getCategoryDescription(
          categories,
          filter.subCategory,
          filter.city,
        )
      }
    }

    return {
      ...metadata,
    }
  }

  return metadata
}

export default async function Page({params, searchParams}: PageProps) {
  const categories = await fetchDataStatic(`categories`)
  const localParams = await params
  const localSearchParams = await searchParams
  const filter = getProductFilter(localParams, categories)

  if (!filter || (filter && !filter.city)) {
    return notFound()
  }

  // Route to appropriate component based on filter type
  if (filter.product) {
    // Product detail page
    const productSlug = localParams.slug.toString().split(',').at(-1)
    const product = productSlug ? await fetchProductBySlug(productSlug) : null

    if (!product) {
      return notFound()
    }

    return <ProductDetailPage product={product} />
  } else {
    // City listing page
    const response: {results: IProduct[]; meta} = await fetchProducts(
      localSearchParams?.q,
      filter,
    )

    return (
      <CityListingPage
        products={response.results}
        meta={response.meta}
        filter={filter}
        categories={categories}
        searchParams={localSearchParams}
      />
    )
  }
}
