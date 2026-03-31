import React from 'react'
import {Product} from 'components/product/Product'
import {IProduct} from '../../../app-store/types'
import {generateStructuredData} from 'util/seo.util'
import {JsonLd} from 'components/seo/JsonLd'

interface ProductDetailPageProps {
  product: IProduct
  slug: string[]
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  slug,
}) => {
  const structuredData = generateStructuredData(
    {product: true},
    product,
    slug,
    [],
  )

  return (
    <>
      <JsonLd data={structuredData} />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto md:min-h-[calc(100vh-100px-418px)]">
          <Product product={product} />
        </div>
      </main>
    </>
  )
}
