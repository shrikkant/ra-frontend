/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metadata} from 'next'
import React from 'react'
import {getProductFilter} from 'util/search.util'
import {fetchProductBySlug, fetchProducts} from 'api/products.api'
import {generateProductMetadata, generateDefaultMetadata} from 'util/seo.util'
import {IProduct} from '../../app-store/types'
import {fetchData} from '../utils/api'
import {notFound} from 'next/navigation'

// Import the new specialized components
import {ProductDetailPage} from './components/ProductDetailPage'
import {CityListingPage} from './components/CityListingPage'

interface PageProps {
  params: any
  searchParams: any
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const metadata: Metadata = generateDefaultMetadata()
  const localParams = await params
  const response = await fetch(`http://localhost:8484/api/v1/categories`, {
    next: {
      revalidate: 3600,
    },
  })

  const jsonResponse = await response.json()
  const categories = jsonResponse.resultFormatted

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
  const categories = await fetchData(`categories`)
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
