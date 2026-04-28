import {Metadata} from 'next'
import React from 'react'
import {getProductFilter} from 'util/search.util'
import {fetchProductBySlugServer, fetchProductsServer} from 'api/products.api'
import {generateProductMetadata, generateDefaultMetadata} from 'util/seo.util'
import {IProduct} from '../../app-store/types'
import {IFAQ} from '../../app-store/app-defaults/types'
import {fetchStaticData} from '../utils/api'
import {notFound} from 'next/navigation'
import COUNTRIES from '../../config/constants'
import {client} from '../../sanity/client'
import {type SanityDocument} from 'next-sanity'

// Import the new specialized components
import {ProductDetailPage} from './components/ProductDetailPage'
import {RedesignedListingPage} from './components/RedesignedListingPage'

// FAQ query to fetch FAQs from Sanity
const FAQS_QUERY = `*[
  _type == "faq"
  && defined(question)
]|order(category asc, order asc){
  _id,
  question,
  category,
  answer,
  order
}`

// Editorial overrides for a (city × category) listing page. Optional —
// only authored for high-priority pairs (Pune+Camera, Mumbai+Camera, etc.).
// Long-tail combos use the templated DB-driven hero with no override.
const CITY_CATEGORY_OVERRIDE_QUERY = `*[
  _type == "cityCategoryPage"
  && citySlug == $city
  && subCategorySlug == $sub
  && defined(publishedAt)
][0]{
  _id,
  seoTitle,
  seoDescription,
  customH1,
  customIntro,
  body,
  faqOverrides[]{question, answer}
}`

// Pull the (city, subCategory) slugs out of the URL, regardless of the
// optional country prefix on non-IN routes (/nz/auckland/rent-camera).
function getCityCategorySlugs(
  slug: string[],
  city?: string,
): {citySlug?: string; subCategorySlug?: string} {
  const isCountryPrefixed =
    slug.length > 0 && slug[0].length === 2 && slug[0] !== city
  const segments = isCountryPrefixed ? slug.slice(1) : slug
  return {citySlug: segments[0], subCategorySlug: segments[1]}
}

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
  // searchParams is intentionally NOT accessed on the server. Reading it
  // would force this route into dynamic rendering and defeat SSG. The
  // client-side ListingScreen reads ?q= via useSearchParams() instead.
}

// Generate static params for the full city × subCategory cross-product
// (plus city-only and state-only pages). Product detail pages are excluded
// — too many paths and the per-product data churns more than listings.
export async function generateStaticParams() {
  try {
    const categories = await fetchStaticData(`categories`)
    const staticParams: {slug: string[]}[] = []

    for (const country of COUNTRIES) {
      const countryCode = country.code.toLowerCase()

      for (const city of country.locations) {
        const citySlug = city.toLowerCase().replaceAll(' ', '-')
        const citySlugNormalized =
          citySlug === 'bengaluru' ? 'bangalore' : citySlug

        // City-only page (e.g. /pune, /nz/auckland).
        if (country.code === 'IN') {
          staticParams.push({slug: [citySlugNormalized]})
        } else {
          staticParams.push({slug: [countryCode, citySlugNormalized]})
        }

        // Full (city × subCategory) cross-product.
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

      // State-only pages (e.g. /goa). Cheap, always prerender. Skip the
      // state × subCategory cross-product — those are low-traffic and
      // would balloon the page count further.
      if (country.code === 'IN') {
        for (const state of country.states) {
          const stateSlug = state.toLowerCase().replaceAll(' ', '-')
          staticParams.push({slug: [stateSlug]})
        }
      }
    }

    return staticParams
  } catch (error) {
    console.warn('Failed to generate static params:', error)
    return []
  }
}

// Revalidate static pages every 7 days. Listing inventory and metadata
// don't change often; this is a sensible cache window that keeps pages
// fresh without rebuilding the whole site every day.
export const revalidate = 604800

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const metadata: Metadata = generateDefaultMetadata()

  // Parallelize params and categories fetch. Categories failure must not
  // crash metadata — fall back to default metadata so the page still ships.
  const [localParams, categories] = await Promise.all([
    params,
    fetchStaticData(`categories`).catch(error => {
      console.warn('generateMetadata: categories fetch failed', error)
      return [] as any[]
    }),
  ])

  const filter = getProductFilter(localParams, categories)

  if (filter) {
    if (filter.product) {
      const productSlug = localParams.slug.toString().split(',').at(-1)
      // TODO: Add city and subcategory to the request query.
      const product = productSlug ? await fetchProductBySlugServer(productSlug) : null

      if (product) {
        return generateProductMetadata(product, localParams.slug)
      }
    } else {
      const {getCategoryTitle, getCategoryDescription} = await import(
        'util/category.util'
      )
      const {citySlug, subCategorySlug} = getCityCategorySlugs(
        localParams.slug,
        filter.city,
      )

      // Try the editorial override first; fall back to templated metadata.
      const override = subCategorySlug && citySlug
        ? await client
            .fetch<{seoTitle?: string; seoDescription?: string}>(
              CITY_CATEGORY_OVERRIDE_QUERY,
              {city: citySlug, sub: subCategorySlug},
              {next: {revalidate: 3600}},
            )
            .catch(() => null)
        : null

      const {capitalizeCity} = await import('util/category.util')
      // Region context — falls back to state for state-level pages so
      // ${city} placeholders interpolate cleanly on /goa, /goa/rent-camera.
      const region = filter.city ?? filter.state
      const regionForInterp = region ? capitalizeCity(region) : ''

      metadata.title =
        override?.seoTitle?.replace('${city}', regionForInterp) ||
        getCategoryTitle(categories, filter.subCategory, region, true)
      metadata.description =
        override?.seoDescription?.replace('${city}', regionForInterp) ||
        getCategoryDescription(categories, filter.subCategory, region)
    }

    return {
      ...metadata,
      alternates: {
        canonical: `/${localParams.slug.join('/')}`,
      },
    }
  }

  return metadata
}

export default async function Page({params}: PageProps) {
  // Parallelize initial data fetching. Categories is required to build
  // the filter — if it can't load (build-time DNS failure, backend down)
  // we surface a 404 instead of crashing the whole prerender.
  const [categories, localParams] = await Promise.all([
    fetchStaticData(`categories`).catch(error => {
      console.warn('Page: categories fetch failed', error)
      return null
    }),
    params,
  ])

  if (!categories) {
    return notFound()
  }

  const filter = getProductFilter(localParams, categories)

  // Listing pages require either a city OR a state context. State pages
  // (e.g. /goa, /goa/rent-camera) route through filter.state.
  if (!filter || (!filter.city && !filter.state)) {
    return notFound()
  }

  // Route to appropriate component based on filter type
  if (filter.product) {
    // Product detail page
    const productSlug = localParams.slug.toString().split(',').at(-1)
    const product = productSlug ? await fetchProductBySlugServer(productSlug) : null

    if (!product) {
      return notFound()
    }

    return <ProductDetailPage product={product} slug={localParams.slug} />
  } else {
    const {citySlug, subCategorySlug} = getCityCategorySlugs(
      localParams.slug,
      filter.city,
    )

    // City listing page — fetch products, FAQs, and any editorial override
    // for this (city × category) in parallel. We deliberately fetch the
    // unfiltered (no `q`) list so the server response is identical for
    // every visitor of this URL — that's what lets it statically generate.
    // Client-side filtering by `q` happens in ListingScreen.
    const [response, faqs, override] = await Promise.all([
      (fetchProductsServer(undefined, filter) as Promise<{
        results: IProduct[]
        meta: {total: number; page: number; limit: number}
      }>).catch(error => {
        // Backend timeout / unreachable during SSG or runtime: render an
        // empty list instead of crashing the prerender. ISR will refresh
        // on the next visitor.
        console.warn(
          `Page: products fetch failed for /${localParams.slug.join('/')}`,
          error,
        )
        return {results: [], meta: {total: 0, page: 0, limit: 24}}
      }),
      client.fetch<SanityDocument[]>(
        FAQS_QUERY,
        {},
        {next: {revalidate: 3600}},
      ),
      subCategorySlug && citySlug
        ? client
            .fetch<SanityDocument | null>(
              CITY_CATEGORY_OVERRIDE_QUERY,
              {city: citySlug, sub: subCategorySlug},
              {next: {revalidate: 3600}},
            )
            .catch(() => null)
        : Promise.resolve(null),
    ])

    const transformedFAQs = faqs as unknown as IFAQ[]

    return (
      <RedesignedListingPage
        products={response.results}
        meta={response.meta}
        filter={filter}
        categories={categories}
        faqs={transformedFAQs}
        slug={localParams.slug}
        override={override as any}
      />
    )
  }
}
