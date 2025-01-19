/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { rangeDisplay } from "util/date.util";
import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { DateRange } from "react-date-range";
import { useDispatch, useSelector } from "react-redux";
import {
  getDefaultSearch,
  setSearch,
} from "../../app-store/session/session.slice";
import { IDates } from "../../app-store/app-defaults/types";

import "react-date-range/dist/styles.css"; // main style file

export const DateRangePicker = ({ mode }: { mode: string }) => {
  const dispatch = useDispatch();

  const storeSearch = useSelector(getDefaultSearch);
  const [dates, setDates] = useState<IDates>();

  useEffect(() => {
    const currentSearch: any = { ...storeSearch };

    if (!currentSearch.dates) {
      const today = new Date();
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
      const currentDates = {
        startDate: '' + today,
        endDate: '' + twoWeeksLater,
        key: "selection",
      };
      currentSearch.dates = currentDates;

      dispatch(setSearch(currentSearch));
    }


    if (currentSearch && currentSearch.dates) {
      const currentDates = {
        startDate: new Date(currentSearch.dates.startDate),
        endDate: new Date(currentSearch.dates.endDate),
        key: "selection",
      }

      setDates(currentDates);
    }

  }, [storeSearch]);

  const setBookingDates = (dates) => {
    // delete defaultSearch.dates;
    const search: any = { ...storeSearch };
    search.dates = {
      startDate: '' + dates.selection.startDate,
      endDate: '' + dates.selection.endDate,
      key: "selection",
    };
    dispatch(setSearch(search));

  };

  const onRangePick = (d, done) => {
    if (d.filter((a) => a === 0).length === 2) {
      done();
    }
  };

  const textColor = mode === "dark" ? "text-gray-700" : "text-gray-100";

  return (
    <Popover className="relative ">
      <PopoverButton className={"active:border-none focus:border-none focus:appearance-none inline-flex items-center gap-x-1 text-sm font-semibold leading-6  px-3 " + textColor}>
        <span>{dates && rangeDisplay(dates)}</span>
        <ChevronDownIcon
          className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
          aria-hidden="true"
        />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"

      >
        <PopoverPanel className="bg-white sm:absolute
        xs:fixed
        xs:left-6
        z-10 mt-5
        ml-5
        mr-5
        max-w-max
        sm:-translate-x-1/2 px-4 border
        rounded ">
          {({ close }) => {
            return (
              <div>
                <DateRange
                  startDatePlaceholder="Starting"
                  endDatePlaceholder="Ending"
                  minDate={new Date()}
                  onChange={(item) => setBookingDates(item)}
                  moveRangeOnFirstSelection={false}
                  ranges={[dates]}
                  onRangeFocusChange={(item) => {
                    onRangePick(item, close);
                  }}
                />
              </div>
            );
          }}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};
