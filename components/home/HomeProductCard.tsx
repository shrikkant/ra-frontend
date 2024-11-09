import React from "react";
import Image from "next/image";
import { IProduct } from "../../app-store/types";
import PriceTag from "../PriceTag";

export default function HomeProductCard({ product }: { product: IProduct }) {
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

  if (!product)
    return (<div>Product not found</div>)

  return (<div key={product.id}>
    <div className="shadow-md">

      {product.featured ? <div className="top-sale capitalize text-red-600 p-4">top sale</div> : <></>}

      <a href={resolveURL()} className="product-img">

        {photo?.image_data &&
          <Image alt={product.title} className={"p-2 sm:p-5"} layout="responsive"
            width={300} height={300}
            src={`data:image/png;base64,${photo.image_data}`} />}



      </a>
      <div className="px-4">
        <div className="price-cover pb-2">
          {product.rates && <PriceTag price={product?.rates[0].rate} />}
        </div>
        <h6 className="prod-title">
          <a href={getLink(product)}>{product.title}</a>
        </h6>
        <div>
          <p className="text-gray-500 text-xs">{product.location?.city}</p>
        </div>
        <div className="text-center py-4">
          <a className={"btn"} href={getLink(product)}>
            <span>Book Now</span>
          </a>
        </div>

      </div>
    </div>
  </div>)
}
