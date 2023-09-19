import { Popover, Transition } from "@headlessui/react";
import { rangeDisplay } from "util/date.util";
import { useLocalStorage } from "../../util/localStore.util";
import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { DateRange } from "react-date-range";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getDefaultSearch,
  setSearch,
} from "../../app-store/session/session.slice";

interface DefaultSearch {
  dates?: any[];
}

export const DateRangePicker = ({ mode }) => {
  const dispatch = useDispatch();

  const storeSearch = useSelector(getDefaultSearch);
  const [defaultSearch, setDefaultSearch] = useLocalStorage<DefaultSearch>(
    "defaultSearch",
    null
  );

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    const localSearch = storeSearch ? storeSearch : defaultSearch;
    const dates = localSearch?.dates
      ? [
          {
            startDate: new Date(localSearch?.dates[0].startDate),
            endDate: new Date(localSearch?.dates[0].endDate),
            key: "selection",
          },
        ]
      : [
          {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          },
        ];

    setDates(dates);
  }, [defaultSearch, storeSearch]);

  const setBookingDates = (dates) => {
    // delete defaultSearch.dates;
    const search = storeSearch ? { ...storeSearch } : { ...defaultSearch };
    search.dates = [dates.selection];
    dispatch(setSearch(JSON.stringify(search)));

    setDefaultSearch(search);
  };

  const onRangePick = (d, done) => {
    if (d.filter((a) => a === 0).length === 2) {
      done();
    }
  };

  return (
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
          {({ close }) => {
            return (
              <div>
                <DateRange
                  startDatePlaceholder="Starting"
                  endDatePlaceholder="Ending"
                  minDate={new Date()}
                  onChange={(item) => setBookingDates(item)}
                  moveRangeOnFirstSelection={false}
                  ranges={dates}
                  onRangeFocusChange={(item) => {
                    onRangePick(item, close);
                  }}
                />
              </div>
            );
          }}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
