import Link from "next/link";
import Image from "next/image";
import PriceTag from "./PriceTag";
import React from "react";

export default function ProductCard({ product, priority = false }) {
  return (
    <Link
      className="r-comp w-1/2 sm:w-72 xs:px-2 sm:px-0 max-h-96"
      href={
        "/rent/" +
        product.location.city.toLowerCase() +
        "/" +
        product.subCategory.slug +
        "/" +
        product.slug
      }
    >
      <div
        className="w-full flex justify-between flex-col h-full shadow-lg p-4 hover:shadow-xl cursor-pointer bg-white rounded"
        key={product.id}
      >
        <div>

          {product.photos[0] && (
            <div className="flex justify-center">
              <Image
                alt={product.title}
                className={"p-2 sm:p-5"}
                width={200}
                height={-1}
                src={"https://www.rentacross.com" + product.photos[0].path + "?"}
              />
            </div>
          )}
        </div>


        <div>
          <div style={{ whiteSpace: "pre-wrap" }} className=" font-semibold ">
            {product.title}
          </div>
          <div className="text-lg font-bold text-red-700">
            <PriceTag price={product.rates[0].rate} />
          </div>

          <div className="text-xs">
            {product.location.city}
          </div>

          <div className="text-center">
            <button className={"p-1 btn"} >
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
