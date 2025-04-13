import { IProduct } from "../../app-store/types";
import React from "react";
interface ProductProps {
  product: IProduct;
}

export const HeadCard: React.FC<ProductProps> = ({ product }: ProductProps) => {

  return (
    <div>

      <div className="w-full flex flex-col justify-center items-center pb-4">
        <div>
          {product?.master_product_id && (
            <div className="flex justify-center">
              <div className="aspect-w-16 aspect-h-9 w-full max-w-[420px]">
                <img
                  src={`/api/products/${product.master_product_id}/photo?width=420`}
                  alt={product.title}
                  className="object-cover w-full h-full"
                  width={420}
                  height={236}
                  loading="eager"
                />
              </div>
            </div>
          )}
        </div>

      </div>
      <h1 className="text-xl font-bold py-2 capitalize">{product.title}</h1>
      <h6 className="text-gray-500 font-normal text-sm">{product.location.city}</h6>
    </div>
  );
};
