"use client"
import { Card, Form, Checkbox, Slider } from "antd";

import { usePathname, useRouter } from "next/navigation";

import {
  getRateMarks,
  getDefaultRateRange,
  getBrandOptions,
} from "util/search.util";


import style from "styles/search.module.css";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";


const sliderTrack = {
  background: "lightgreen",
};

const handleStyle = {
  height: "14px",
  width: "14px",
  marginTop: "-2px",
};

export default function FilterSideBar({ params,
  searchMeta
}) {
  const router = useRouter();
  const pathname = usePathname()
  const brands = getBrandOptions(searchMeta?.brands);
  const [filters, setFilters] = useState(true);



  const rf = "";

  const toggleNav = () => {
    setFilters(!filters);
  };

  const onChange = (query) => {
    //    window.location.href = pathname + "?" + new URLSearchParams(query).toString();
    // router.push(pathname + "?" + new URLSearchParams(query).toString());
  };

  const onBrandsChange = (checkedValues: any[]) => {
    console.log("checked = ", checkedValues)
    const query: any = {}
    delete query.br;
    delete query.page;
    if (checkedValues.length > 0) {
      let brQuery = "";
      checkedValues.map((val, index) => {
        brQuery += val + (index < checkedValues.length - 1 ? "," : "");
      });

      query.br = brQuery;
    }

    onChange(query);
  };

  const onPriceChange = (values) => {
    const query: any = {};

    const rfQuery = values[0] + "-" + values[1];
    query.rf = rfQuery;

    onChange(query);
  };


  return (
    <div
      className={`pt-5 bg-white w-full h-screen sm:h-auto sm:w-72 top-30 sm:relative z-[200] fixed  transition-transform sm:translate-y-0

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
        {brands?.length > 0 && <Card title="Brands">
          <Form layout={"vertical"}>
            <Checkbox.Group
              className={"brands"}
              options={brands}
              onChange={onBrandsChange}
            />
          </Form>
        </Card>}

        <Card title="Price">
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

          <Slider
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
          />
          {/* <Meta title={searchMeta.total}></Meta> */}
        </Card>
      </div>

      <div className="flex justify-end p-3 border-t mt-2 sm:hidden">
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

  const max = Math.max.apply(Math, realValues);
  const min = Math.min.apply(Math, realValues);

  pits = realValues.map((v) => Math.round(((v - min) / (max - min)) * 100));

  return pits;
}
