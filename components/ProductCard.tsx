import Link from "next/link";
import React from "react";
import { IProduct } from "../app-store/types";
import { ProductPrice } from "./product/ProductPrice";
import LazyImage from "./../components/product/LazyImage";
// import { getBlurDataURL } from "./../util/image.blur";

export default function ProductCard({ product }: { product: IProduct }) {
  const dailyRent = product?.rates ? product.rates[0].rate : 0;


  const resolveURL = () => {
    const city = product?.location?.city?.toLowerCase();
    const citySlug = "bengaluru" === city ? "bangalore" : city;

    return (
      "/" +
      citySlug +
      "/" +
      product?.subCategory?.slug +
      "/" +
      product.slug
    );
  }

  return (<div className="border justify-end border-gray-100 w-full h-full p-4 bg-white  flex flex-col sm:rounded xs:shadow-none">


    {<Link
      href={resolveURL()}
    >
      <LazyImage
        src={'https://www.rentacross.com/api/products/' + product.master_product_id + '/photo?width=240'}
        alt="Product Image"
        className="p-4"
        // blurDataURL={'https://www.rentacross.com/api/products/' + product.master_product_id + '/photo'}
        width={800}
        height={600}
      /> </Link>}
    <Link
      className="cursor-pointer pb-4"
      href={resolveURL()}
    >
      {product.title}
    </Link>

    <ProductPrice dailyRent={dailyRent} discount={product.discount_percent} />

    <button className="bg-[#ffd814] w-36 rounded-full text-[#0f1111] hover:bg-[#f7ca00] h-10">
      Rent Now
    </button>

  </div >);
}
