import React from "react";
import Image from "next/image";

export default function HomeProductCard({ product }: { product: any }) {

  if (!product)
    return (<div>Product not found</div>)

  return (<div key={product.id} className="lg:w-1/5 md:w-5/12 w-[48%]">
    <div className="product-item">
      <span className="top-sale">top sale</span>

      <a href="single-shop.html" className="product-img">

        {product.photos[0] && <Image alt={product.title} className={"p-2 sm:p-5"} width={200} height={-1}
          src={"https://www.rentacross.com" + product.photos[0].path}></Image>}

      </a>
      <div className="product-item-cover">
        <div className="price-cover">

        </div>
        <h6 className="prod-title">
          <a href="single-shop.html">{product.title}</a>
        </h6>
        <a href="single-shop.html" className="btn"><span>Book Now</span></a>
      </div>
    </div>
  </div>)
}
