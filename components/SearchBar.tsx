import { useRouter } from "next/router";
import React, { useEffect, useState, Fragment } from "react";
import { DateRange } from "react-date-range";
import { rangeDisplay } from "util/date.util";
import { useLocalStorage } from "util/localStore.util";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, Popover, Transition } from "@headlessui/react";
import { FaSearch, FaSearchLocation } from "react-icons/fa";

const locations = [
  {
    value: "Pune",
    label: "Pune",
  },
  {
    value: "Mumbai",
    label: "Mumbai",
  },
];
export default function SearchBar() {
  const router = useRouter();
  const { push } = useRouter();

  const searchDefaults = {
    location: {
      lat: 18.5788913,
      lng: 73.7706807,
      city: "Pune",
    },
    dates: [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ],
  };

  const [dates, setDates] = useState(searchDefaults.dates);
  const [location, setLocation] = useState(searchDefaults.location);
  const [defaultSearch, setDefaultSearch] = useLocalStorage(
    "defaultSearch",
    searchDefaults
  );
  const [datePopover, setDatePopover] = useState(false);

  const setBookingDates = (dates) => {
    const search = { ...defaultSearch };
    search.dates = [dates.selection];
    setDefaultSearch(search);
  };

  useEffect(() => {
    const dates = [
      {
        startDate: new Date(defaultSearch.dates[0].startDate),
        endDate: new Date(defaultSearch.dates[0].endDate),
        key: "selection",
      },
    ];
    setDates(dates);
    setLocation(defaultSearch.location);
  }, [defaultSearch]);

  const onRangePick = (d) => {
    if (d.filter((a) => a === 0).length === 2) {
      setDatePopover(false);
    }
  };

  const cityChange = (city) => {
    console.log("Changed City : ", city);
    const search: any = { ...defaultSearch };
    search.location = {
      city,
    };

    setDefaultSearch(search);
  };

  const onSearch = (value: string) => {
    const query = router.query;
    delete query.q;
    delete query.page;
    delete query.br;
    delete query.scid;
    delete query.rf;

    query.q = value;

    router.push("/rent?q=" + query.q);
  };
  const content = (
    <div>
      <DateRange
        startDatePlaceholder="Starting"
        endDatePlaceholder="Ending"
        minDate={new Date()}
        onChange={(item) => setBookingDates(item)}
        moveRangeOnFirstSelection={false}
        ranges={dates}
        onRangeFocusChange={(item) => onRangePick(item)}
      />
    </div>
  );

  return (
    <div className={"flex flex-col gap-y-4 sm:flex-row items-center gap-x-3"}>
      <div className="flex w-full items-center">
        {location && (
          <Popover className="relative z-[210]">
            <Popover.Button className="active:border-none focus:border-none focus:appearance-none inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-100 px-3">
              <span>{location.city}</span>
              <ChevronDownIcon
                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="bg-white absolute left-1/2 z-[210] mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 border puy rounded">
                {({ close }) => {
                  return (
                    <div className="flex flex-col gap-y-1">
                      {locations &&
                        locations.map((loc) => {
                          return (
                            <button
                              onClick={() => {
                                cityChange(loc.value);
                                close();
                              }}
                              className={`${"text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm gap-x-2`}
                            >
                              <img src={"/assets/img/city_images/" + loc.label + ".png"} className="h-6 w-6 "/>
                              {loc.label}
                            </button>
                          );
                        })}
                    </div>
                  );
                }}
              </Popover.Panel>
            </Transition>
          </Popover>
        )}

        <Popover className="relative z-[210]">
          <Popover.Button className="active:border-none focus:border-none focus:appearance-none inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-100 px-3">
            <span>{dates && rangeDisplay(dates[0])}</span>
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="bg-white absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 border rounded">
              {content}
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    </div>
  );
}
