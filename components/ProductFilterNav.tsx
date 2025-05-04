// import { Card, Slider } from "antd";

import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import {
  // getRateMarks,
  // getDefaultRateRange,
  getBrandOptions,
} from '../util/search.util'

import style from '../styles/search.module.css'
import React, {useState} from 'react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {getSearchMetaData} from '../app-store/products/products.slice'

// const sliderTrack = {
//   background: "lightgreen",
// };

// const handleStyle = {
//   height: "14px",
//   width: "14px",
//   marginTop: "-2px",
// };

interface FilterNavProps {
  onChange: (query) => void
  filters: boolean
  toggleFilters: () => void
}

export default function ProductFilterNav({
  onChange,
  filters,
  toggleFilters,
}: FilterNavProps) {
  const router = useRouter()

  const searchMeta = useSelector(getSearchMetaData)
  const [query, setQuery] = useState(router.query)

  const [brands, setBrands] = useState(
    getBrandOptions(searchMeta?.brands, query.br),
  )

  const onBrandsChange = () => {
    const checkedValues = Array.from(
      document.querySelectorAll('input[name="filterBrands"]'),
    )
      .filter((checkbox: HTMLInputElement) => checkbox.checked)
      .map((checkbox: HTMLInputElement) => checkbox.value)

    const newQuery = {...router.query}
    delete newQuery.br
    delete newQuery.page
    if (checkedValues.length > 0) {
      let brQuery = ''
      checkedValues.map((val, index) => {
        brQuery += val + (index < checkedValues.length - 1 ? ',' : '')
      })

      newQuery.br = brQuery
    }

    setQuery(newQuery)
    setBrands(getBrandOptions(searchMeta?.brands, newQuery.br))
    onChange(newQuery)
  }

  // const onPriceChange = (values) => {
  //   const q = { ...router.query };
  //   delete q.rf;
  //   delete q.page;

  //   const rfQuery = values[0] + "-" + values[1];
  //   q.rf = rfQuery;

  //   setQuery(q);
  //   onChange(query);
  // };

  return (
    <div
      className={`pt-5 bg-white w-full h-screen sm:h-auto sm:w-72 top-30 sm:relative z-[200] fixed  transition-transform sm:translate-y-0

      ${filters ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex justify-end py-3 border-b sm:hidden">
        <button
          className="text-xl px-6 flex justify-end"
          onClick={toggleFilters}
        >
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className=" flex flex-col gap-y-3 overflow-y-auto h-[calc(100vh-220px)] px-3 overscroll-contain w-full sm:w-72">
        {searchMeta && brands?.length > 0 && (
          <div>
            <div>
              {brands.map(brand => {
                return (
                  <div key={brand.value} className="flex gap-x-2 my-1">
                    <input
                      name="filterBrands"
                      type="checkbox"
                      value={brand.value}
                      onChange={onBrandsChange}
                      defaultChecked={brand.checked}
                    />
                    <span>{brand.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {showPriceFilter(searchMeta.rate) && (
          <div title="Price">
            <div className={style.pitsWrapper}>
              {getPits(searchMeta.rate).map((pit, index) => {
                return (
                  <div
                    key={'p_' + index}
                    className={style.pit}
                    style={{height: pit + '%'}}
                  ></div>
                )
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
              query.rf
            )}
            onChangeComplete={onPriceChange}
          /> */}
            {/* <Meta title={searchMeta.total}></Meta> */}
          </div>
        )}
      </div>

      <div className="flex justify-end p-3 border-t mt-2 sm:hidden">
        <button className="bg-gray-800 text-gray-100 p-2 rounded">
          Show {searchMeta.total} results
        </button>
      </div>
    </div>
  )
}

const showPriceFilter = rate => {
  return getPits(rate).filter(p => p > 0).length > 4
}

function getPits(rate) {
  let pits: number[] = []
  let realValues: number[] = []

  realValues = rate.bands.map(b => b.count)

  const max = Math.max(...realValues)
  const min = Math.min(...realValues)

  pits = realValues.map(v => Math.round(((v - min) / (max - min)) * 100))

  return pits
}
