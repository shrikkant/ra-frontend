import React from 'react'
import {generateStructuredData} from 'util/seo.util'
import {JsonLd} from 'components/seo/JsonLd'
import {LocationSync} from 'components/LocationSync'
import {IProduct, IProductFilter} from '../../../app-store/types'
import {IFAQ} from '../../../app-store/app-defaults/types'
import ListingScreen from '../../components/redesign/listing/ListingScreen'

// Editorial override pulled from Sanity by the page server component for
// (city × category) combos that have a hand-authored cityCategoryPage doc.
export interface ICityCategoryOverride {
  _id?: string
  customH1?: string
  customIntro?: string
  body?: any[]
  seoTitle?: string
  seoDescription?: string
  faqOverrides?: Array<{question: string; answer: any[]}>
}

interface RedesignedListingPageProps {
  products: IProduct[]
  meta: any
  filter: IProductFilter
  categories: any[]
  faqs?: IFAQ[]
  slug?: string[]
  override?: ICityCategoryOverride | null
}

// Lifts the optional Sanity faqOverrides into the IFAQ shape and prepends
// them so they render above the global FAQ list. Category 'About this page'
// makes them sort first alphabetically in FAQSection.
function mergeFaqs(
  overrides: ICityCategoryOverride['faqOverrides'],
  base: IFAQ[],
): IFAQ[] {
  if (!overrides || overrides.length === 0) return base
  const lifted: IFAQ[] = overrides
    .filter(o => o?.question && o?.answer)
    .map((o, i) => ({
      _id: `override-${i}`,
      question: o.question,
      category: 'About this page',
      answer: o.answer,
      order: i,
    }))
  return [...lifted, ...base]
}

export const RedesignedListingPage: React.FC<RedesignedListingPageProps> = ({
  products,
  meta,
  filter,
  categories,
  faqs = [],
  slug,
  override,
}) => {
  // Prefer the URL slug forwarded from the server page. Fall back to
  // reconstructing from filter only if it wasn't passed (legacy callers).
  const resolvedSlug =
    slug && slug.length > 0
      ? slug
      : ([filter.city].filter(Boolean) as string[])

  // priceFrom enriches the LocalBusiness schema's priceRange. Cheap to
  // compute here from the products we already have.
  const priceFrom = (() => {
    const rates = products
      .map(p => p.rate ?? p.rates?.[0]?.rate ?? 0)
      .filter(r => typeof r === 'number' && r > 0) as number[]
    return rates.length ? Math.min(...rates) : undefined
  })()

  const mergedFaqs = mergeFaqs(override?.faqOverrides, faqs)

  const structuredData = generateStructuredData(
    {product: false, subCategory: filter.subCategory, city: filter.city},
    null,
    resolvedSlug,
    categories,
    {products, faqs: mergedFaqs, priceFrom},
  )

  const brands = Array.isArray(meta?.brands) ? meta.brands : []
  const totalCount =
    typeof meta?.total === 'number' ? meta.total : products.length

  return (
    <>
      <JsonLd data={structuredData} />
      {filter.city && <LocationSync city={filter.city} />}
      <ListingScreen
        products={products}
        filter={filter}
        categories={categories}
        brands={brands}
        faqs={mergedFaqs}
        slug={resolvedSlug}
        totalCount={totalCount}
        customH1={override?.customH1}
        customIntro={override?.customIntro}
        authoredBody={override?.body}
      />
    </>
  )
}
