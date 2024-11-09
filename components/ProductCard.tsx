import Link from "next/link";
import Image from "next/image";
import PriceTag from "./PriceTag";
import React from "react";
import { IProduct } from "../app-store/types";

export default function ProductCard({ product }: { product: IProduct }) {
  const photo = product.masterPhotos ? product.masterPhotos[0] : null;

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

          {photo?.image_data && (
            <div className="flex justify-center">
              <Image alt={product.title} className={"p-2 sm:p-5"} layout="responsive"
                loading="lazy"
                decoding="async"

                width={300} height={300}
                src={`data:image/png;base64,${photo.image_data}`} />
            </div>
          )}
        </div>


        <div>
          <div className="font-semibold pb-2 text-red-600">
            {product.rates && <PriceTag price={product?.rates[0].rate} />}
          </div>
          <div style={{ whiteSpace: "pre-wrap" }} className=" font-semibold ">
            {product.title}
          </div>
          <div className="text-gray-500 text-xs">{product.location?.city}</div>

          <div className="text-center py-4">
            <button className={"p-1 btn"} >
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
