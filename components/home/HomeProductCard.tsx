import React, { useEffect } from "react";
import { IProduct } from "../../app-store/types";
import { ProductPrice } from "../product/ProductPrice";


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

  return (<div key={product.id}>
    <div className="shadow-md relative">

      {product.featured ? <div className="top-sale capitalize text-red-600 p-4 absolute">top sale</div> : <></>}

      <a href={resolveURL()} className="product-img">
        {product.master_product_id &&
          <img
            alt={product.title}
            className="p-10"
            src={`/api/products/${product.master_product_id}/photo?width=180`}></img>
        }
      </a>
      <div className="px-4">
        <ProductPrice dailyRent={dailyRent} discount={product.discount_percent} />
        <h6 className="prod-title">
          <a href={resolveURL()}>{product.title}</a>
        </h6>
        <div>
          <p className="text-gray-500 text-xs">{product.location?.city}</p>
        </div>
        <div className="text-center py-4">
          <a className={"btn"} href={resolveURL()}>
            <span>Book Now</span>
          </a>
        </div>

      </div>
    </div>
  </div>)
}
