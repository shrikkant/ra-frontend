import { useRouter } from "next/router";
import React, { useEffect, useState, Fragment } from "react";
import { DateRange } from 'react-date-range';
import { rangeDisplay } from "util/date.util";
import { useLocalStorage } from "util/localStore.util";

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Menu, Popover, Transition } from "@headlessui/react"

const locations = [
  {
    value: "Pune",
    label: "Pune",
  },
  {
    value: "Mumbai",
    label: "Mumbai",
  },
]
export default function SearchBar() {
  const router = useRouter();
  const { push } = useRouter();
  const { q } = router.query;

  const searchDefaults = {
    location: {
      lat: 18.5788913,
      lng: 73.7706807,
      city: "Pune",
    },
    dates: [{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }]
  }

  const [dates, setDates] = useState(searchDefaults.dates);
  const [location, setLocation] = useState(searchDefaults.location)
  const [defaultSearch, setDefaultSearch] = useLocalStorage("defaultSearch", searchDefaults);
  const [datePopover, setDatePopover] = useState(false);

  const setBookingDates = (dates) => {
    const search = { ...defaultSearch };
    search.dates = [dates.selection];
    setDefaultSearch(search);
  }

  useEffect(() => {
    const dates = [
      {
        startDate: new Date(defaultSearch.dates[0].startDate),
        endDate: new Date(defaultSearch.dates[0].endDate),
        key: "selection",
      }
    ];
    setDates(dates);
    setLocation(defaultSearch.location);
  }, [defaultSearch]);

  const onRangePick = (d) => {
    if (d.filter(a => a === 0).length === 2) {
      setDatePopover(false);
    }
  }

  const cityChange = (city) => {
    console.log("Changed City : ", city);
    const search: any = { ...defaultSearch };
    search.location = {
      city,
    };

    setDefaultSearch(search);
  }


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
        onChange={item => setBookingDates(item)}
        moveRangeOnFirstSelection={false}
        ranges={dates}
        onRangeFocusChange={item => onRangePick(item)}
      />
    </div>
  );

  return (<div className="r-comp" style={{ display: "flex", alignItems: "center" }}>
    {location && <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {location.city}
          <ChevronDownIcon
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => cityChange("Pune")}
                  className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Pune
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => cityChange("Mumbai")}
                  className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Mumbai
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>}


    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        <span>{dates && rangeDisplay(dates[0])}</span>
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
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          {content}
        </Popover.Panel>
      </Transition>
    </Popover>

    <input defaultValue={q}
      style={{ minWidth: 320 }}
      type="text"
      placeholder="Canon 200D"
      onChange={(e) => onSearch(e.target.value)}/>
  </div>)
}
