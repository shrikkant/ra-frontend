"use client"
// import { Card, Form, Checkbox, Slider } from "antd";

import { usePathname, useRouter } from "next/navigation";

import {
  // getRateMarks,
  // getDefaultRateRange,
  getBrandOptions,
  // paramsToObject,
} from "util/search.util";


import style from "styles/search.module.css";
import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { IProductFilter } from "../../app-store/types";

import { useDispatch, useSelector } from "react-redux";
import { getDefaultSearch, setSearch } from "../../app-store/session/session.slice";

// const sliderTrack = {
//   background: "lightgreen",
// };

// const handleStyle = {
//   height: "14px",
//   width: "14px",
//   marginTop: "-2px",
// };

export default function FilterSideBar({
  searchMeta,
  filter
}: {
  searchMeta;
  filter: IProductFilter;

}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  const brands = getBrandOptions(searchMeta?.brands);
  const [filters, setFilters] = useState(true);
  // const [newQuery, setNewQuery] = useState(paramsToObject(searchParams));
  const newQuery = {};
  const defaultSearch = useSelector(getDefaultSearch);

  // const rf = "";

  const toggleNav = () => {
    setFilters(!filters);
  };

  const onChange = () => {
    router.replace("/rent/" + pathname + "?" + new URLSearchParams(newQuery).toString());
  };

  // const onBrandsChange = (checkedValues: string[]) => {

  //   const query: any = { ...newQuery }
  //   delete query.br;
  //   delete query.page;
  //   if (checkedValues.length > 0) {
  //     let brQuery = "";
  //     checkedValues.map((val, index) => {
  //       brQuery += val + (index < checkedValues.length - 1 ? "," : "");
  //     });

  //     query.br = brQuery;
  //   }

  //   setNewQuery(query)
  // };

  // const onPriceChange = (values) => {
  //   const query: any = { ...newQuery };

  //   const rfQuery: any = values[0] + "-" + values[1];
  //   query.rf = rfQuery;

  //   setNewQuery(query);
  // };

  useEffect(() => {
    const currentSearch = { ...defaultSearch };

    if (filter && currentSearch?.location) {
      if (filter.city?.toLowerCase() !== currentSearch?.location?.city?.toLowerCase()) {
        currentSearch.location = {
          city: filter.city,
        }
        dispatch(setSearch(currentSearch));
      }
    }


  }, [filter, defaultSearch])

  return (
    <div
      className={`pt-5 xs:hidden bg-white w-full h-screen sm:h-auto sm:w-72 top-30 sm:relative z-[200] fixed  transition-transform sm:translate-y-0

      ${filters ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex justify-end py-3 border-b sm:hidden">
        <button
          className="text-xl px-6 flex justify-end"
          onClick={toggleNav}
        >
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className=" flex flex-col gap-y-3 overflow-y-auto h-[calc(100vh-220px)] px-3 overscroll-contain w-full sm:w-72">
        {brands?.length > 0 && <div title="Brands">
          {/* <form >
            <CheckboxGroup
              className={"brands"}
              options={brands}
              onChange={onBrandsChange}
            />
          </form> */}
        </div>}

        <div >
          <div className={style.pitsWrapper}>
            {getPits(searchMeta.rate).map((pit, index) => {
              return (
                <div
                  key={"p_" + index}
                  className={style.pit}
                  style={{ height: pit + "%" }}
                ></div>
              );
            })}
          </div>

          {/* <Slider
            marks={getRateMarks(searchMeta.rate)}
            min={searchMeta.rate.min}
            max={searchMeta.rate.max}
            trackStyle={[sliderTrack]}
            handleStyle={[handleStyle, handleStyle]}
            range
            defaultValue={getDefaultRateRange(
              searchMeta.rate.min,
              searchMeta.rate.max,
              rf
            )}
            onChangeComplete={onPriceChange}
          /> */}
          {/* <Meta title={searchMeta.total}></Meta> */}
        </div>

        <div className="text-right pt-2 ">
          <a onClick={onChange} className="bg-green-600 p-2 rounded-sm text-gray-100 cursor-pointer border-green-900 hover:bg-green-700 hover:text-gray-200 " href="#">
            Apply Filters
          </a>
        </div>
      </div>

      <div className="flex justify-end p-3 border-t mt-2 sm:flex-col">
        <div>{JSON.stringify(newQuery)}</div>
        <button className="bg-gray-800 text-gray-100 p-2 rounded">
          Show {searchMeta.total} results
        </button>
      </div>
    </div>
  );
}

function getPits(rate) {
  let pits: number[] = [];
  let realValues: number[] = [];

  realValues = rate.bands.map((b) => b.count);

  const max = Math.max(...realValues);
  const min = Math.min(...realValues);

  pits = realValues.map((v) => Math.round(((v - min) / (max - min)) * 100));

  return pits;
}
