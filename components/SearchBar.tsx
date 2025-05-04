import React from 'react'

import {DateRangePicker} from './search/DateRangePicker'
import {LocationPicker} from './search/LocationPicker'

export default function SearchBar() {
  return (
    <div className={'flex flex-col gap-y-4 sm:flex-row items-center gap-x-3'}>
      <div className="flex gap-x-4 w-full items-center">
        <LocationPicker></LocationPicker>
        <DateRangePicker mode={'light'}></DateRangePicker>
      </div>
    </div>
  )
}
