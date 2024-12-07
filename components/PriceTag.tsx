import React from "react";
import { APP_LOCALE, DEFAULT_CURRENCY } from "../config/constants";

export default function PriceTag({
  price,
  size = "md",
  sub = null,
  discount = 0,
}: {
  price: number;
  size?: "sm" | "md" | "lg";
  sub?: string | null;
  showCurrency?: boolean;
  discount?: number;
}) {
  const originalPrice = price;
  const priceAfterDiscount = Math.ceil(originalPrice - (price * discount / 100));

  const textSize = "text=" + size;

  return (<div className="flex items-end gap-x-2">
    {discount > 0 && <div className={"r-comp font-bold text-gray-900" + textSize}>
      {getPrice(priceAfterDiscount)}
      {sub && <sub className="text-sm font-semibold">{sub}</sub>}
    </div>}

    <div className={"r-comp font-light text-gray-600 " + textSize + " " + (discount > 0 ? " line-through" : "")}>
      {getPrice(price)}
      {sub && <span className="text-sm font-light">{sub}</span>}
    </div>
    <div>
      {discount > 0 && <span className="text-sm text-green-600">{discount}% off</span>}
    </div>
  </div>);
}

function getPrice(price) {

  return price.toLocaleString(APP_LOCALE, {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
