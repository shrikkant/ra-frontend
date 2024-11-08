import Link from "next/link";
import Image from "next/image";
import PriceTag from "./PriceTag";
import React from "react";
import { IProduct } from "../app-store/types";

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link
      href={
        "/rent/" +
        product?.location?.city?.toLowerCase() +
        "/" +
        product?.subCategory?.slug +
        "/" +
        product.slug
      }
    >
      <div
        className="w-full flex justify-between flex-col h-full shadow-lg p-4 hover:shadow-xl cursor-pointer bg-white rounded"
        key={product.id}
      >
        <div>

          {(product.photos && product.photos[0]) && (
            <div className="flex justify-center">
              <Image
                loading="lazy"
                decoding="async"
                alt={product.title}
                width={200}
                height={0}
                layout="responsive"
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
            {product.rates && <PriceTag price={product?.rates[0].rate} />}
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
