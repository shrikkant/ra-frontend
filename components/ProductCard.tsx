import Link from 'next/link'
import React from 'react'
import {IProduct} from '../app-store/types'
import {ProductPrice} from './product/ProductPrice'
import LazyImage from './../components/product/LazyImage'
import RentNowButton from '../app/components/product/RentNowButton.client'
import {getCitySlug} from '../util/city.util'

interface ProductCardProps {
  product: IProduct
}

interface ProductImageProps {
  product: IProduct
  url: string
  className?: string
}

interface ProductDetailsProps {
  product: IProduct
  dailyRent: number
  url: string
}

// Single Responsibility: Handle product image display
const ProductImage: React.FC<ProductImageProps> = ({
  product,
  url,
  className = '',
}) => {
  if (!product.master_product_id) return null

  return (
    <Link href={url}>
      <div className={`relative overflow-hidden ${className}`}>
        <LazyImage
          src={`https://rentacross.com/api/products/${product.master_product_id}/photo?width=240`}
          alt="Product Image"
          className="hover:opacity-90 transition-opacity duration-300 w-full h-full object-contain"
          width={800}
          height={600}
        />
      </div>
    </Link>
  )
}

// Single Responsibility: Handle product details display
const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  dailyRent,
  url,
}) => {
  return (
    <>
      <Link
        className="cursor-pointer text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-300 line-clamp-2"
        href={url}
      >
        {product.title}
      </Link>

      <div className="mt-2">
        <ProductPrice
          dailyRent={dailyRent}
          discount={product.discount_percent}
        />
      </div>

      <div className="mt-2">
        <RentNowButton pathname={url} />
      </div>
    </>
  )
}

// Single Responsibility: Mobile layout component
const MobileProductCard: React.FC<ProductCardProps> = ({product}) => {
  const dailyRent = product?.rates ? product.rates[0].rate : 0
  const url = `/${getCitySlug(product?.location?.city)}/${product?.subCategory?.slug}/${product.slug}`

  return (
    <div className="flex sm:hidden p-2 gap-2">
      {/* Image section - 40% width */}
      <div className="w-2/5 flex-shrink-0">
        <ProductImage
          product={product}
          url={url}
          className="w-full h-[120px] p-2"
        />
      </div>

      {/* Details section - 60% width */}
      <div className="w-3/5 flex flex-col justify-between">
        <ProductDetails product={product} dailyRent={dailyRent} url={url} />
      </div>
    </div>
  )
}

// Single Responsibility: Desktop layout component
const DesktopProductCard: React.FC<ProductCardProps> = ({product}) => {
  const dailyRent = product?.rates ? product.rates[0].rate : 0
  const url = `/${getCitySlug(product?.location?.city)}/${product?.subCategory?.slug}/${product.slug}`

  return (
    <>
      <div className="hidden sm:flex flex-grow p-4">
        <ProductImage
          product={product}
          url={url}
          className="w-full h-[240px]"
        />
      </div>

      <div className="hidden sm:block mt-auto bg-gradient-to-t from-gray-200 via-gray-100 to-transparent px-4 pb-4 sm:rounded-b-lg">
        <Link
          className="cursor-pointer block py-4 text-gray-800 hover:text-gray-600 transition-colors duration-300"
          href={url}
        >
          {product.title}
        </Link>

        <ProductPrice
          dailyRent={dailyRent}
          discount={product.discount_percent}
        />

        <RentNowButton pathname={url} />
      </div>
    </>
  )
}

// Main component with single responsibility: orchestrate layout
export default function ProductCard({product}: ProductCardProps) {
  return (
    <div className="border border-gray-100 w-full h-full bg-white flex flex-col sm:rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <MobileProductCard product={product} />
      <DesktopProductCard product={product} />
    </div>
  )
}
