import {Metadata} from 'next'

export const revalidate = 3600

import {getFeaturedProductsServer} from '../api/products.api'
import {fetchStaticData} from './utils/api'
import {IProduct, IProductCategory, IProductSubCategory} from '../app-store/types'
import {JsonLd} from '../components/seo/JsonLd'
import {faqs} from '../components/home/faq-data'
import MobileChrome from './components/redesign/MobileChrome'
import TopBar from './components/redesign/home/TopBar'
import SearchPill from './components/redesign/home/SearchPill'
import EditorialHero from './components/redesign/home/EditorialHero'
import CategoryRail from './components/redesign/home/CategoryRail'
import SectionHeader from './components/redesign/home/SectionHeader'
import PopularGrid from './components/redesign/home/PopularGrid'
import TrustStrip from './components/redesign/home/TrustStrip'
import BundleCard from './components/redesign/home/BundleCard'
import AllGearGrid from './components/redesign/home/AllGearGrid'

const HIDDEN_SUBCATEGORY_IDS = new Set([59, 60, 62, 48, 32, 50, 30])

export async function generateMetadata(): Promise<Metadata> {
  const title =
    'Rent Cameras, Lenses & Photography Gear | Starting ₹450/day — RentAcross'
  const description =
    'Rent DSLR, mirrorless cameras, lenses, lights & GoPros in Pune. Same-day doorstep delivery, zero deposit hassle, 1500+ happy customers. Sony, Canon & Nikon gear at affordable daily rates.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_IN',
      siteName: 'RentAcross',
      url: 'https://rentacross.com',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: 'https://rentacross.com',
    },
  }
}

function HomeStructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'RentAcross',
    description:
      'Camera and photography equipment rental service in Pune. Rent DSLR, mirrorless cameras, lenses, lights and action cameras at affordable daily rates with doorstep delivery.',
    url: 'https://rentacross.com',
    telephone: '+91-9112005954',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1500',
      bestRating: '5',
    },
    priceRange: '₹450 - ₹3000/day',
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RentAcross',
    url: 'https://rentacross.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://rentacross.com/pune/rent-camera?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <JsonLd data={[organizationSchema, websiteSchema, faqSchema as object]} />
  )
}

export default async function Home() {
  const [groups, categoryData] = await Promise.all([
    getFeaturedProductsServer(8, 'pune').catch(error => {
      console.warn('Home: featured products fetch failed', error)
      return [] as any[]
    }),
    (fetchStaticData('categories') as Promise<IProductCategory[] | undefined>).catch(
      error => {
        console.warn('Home: categories fetch failed', error)
        return undefined
      },
    ),
  ])

  const allProducts: IProduct[] = (groups ?? []).flatMap(
    (g: any) => g?.products ?? [],
  )
  const popular = allProducts.slice(0, 4)
  const allGear = allProducts.slice(4)

  const subCategories: IProductSubCategory[] = (
    categoryData?.[0]?.subCategories ?? []
  ).filter(sc => sc.id && !HIDDEN_SUBCATEGORY_IDS.has(sc.id))

  return (
    <>
      <HomeStructuredData />
      <MobileChrome>
        <TopBar />
        <SearchPill />
        <EditorialHero />
        <CategoryRail subCategories={subCategories} />

        <SectionHeader
          title="Popular this week"
          subtitle="Booked most often by creators in Pune"
          action="See all"
          actionHref="/pune/rent-camera?q="
        />
        <PopularGrid products={popular} />

        <TrustStrip />

        <SectionHeader
          title="Shoot a wedding this weekend?"
          subtitle="Pre-built kits, one tap rent"
        />
        <BundleCard />

        {allGear.length > 0 && (
          <>
            <SectionHeader title="All gear" />
            <AllGearGrid products={allGear} />
          </>
        )}
      </MobileChrome>
    </>
  )
}
