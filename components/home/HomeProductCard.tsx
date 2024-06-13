import { IProduct } from "../../app-store/types";
import Image from "next/image";
import PriceTag from "../PriceTag";

export default function HomeProductCard({product}: {product: IProduct}) {

  if (!product)
    return (<div>Product not found</div>)

  return (<div key={product.id} className="col-sm-6 col-lg-3">
    <div className="product-item">
      <span className="top-sale">top sale</span>
      {/* <ul className="product-icon-top">
        <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
        <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
      </ul> */}
      <a href="single-shop.html" className="product-img">

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
