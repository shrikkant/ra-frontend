import React, { useEffect, useState } from "react";

import styles from "./../styles/active-product.module.css";
import { useLocalStorage } from "../util/localStore.util";
import { rangeDisplay } from "../util/date.util";
import { setDate } from "date-fns";

interface DefaultSearch {
  dates?: any[];
}
export default function BookingForm({rates}) {
  const [defaultSearch, setDefaultSearch] = useLocalStorage<DefaultSearch>(
    "defaultSearch",
    {}
  );

  const [dates, setDates] = useState({});

  useEffect(() => {
    const dates = defaultSearch
      ? [
          {
            startDate: new Date(defaultSearch?.dates[0].startDate),
            endDate: new Date(defaultSearch?.dates[0].endDate),
            key: "selection",
          },
        ]
      : [];

    console.log("Default Search : ", dates);
    setDates(dates);
  }, []);

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div>
      <div className="bg-white shadow-xl p-4 flex flex-col gap-4 text-sm w-full  ">
        <div className="">
          <div className="flex flex-nowrap flex-row border border-sky-100 p-2 gap-20 justify-center">
            <div className="w-1/2 flex flex-col">
              <span className="label text-slate-500">Starting</span>
              <span>{dates[0] && rangeDisplay(dates[0])}</span>
            </div>

            <div className="w-1/2 flex flex-col">
              <span className="label text-slate-500">Ending</span>
              <span
                className="date bolder text-lg"
                ng-bind="fullDate(order.date.endDate)"
              >
                20/8/2023
              </span>
            </div>
          </div>
        </div>
        <div>
          <input
            className="bg-[#ffd814] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffd814]"
            type="submit"
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
