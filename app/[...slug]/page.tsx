/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metadata} from 'next'
import React from 'react'
import ProductCard from 'components/ProductCard'
import CityHeroBanner from 'components/CityHeroBanner'

import {getProductFilter} from 'util/search.util'
import {fetchProductBySlug, fetchProducts} from 'api/products.api'
import {getCategoryDescription, getCategoryTitle} from 'util/category.util'
import {
  generateProductMetadata,
  generateDefaultMetadata,
  IMetadata,
} from 'util/seo.util'
import {getCityImage} from 'util/city.util'

import {Product} from 'components/product/Product'
import {IProduct} from '../../app-store/types'
import {fetchData} from '../utils/api'
import FilterSideBar from '../../components/rent/FilterSideBar'
import {ReviewsSection} from '../../components/ReviewsSection'

import {notFound} from 'next/navigation'

interface PageProps {
  params: any
  searchParams: any
}

// Skeleton components for loading states
const ProductCardSkeleton = () => (
  <div className="border border-gray-100 w-full h-full bg-white flex flex-col sm:rounded-lg shadow-sm overflow-hidden">
    <div className="flex-grow p-4">
      <div className="bg-gray-200 h-[240px] rounded-lg skeleton"></div>
    </div>
    <div className="mt-auto bg-gradient-to-t from-gray-200 via-gray-100 to-transparent px-4 pb-4 sm:rounded-b-lg">
      <div className="bg-gray-200 h-4 rounded mb-4 skeleton"></div>
      <div className="bg-gray-200 h-6 rounded mb-4 skeleton"></div>
      <div className="bg-gray-200 h-10 rounded skeleton"></div>
    </div>
  </div>
)

const HeroBannerSkeleton = () => (
  <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden xs:mb-4 sm:mb-8 bg-gray-200">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="bg-gray-300 h-12 md:h-16 rounded mb-4 w-3/4 mx-auto skeleton"></div>
        <div className="bg-gray-300 h-6 md:h-8 rounded w-1/2 mx-auto skeleton"></div>
      </div>
    </div>
  </div>
)

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const metadata: IMetadata = generateDefaultMetadata()

  const categories = await fetchData(`categories`)
  const localParams = await params
  console.log('Local Params <>', categories)
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
  let product: IProduct | null = null
  let products: IProduct[] = []
  let meta: any = null

  if (filter) {
    if (filter.product) {
      const productSlug = localParams.slug.toString().split(',').at(-1)
      product = productSlug ? await fetchProductBySlug(productSlug) : null
    } else {
      const response: {results: IProduct[]; meta} = await fetchProducts(
        localSearchParams?.q,
        filter,
      )
      products = response.results
      meta = response.meta
    }
  }

  if (!filter || (filter && !filter.city)) {
    return notFound()
  }

  // Determine if hero banner should be shown
  const shouldShowHeroBanner =
    !filter?.product &&
    filter?.city &&
    Object.keys(localSearchParams).length === 0

  return (
    <div className="min-h-screen">
      {/* Always reserve space for hero banner to prevent layout shift */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden xs:mb-4 sm:mb-8">
        {shouldShowHeroBanner && filter.city ? (
          <CityHeroBanner
            city={filter.city}
            title={
              filter.subCategory
                ? getCategoryTitle(
                    categories,
                    filter.subCategory,
                    filter.city,
                    false,
                  )
                : 'Cameras & Equipment'
            }
            cityImage={getCityImage(filter.city)}
            description={
              filter.subCategory
                ? getCategoryDescription(
                    categories,
                    filter.subCategory,
                    filter.city,
                  )
                : 'Professional Camera Rental - DSLR & Mirrorless Cameras'
            }
          />
        ) : (
          <HeroBannerSkeleton />
        )}
      </div>

      <div className="container m-auto md:min-h-[calc(100vh-100px-418px)]">
        {!filter?.product && (
          <>
            <div
              className={
                'grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 xs:gap-1 pb-4'
              }
            >
              {products && products.length > 0
                ? products.map((product: IProduct) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    ></ProductCard>
                  ))
                : // Show skeleton loading state when no products
                  Array.from({length: 8}).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
            </div>

            {/* Always render ReviewsSection to prevent layout shift */}
            <ReviewsSection
              title="Customer Reviews"
              subtitle="See what others are saying about our equipment"
              variant="compact"
              maxReviews={3}
              showCTA={false}
              className="mt-8"
            />
          </>
        )}
        {filter?.product && product && <Product product={product}></Product>}
      </div>
    </div>
  )
}
