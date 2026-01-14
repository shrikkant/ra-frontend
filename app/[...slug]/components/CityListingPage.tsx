import React from 'react'
import ProductCard from 'components/ProductCard'
import CityHeroBanner from 'components/CityHeroBanner'
import {getCategoryDescription, getCategoryTitle} from 'util/category.util'
import {getCityImage, getCityImageMobile} from 'util/city.util'
import {ReviewsSection} from 'components/ReviewsSection'
import HowItWorks from 'components/HowItWorks'
import FAQSection from 'components/faq/FAQSection'
import {IProduct, IProductFilter} from '../../../app-store/types'
import {IFAQ} from '../../../app-store/app-defaults/types'
import {LocationSync} from 'components/LocationSync'

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

interface CityListingPageProps {
  products: IProduct[]
  meta: any
  filter: IProductFilter
  categories: any[]
  searchParams: any
  loading?: boolean
  faqs?: IFAQ[]
}

export const CityListingPage: React.FC<CityListingPageProps> = ({
  products,
  filter,
  categories,
  searchParams,
  loading = false,
  faqs = [],
}) => {
  // Determine if hero banner should be shown (only when no search params)
  const shouldShowHeroBanner =
    filter?.city && Object.keys(searchParams).length === 0

  return (
    <div className="min-h-screen">
        {/* Sync location from URL to Redux store */}
        {filter.city && <LocationSync city={filter.city} />}
      
      {/* Hero Banner Section */}
      {shouldShowHeroBanner && filter.city && (
        <CityHeroBanner
          city={filter.city}
          title={getCategoryTitle(
            categories,
            filter.subCategory,
            filter.city,
            false,
          )}
          cityImage={getCityImage(filter.city)}
          cityImageMobile={getCityImageMobile(filter.city)}
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

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto md:min-h-[calc(100vh-100px-418px)] sm:p-4 p-2">
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 xs:gap-1 pb-4">
          {loading ? (
            // Show skeleton loading state when loading
            Array.from({length: 8}).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : products && products.length > 0 ? (
            // Show products when loaded and have results
            products.map((product: IProduct, index: number) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))
          ) : (
            // Show empty state when loaded but no results
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No products found for your search criteria
              </div>
              <div className="text-gray-400 text-sm">
                Try adjusting your filters or search terms
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          title="Customer Reviews"
          subtitle="See what others are saying about our equipment"
          variant="compact"
          maxReviews={3}
          showCTA={false}
          className="mt-8"
        />

        {/* How It Works Section */}
        <div className="mt-16">
          <HowItWorks />
        </div>

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <FAQSection
            faqs={faqs}
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about renting camera equipment"
            className="mt-16"
          />
        )}
      </div>
    </div>
  )
}
