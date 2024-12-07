"use client"
import React, { useEffect } from "react";
import PriceTag from "../PriceTag";
import { getDefaultSearch } from "../../app-store/session/session.slice";
import { useSelector } from "react-redux";
import { DISCOUNT_STEPS } from "../../config/constants";

interface ProductPriceProps {
  dailyRent: number;
  discount: number;
}

export const ProductPrice = ({ dailyRent, discount }: ProductPriceProps) => {

  const [finalDiscount, setFinalDiscount] = React.useState(0);
  const storeSearch = useSelector(getDefaultSearch);

  const getDays = () => {
    const startDate =
      storeSearch && storeSearch.dates
        ? new Date(storeSearch?.dates.startDate)
        : new Date();
    const endDate =
      storeSearch && storeSearch.dates
        ? new Date(storeSearch.dates.endDate)
        : new Date();
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );
    return differenceInDays;
  };

  useEffect(() => {
    const days = getDays();
    const discountStep = DISCOUNT_STEPS.find(
      (step) => step.days <= days
    );

    if (discountStep) {
      setFinalDiscount(discount + discountStep.discount);
    }
  }, [getDays()]);

  return (<div className="flex items-end gap-x-2 font-semibold pb-2">
    {
      <PriceTag price={dailyRent} discount={finalDiscount} />
    }
  </div>)
}
