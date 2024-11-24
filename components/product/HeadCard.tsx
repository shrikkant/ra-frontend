"use client"
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
          {product?.master_product_id &&
            <div className="flex justify-center">
              <img src={`/api/products/${product.master_product_id}/photo?width=540`}></img>
            </div>
          }
        </div>

      </div>
      <h1 className="text-xl font-bold py-2 capitalize">{product.title}</h1>
    </div>
  );
};
