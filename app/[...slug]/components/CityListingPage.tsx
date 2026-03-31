import React from 'react'
import CityHeroBanner from 'components/CityHeroBanner'
import {getCategoryDescription, getCategoryTitle} from 'util/category.util'
import {getCityImage, getCityImageMobile} from 'util/city.util'
import {generateStructuredData} from 'util/seo.util'
import {ReviewsSection} from 'components/ReviewsSection'
import HowItWorks from 'components/HowItWorks'
import FAQSection from 'components/faq/FAQSection'
import HomeProductCard from 'components/home/HomeProductCard'
import HorizontalScroller from 'components/common/HorizontalScroller'
import ScrollerItem from 'components/common/ScrollerItem'
import {JsonLd} from 'components/seo/JsonLd'
import {IProduct, IProductFilter} from '../../../app-store/types'
import {IFAQ} from '../../../app-store/app-defaults/types'
import {LocationSync} from 'components/LocationSync'

interface CityListingPageProps {
  products: IProduct[]
  meta: any
  filter: IProductFilter
  categories: any[]
  searchParams: any
  faqs?: IFAQ[]
}

export const CityListingPage: React.FC<CityListingPageProps> = ({
  products,
  filter,
  categories,
  searchParams,
  faqs = [],
}) => {
  const shouldShowHeroBanner =
    filter?.city && Object.keys(searchParams).length === 0

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

  return (
    <>
      <JsonLd data={structuredData} />

      <main className="min-h-screen">
        {filter.city && <LocationSync city={filter.city} />}

        {shouldShowHeroBanner && filter.city && (
          <CityHeroBanner
            city={filter.city}
            title={getCategoryTitle(categories, filter.subCategory, filter.city, false)}
            cityImage={getCityImage(filter.city)}
            cityImageMobile={getCityImageMobile(filter.city)}
            description={
              filter.subCategory
                ? getCategoryDescription(categories, filter.subCategory, filter.city)
                : 'Professional Camera Rental — DSLR & Mirrorless Cameras'
            }
          />
        )}

        {/* Products */}
        <div className="max-w-7xl mx-auto">
          <section aria-label="Available products" className="py-6 sm:py-10">
            {products && products.length > 0 ? (
              <>
                <div className="px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {products.length} items available
                  </h2>
                </div>
                <HorizontalScroller desktopCols="md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product: IProduct) => (
                    <ScrollerItem key={product.id} mobileWidth="w-[42vw]" snap="start">
                      <HomeProductCard product={product} />
                    </ScrollerItem>
                  ))}
                </HorizontalScroller>
              </>
            ) : (
              <div className="text-center py-16 px-4">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}
          </section>

          {/* How it works */}
          <div className="px-4 sm:px-6 lg:px-8">
            <HowItWorks />
          </div>

          {/* Reviews */}
          <ReviewsSection
            variant="compact"
            title="Customer Reviews"
            maxReviews={3}
          />

          {/* FAQs from Sanity */}
          {faqs.length > 0 && (
            <FAQSection
              faqs={faqs}
              title="Frequently Asked Questions"
              subtitle="Common questions about renting camera equipment"
            />
          )}
        </div>
      </main>
    </>
  )
}
