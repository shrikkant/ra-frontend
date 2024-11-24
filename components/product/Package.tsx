import React from 'react'

export interface Photo {
  path: string
}
export interface MasterProduct {
  id: number,
  photos: Photo[],
  name: string
}

export interface Addon {
  masterProduct: MasterProduct
}
export interface ProductProps {
  addons: Addon[] | null
}

export const Package: React.FC<ProductProps> = ({ addons }: ProductProps) => {

  return (

    <>
      <h2 className="text-xl py-4 capitalize">Includes</h2>
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
        {addons &&
          addons.map((addon) => {
            return (
              <div key={addon?.masterProduct?.id} className="border-2 border-gray-200 rounded-sm">
                <img
                  style={{ padding: 20, }}
                  className='w-full h-40 object-cover'
                  alt={addon?.masterProduct.name}
                  src={`/api/products/${addon?.masterProduct?.id}/photo?width=220`}
                />

                <div className="text-center p-4"> {addon?.masterProduct.name}</div>
              </div>
            );
          })}
      </div>
    </>


  );
};
