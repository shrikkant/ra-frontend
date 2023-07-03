import { Button, Popover, Input, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DateRange } from 'react-date-range';
import { getSearchResultsAction } from "../app-store/products/products.slice";
import { getProductFilter } from "../util/search.util";
import { useDispatch } from "react-redux";
import { rangeDisplay } from "../util/date.util";
import { useLocalStorage } from "../util/localStore.util";
const { Search } = Input;

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

  return (<div className="r-comp" style={{ display: "flex", alignItems: "center"}}>
    {location && <Select
      value={location.city}
      defaultValue={"City"}
      style={{ width: 120 }}
      onSelect={cityChange}
      options={[
        { value: "Mumbai", label: "Mumbai" },
        { value: "Pune", label: "Pune" },
      ]}
    />}

    <Popover content={content}
      title="Select Dates"
      trigger="click"
      open={datePopover}>
      <Button onClick={() => setDatePopover(true)}>
        {dates && rangeDisplay(dates[0])}
      </Button>
    </Popover>
    <Search defaultValue={q}
      style={{ minWidth: 320 }}
      placeholder="Canon 200D"
      onSearch={onSearch}
      enterButton />
  </div>)
}
