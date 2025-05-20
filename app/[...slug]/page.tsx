/* eslint-disable @typescript-eslint/no-explicit-any */
import {Metadata} from 'next'
import React from 'react'
import ProductCard from 'components/ProductCard'
import CityHeroBanner from 'components/CityHeroBanner'
import Script from 'next/script'

import {getProductFilter} from 'util/search.util'
import {fetchProductBySlug, fetchProducts} from 'api/products.api'

import {Product} from 'components/product/Product'
import {IProduct} from '../../app-store/types'
import {fetchData} from '../utils/api'
import FilterSideBar from '../../components/rent/FilterSideBar'

import {notFound} from 'next/navigation'

import {capitalize} from '../../util/global.util'
// type PageProps<TParams extends Record<string, any> = object, TSearchParams extends Record<string, any> = object> = {
//   params: TParams; // Dynamic route parameters
//   searchParams: TSearchParams; // Query string parameters
// };

interface PageProps {
  params: any
  searchParams: any
}

interface IOpenImage {
  url: string
  alt: string
}

interface IMetadata {
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

const generateStructuredData = (
  filter: any,
  product: IProduct | null,
  slug: string[],
  getCategoryTitle: (id: number) => string,
) => {
  if (filter.product && product) {
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
      category: getCategoryTitle(filter.subCategory ?? 0),
    }
  }

  const categoryTitle = getCategoryTitle(filter?.subCategory ?? 0)
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
        name: categoryTitle,
        description: `List of ${categoryTitle.toLowerCase()} available for rent${location}`,
      },
    },
  }
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const metadata: IMetadata = {
    title:
      "Rent DSLR & Mirrorless Cameras, Lenses, Lights & GoPro's. Fast, Affordable, Reliable.",
    description:
      'Capture your moments with Rentacross! Explore a wide range of Sony and Canon cameras and lenses at affordable rental prices. ' +
      'Perfect for beginners and professionals. Easy booking, flexible plans—rent the gear you need today!',
  }

  const categories = await fetchData(`categories`)
  const localParams = await params

  const filter = getProductFilter(localParams, categories)
  const getCategoryTitle = (subCategoryId: number = 0) => {
    for (const category of categories) {
      const subCategory = category.subCategories?.find(
        sc => sc.id === subCategoryId,
      )
      if (subCategory) {
        return subCategory.title
      }
    }
    return 'Cameras & Equipment'
  }

  if (filter) {
    if (filter.product) {
      const productSlug = localParams.slug.toString().split(',').at(-1)
      const product = productSlug ? await fetchProductBySlug(productSlug) : null
      const title = 'Rent ' + product?.title
      const description =
        'Rent ' +
        productSlug +
        ' in ' +
        filter.city +
        ' at most affordable rates.' +
        'Hasslefree camera rental. Doorstep delivery & Pickup. Zero Deposit. '

      metadata.title = title
      metadata.description = description
      metadata.openGraph = {
        title,
        description,
        url: `https://rentacross.com/${localParams.slug.join('/')}`,
        images: [
          {
            url: `https://rentacross.com/api/products/${product?.master_product_id}/photo`,
            alt: title,
          },
        ],
        type: 'website',
        siteName: 'RentAcross',
      }
    } else {
      if (filter.subCategory) {
        metadata.title = capitalize(localParams.slug[1])
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

  // const [meta, setMeta] = React.useState<any>(null);
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

  // Get city image based on city name
  const getCityImage = (city: string) => {
    const cityImages: {[key: string]: string} = {
      pune: '/assets/v2/img/cities/pune-banner.webp',
      mumbai: '/assets/v2/img/cities/mumbai-banner.webp',
      bangalore: '/assets/v2/img/cities/bangalore-banner.webp',
      bengaluru: '/assets/v2/img/cities/bangalore-banner.webp',
      // Add more cities as needed
    }
    return (
      cityImages[city.toLowerCase()] ||
      '/assets/v2/img/cities/default-banner.webp'
    )
  }

  // Get category title from categories data
  const getCategoryTitle = (subCategoryId: number = 0) => {
    for (const category of categories) {
      const subCategory = category.subCategories?.find(
        sc => sc.id === subCategoryId,
      )
      if (subCategory) {
        return subCategory.title
      }
    }
    return 'Cameras & Equipment'
  }

  return (
    <div className="min-h-screen">
      {!filter?.product &&
        filter?.city &&
        Object.keys(localSearchParams).length === 0 && (
          <CityHeroBanner
            city={filter.city}
            category={
              filter.subCategory
                ? getCategoryTitle(filter.subCategory)
                : 'Cameras & Equipment'
            }
            cityImage={getCityImage(filter.city)}
          />
        )}

      <div className="container m-auto md:min-h-[calc(100vh-100px-418px)]">
        {!filter?.product && products && (
          <>
            <FilterSideBar searchMeta={meta} filter={filter}></FilterSideBar>
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
          </>
        )}
        {filter?.product && product && <Product product={product}></Product>}
      </div>
    </div>
  )
}
