import React from 'react'
import {IProduct} from '../../../app-store/types'
import {generateStructuredData} from 'util/seo.util'
import {JsonLd} from 'components/seo/JsonLd'
import ProductDetailScreen from '../../components/redesign/product/ProductDetailScreen'

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
      <ProductDetailScreen product={product} />
    </>
  )
}
