import React from 'react'
import {generateStructuredData} from 'util/seo.util'
import {JsonLd} from 'components/seo/JsonLd'
import {LocationSync} from 'components/LocationSync'
import {IProduct, IProductFilter} from '../../../app-store/types'
import {IFAQ} from '../../../app-store/app-defaults/types'
import ListingScreen from '../../components/redesign/listing/ListingScreen'

interface RedesignedListingPageProps {
  products: IProduct[]
  meta: any
  filter: IProductFilter
  categories: any[]
  searchParams: any
  faqs?: IFAQ[]
}

export const RedesignedListingPage: React.FC<RedesignedListingPageProps> = ({
  products,
  meta,
  filter,
  categories,
  searchParams,
}) => {
  const slug = [
    filter.city,
    ...(filter.subCategory ? [String(filter.subCategory)] : []),
  ].filter(Boolean) as string[]

  const structuredData = generateStructuredData(
    {product: false, subCategory: filter.subCategory, city: filter.city},
    null,
    slug,
    categories,
  )

  const initialQuery =
    typeof searchParams?.q === 'string' ? searchParams.q : ''

  const brands = Array.isArray(meta?.brands) ? meta.brands : []

  return (
    <>
      <JsonLd data={structuredData} />
      {filter.city && <LocationSync city={filter.city} />}
      <ListingScreen
        products={products}
        filter={filter}
        categories={categories}
        initialQuery={initialQuery}
        brands={brands}
      />
    </>
  )
}
