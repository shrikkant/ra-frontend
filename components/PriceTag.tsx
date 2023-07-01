import React from "react";
import { APP_LOCALE } from "../config/constants"

export default function PriceTag({price, currency}){

  return (<div className="r-comp" style={{fontSize:24}}>
    {getCurrencySymbol(price, currency)} {}
  </div>)
}

function getCurrencySymbol (price, currency) {
  return (price).toLocaleString(
    APP_LOCALE,
    {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
}
