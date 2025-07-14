import React from 'react'
import ProductCard from 'components/ProductCard'
import CityHeroBanner from 'components/CityHeroBanner'
import {getCategoryDescription, getCategoryTitle} from 'util/category.util'
import {getCityImage} from 'util/city.util'
import {ReviewsSection} from 'components/ReviewsSection'
import {IProduct, IProductFilter} from '../../../app-store/types'

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
}

export const CityListingPage: React.FC<CityListingPageProps> = ({
  products,
  meta,
  filter,
  categories,
  searchParams,
}) => {
  // Determine if hero banner should be shown (only when no search params)
  const shouldShowHeroBanner =
    filter?.city && Object.keys(searchParams).length === 0

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
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
        // Show a smaller header when search params are present
        <div className="bg-gray-50 py-8 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {filter.subCategory && filter.city
                ? getCategoryTitle(
                    categories,
                    filter.subCategory,
                    filter.city,
                    false,
                  )
                : 'Search Results'}
            </h1>
            {products.length > 0 && (
              <p className="text-gray-600 mt-2">
                {products.length} product{products.length !== 1 ? 's' : ''}{' '}
                found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Products Grid Section */}
      <div className="container m-auto md:min-h-[calc(100vh-100px-418px)]">
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 gap-2 xs:gap-1 pb-4">
          {products && products.length > 0
            ? products.map((product: IProduct) => (
                <ProductCard key={product.id} product={product} />
              ))
            : // Show skeleton loading state when no products
              Array.from({length: 8}).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
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
      </div>
    </div>
  )
}
