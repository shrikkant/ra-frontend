import {IProduct, IProductRatePlan} from '../app-store/types'
import React from 'react'
import Image from 'next/image'

const ProductRow = React.memo(function ProductRow({product}: {product: IProduct}) {
  return (
    <div key={product.id} className="shadow-lg">
      <div className="px-4 border-gray-100 border-b py-3">
        <h3 className="text-xl font-light">{product.title}</h3>
      </div>
      <div className="flex p-3 gap-x-3">
        <div className="w-1/4">
          <div className="p-5">
            {product?.photos && <Image src={product?.photos[0]?.path} alt={product.title || 'Product'} width={200} height={150} loading="lazy" />}
          </div>
        </div>
        <div className="w-3/4">
          <div className="flex">
            <div className="flex xs:flex-col">
              {product.rates &&
                product.rates.map((rate: IProductRatePlan, index) => (
                  <div key={index} className="flex gap-x-5 justify-between">
                    <div className="font-semibold">{rate.durationDisplay}</div>
                    <div>&#8377;{rate.rate}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductRow
