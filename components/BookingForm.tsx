import React, { useEffect, useState } from "react";
import { DateRangePicker } from "./search/DateRangePicker";
import { useLocalStorage } from "../util/localStore.util";
import { addToCart } from "../api/user/orders.api";
import { useRouter } from "next/router";
import PriceTag from "./PriceTag";
import { RupeeSymbol } from "./RupeeSymbol";
import { useSelector } from "react-redux";
import { getDefaultSearch } from "app-store/session/session.slice";

interface DefaultSearch {
  dates?: any[];
}
export default function BookingForm({ productId, rates }) {
  const router = useRouter();
  const storeSearch = useSelector(getDefaultSearch);
  const [defaultSearch, setDefaultSearch] =
    useLocalStorage<DefaultSearch>("defaultSearch");

  const getDays = () => {
    const startDate = new Date(storeSearch.dates[0].startDate);
    const endDate = new Date(storeSearch.dates[0].endDate);
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );
    return differenceInDays;
  };

  const onAddToCart = (bookNow?: boolean) => {
    addToCart(productId, defaultSearch.dates[0]).then((resp) => {
      if (bookNow) {
        router.push("/my-cart");
      }
    });
  };

  return (
    <div>
      <div className="bg-white shadow-md ml-3 p-5 flex flex-col gap-4 text-sm w-full dark:focus:outline-none border border-1 border-gray-200 ">
        <div className="">
          <div className="relative flex">
            <span className="absolute text-sm font-semibold top-0 left-0">
              <RupeeSymbol />
            </span>
            <span>
              <span className="text-3xl pl-3 font-semibold">
                {rates[0].rate}
              </span>
              <span className="text-sm"> per day</span>
            </span>
          </div>

          <div className="flex flex-nowrap flex-row rounded-md border border-gray-300 p-2 gap-20 justify-center mt-3">
            <div className="w-full flex justify-between">
              <span className="label text-black font-semibold ml-2">
                Booking Dates
              </span>
              <span className="">
                <DateRangePicker mode={"dark"}></DateRangePicker>
              </span>
            </div>
          </div>
        </div>
        <div>
          <input
            onClick={() => onAddToCart}
            className="bg-[#ffd814] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffd814]"
            type="button"
            value="Add to Cart"
          />
        </div>
        <div>
          <input
            onClick={() => onAddToCart(true)}
            className="bg-[#ffa41c] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffa41c]"
            type="submit"
            value="Book Now"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1">
            <span className="text-md font-semibold flex gap-1">
              <RupeeSymbol />
              {rates[0].rate}
            </span>
            <span>
              <span className="text-md text-gray-500 ">X {getDays()} day</span>
            </span>
          </div>
          <div className="text-md font-semibold flex gap-1">
            <RupeeSymbol />
            {rates[0].rate * getDays()}
          </div>
        </div>
        <div>
          <div className="mt-2 mb-1 w-px h-4 md:mt-0 ms-2.5 md:ms-0 md:w-full md:h-px md:flex-1 bg-gray-400"></div>
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total before taxes</span>
            <div className="relative flex gap-1">
              <span className="text-sm font-semibold top-0 left-0">
                <RupeeSymbol />
              </span>

              <span className="text-2xl font-semibold">
                {rates[0].rate * getDays()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
