import React from 'react'

export interface Photo {
  path: string
}
export interface MasterProduct {
  id: number
  photos: Photo[]
  name: string
}

export interface Addon {
  masterProduct: MasterProduct
}
export interface ProductProps {
  addons: Addon[]
}

export const Package: React.FC<ProductProps> = ({addons}: ProductProps) => {
  return (
    <>
      <h2 className="text-xl py-4 capitalize">Includes</h2>
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {addons &&
          addons.map(addon => {
            return (
              <div
                key={addon?.masterProduct?.id}
                className="border-2 border-gray-200 rounded-sm"
              >
                <div className="relative w-full pt-[100%]">
                  <img
                    width={220}
                    height={220}
                    style={{padding: 20}}
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    alt={addon?.masterProduct.name}
                    src={`/api/products/${addon?.masterProduct?.id}/photo?width=220`}
                    loading="lazy"
                  />
                </div>
                <div className="text-center p-4">
                  {addon?.masterProduct.name}
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}
