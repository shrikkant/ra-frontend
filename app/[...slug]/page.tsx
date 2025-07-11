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

  return (
    <div className="min-h-screen">
      {!filter?.product &&
        filter?.city &&
        Object.keys(localSearchParams).length === 0 && (
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
        )}

      <div className="container m-auto md:min-h-[calc(100vh-100px-418px)]">
        {!filter?.product && products && (
          <>
            <div
              className={
                'grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 xs:gap-1 pb-4'
              }
            >
              {products &&
                products.map((product: IProduct) => (
                  <ProductCard key={product.id} product={product}></ProductCard>
                ))}
            </div>

            {/* Customer Reviews Section */}
            {products && products.length > 0 && <ReviewsSection />}
          </>
        )}
        {filter?.product && product && <Product product={product}></Product>}
      </div>
    </div>
  )
}
