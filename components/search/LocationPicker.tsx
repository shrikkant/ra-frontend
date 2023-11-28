import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { useLocalStorage } from "../../util/localStore.util";

import { useDispatch, useSelector } from "react-redux";
import { getDefaultSearch, setSearch } from "../../app-store/session/session.slice";
import { useRouter } from "next/router";

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

export const LocationPicker = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchDefaults = {
    location: {
      lat: 18.5788913,
      lng: 73.7706807,
      city: "Pune",
    },
  };

  const [location, setLocation] = useState(searchDefaults.location);
  const storeSearch = useSelector(getDefaultSearch);

  const [defaultSearch, setDefaultSearch] = useLocalStorage(
    "defaultSearch",
    searchDefaults
  );

  const cityChange = (city) => {
    console.log("Changed City : ", city);
    const search: any = storeSearch ? {...storeSearch} : { ...defaultSearch };
    search.location = {
      city,
    };

    dispatch(setSearch(JSON.stringify(search)));
    setDefaultSearch(search);

    router.replace({
      pathname: "/rent/" + city.toLowerCase()
    });
    // router.refresh();
  };

  useEffect(() => {
    const search: any = storeSearch ? { ...storeSearch } : { ...defaultSearch };
    !defaultSearch && setDefaultSearch(
      search
    );
    dispatch(setSearch(JSON.stringify(search)));

  }, [defaultSearch]);

  return (
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
                  locations.map((loc, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          cityChange(loc.value);
                          close();
                        }}
                        className={`${"text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm gap-x-2`}
                      >
                        <img
                          src={"/assets/img/city_images/" + loc.label + ".png"}
                          className="h-6 w-6 "
                        />
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
  );
};
