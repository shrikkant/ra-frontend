import Link from 'next/link'
import React from 'react'
import {IProduct} from '../app-store/types'
import {ProductPrice} from './product/ProductPrice'
import LazyImage from './../components/product/LazyImage'
import RentNowButton from '../app/components/product/RentNowButton.client'
// import { getBlurDataURL } from "./../util/image.blur";

export default function ProductCard({product}: {product: IProduct}) {
  const dailyRent = product?.rates ? product.rates[0].rate : 0

  const resolveURL = () => {
    const city = product?.location?.city?.toLowerCase()
    const citySlug = 'bengaluru' === city ? 'bangalore' : city

    return (
      '/' + citySlug + '/' + product?.subCategory?.slug + '/' + product.slug
    )
  }

  return (
    <div className="border border-gray-100 w-full h-full bg-white flex flex-col sm:rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="flex-grow p-4">
        <Link href={resolveURL()}>
          <LazyImage
            src={
              'https://rentacross.com/api/products/' +
              product.master_product_id +
              '/photo?width=240'
            }
            alt="Product Image"
            className="hover:opacity-90 transition-opacity duration-300 max-h-[240px] object-contain"
            width={800}
            height={600}
          />
        </Link>
      </div>

      <div className="mt-auto bg-gradient-to-t from-gray-200 via-gray-100 to-transparent px-4 pb-4 sm:rounded-b-lg">
        <Link
          className="cursor-pointer block py-4 text-gray-800 hover:text-gray-600 transition-colors duration-300"
          href={resolveURL()}
        >
          {product.title}
        </Link>

        <ProductPrice
          dailyRent={dailyRent}
          discount={product.discount_percent}
        />

        <RentNowButton pathname={resolveURL()} />
      </div>
    </div>
  )
}
