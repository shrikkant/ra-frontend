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

  return (
    <Link
      href={resolveURL()}
    >
      <div
        className="w-full flex justify-between flex-col h-full shadow-lg p-4 hover:shadow-xl cursor-pointer bg-white rounded"
        key={product.id}
      >
        <div>
          {product.master_product_id &&
            <img
              alt={product.title}
              className="xs:p-2 sm:p-4"
              src={`/api/products/${product.master_product_id}/photo?width=180`}></img>
          }
        </div>


        <div>

          <div style={{ whiteSpace: "pre-wrap" }} className=" font-normal pb-4">
            {product.title}
          </div>
          <ProductPrice dailyRent={dailyRent} discount={product.discount_percent} />
          {/* <div className="text-center py-4 w-full">
            <button className={"p-1 btn w-full"} >
              <span>Book Now</span>
            </button>
          </div> */}
        </div>
      </div>
    </Link>
  );
}
