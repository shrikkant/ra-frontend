import React from "react";
import { APP_LOCALE, DEFAULT_CURRENCY } from "../config/constants";

export default function PriceTag({
  price,
  size = "md",
  sub = null,
  showCurrency = true,
}) {
  const textSize = "text=" + size;
  return (
    <div className={"r-comp " + textSize}>
      {showCurrency ? getCurrencyWithSymbol(price) : price}
      {sub && <sub className="text-sm font-light">{sub}</sub>}
    </div>
  );
}

function getCurrencyWithSymbol(price) {
  return price.toLocaleString(APP_LOCALE, {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getCurrencyWithoutSymbol(price) {
  return price.toLocaleString(APP_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
