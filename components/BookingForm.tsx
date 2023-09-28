import React, { useEffect, useState } from "react";

import styles from "./../styles/active-product.module.css";
import { DateRangePicker } from "./search/DateRangePicker";
import { useLocalStorage } from "../util/localStore.util";
import { addToCart } from "../api/user/orders.api";

interface DefaultSearch {
  dates?: any[];
}
export default function BookingForm({productId, rates}) {

  const [defaultSearch, setDefaultSearch] = useLocalStorage<DefaultSearch>(
    "defaultSearch",
    null
  );

  useEffect(() => {
  }, []);

  const onAddToCart = () => {

    addToCart(productId, defaultSearch.dates[0]).then((resp) => {
      console.log("Dates : ", resp);
    })

  };

  return (
    <div>
      <div className="bg-white shadow-xl p-4 flex flex-col gap-4 text-sm w-full  ">
        <div className="">
          <div className="flex flex-nowrap flex-row border border-sky-100 p-2 gap-20 justify-center">
            <div className="flex">
              <span className="label text-slate-500">Starting</span>
              <DateRangePicker mode={"dark"}></DateRangePicker>
            </div>
          </div>
        </div>
        <div>
          <input
            onClick={onAddToCart}
            className="bg-[#ffd814] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffd814]"
            type="button"
            value="Add to Cart"
          />
        </div>
        <div>
          <input
            className="bg-[#ffa41c] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffa41c]"
            type="submit"
            value="Book Now"
          />
        </div>
      </div>
    </div>
  );
}
