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
  const priceAfterDiscount = originalPrice - (price * discount / 100);

  const textSize = "text=" + size;

  return (<div className="flex items-end gap-x-2">
    {discount > 0 && <div className={"r-comp " + textSize}>
      {getPrice(priceAfterDiscount)}
      {sub && <sub className="text-sm font-light">{sub}</sub>}
    </div>}
    <div className={"r-comp " + textSize + " " + (discount > 0 ? " line-through text-sm" : "")}>
      {getPrice(price)}
      {sub && <sub className="text-sm font-light">{sub}</sub>}
    </div>
  </div>);
}

function getPrice(price) {

  return price.toLocaleString(APP_LOCALE, {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
