import React, { useEffect } from "react";
import { IProduct } from "../../app-store/types";
import { ProductPrice } from "../product/ProductPrice";
import Link from "next/link";


export default function HomeProductCard({ product }: { product: IProduct }) {
  const dailyRent = product?.rates ? product.rates[0].rate : 0;
  const resolveURL = () => {
    const city = product?.location?.city?.toLowerCase();
    const citySlug = "bengaluru" === city ? "bangalore" : city;

    return (
      "/rent/" +
      citySlug +
      "/" +
      product?.subCategory?.slug +
      "/" +
      product.slug
    );
  }

  if (!product)
    return (<div>Product not found</div>)

  return (
    <Link
      href={resolveURL()}
    >

      <div className="shadow-md relative">

        {product.featured ? <div className="top-sale capitalize text-red-600 p-4 absolute">top sale</div> : <></>}

        <div className="product-img">
          {product.master_product_id &&
            <img
              alt={product.title}
              className="xs:p-2 sm:p-4"
              src={`/api/products/${product.master_product_id}/photo?width=180`}></img>
          }
        </div>
        <div className="px-4">
          <div className="pb-4 font-normal whitespace-pre-wrap">
            {product.title}
          </div>
          <ProductPrice dailyRent={dailyRent} discount={product.discount_percent} />
        </div>
      </div>
    </Link>)
}
