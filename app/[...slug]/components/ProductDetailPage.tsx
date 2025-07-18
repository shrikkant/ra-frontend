import React from 'react'
import {Product} from 'components/product/Product'
import {IProduct} from '../../../app-store/types'

interface ProductDetailPageProps {
  product: IProduct
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
}) => {
  return (
    <div className="min-h-screen">
      <div className="container m-auto md:min-h-[calc(100vh-100px-418px)]">
        <Product product={product} />
      </div>
    </div>
  )
}
