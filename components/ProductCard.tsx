import Link from "next/link";
import React from "react";
import { IProduct } from "../app-store/types";
import { ProductPrice } from "./product/ProductPrice";

export default function ProductCard({ product }: { product: IProduct }) {
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

  return (<Link
    className="border justify-end border-gray-100 w-full h-full p-4 bg-white cursor-pointer flex flex-col sm:hover:shadow-md sm:rounded xs:shadow-none"
    href={resolveURL()}
  >
    {product.master_product_id && <img
      alt={product.title}
      className="xs:p-2 sm:p-4"
      src={`/api/products/${product.master_product_id}/photo?width=180`}
    />}
    <div className="pb-4 font-normal whitespace-pre-wrap">
      {product.title}
    </div>
    <ProductPrice dailyRent={dailyRent} discount={product.discount_percent} />

  </Link>);
}
