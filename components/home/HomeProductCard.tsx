import React from "react";
import Image from "next/image";
import { IProduct } from "../../app-store/types";

export default function HomeProductCard({ product }: { product: IProduct }) {


  const getLink = (p: any) => {
    const subCatSlug = p.subCategory.slug;
    return "/rent/" + p.location.city.toLowerCase() + "/"
      + subCatSlug + "/"
      + product.slug.toLowerCase();

  }

  if (!product)
    return (<div>Product not found</div>)

  return (<div key={product.id}>
    <div className="product-item">

      {product.featured ? <span className="top-sale">top sale</span> : <></>}

      <a href={getLink(product)} className="product-img">

        {(product.photos && product.photos[0]) &&
          <Image alt={product.title} className={"p-2 sm:p-5"} width={200} height={-1}
            src={"https://www.rentacross.com" + product.photos[0].path} />}

      </a>
      <div className="p-[15px]">
        <div className="price-cover">

        </div>
        <h6 className="prod-title">
          <a href={getLink(product)}>{product.title}</a>
        </h6>
        <div className="text-center">
          <a className={"p-1 btn"} href={getLink(product)}>
            <span>Book Now</span>
          </a>
        </div>

      </div>
    </div>
  </div>)
}
