/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  getDefaultSearch,
  setSearch,
} from '../../app-store/session/session.slice'
import {DateSelector, getMinBookingDate} from '../booking/DateSelector'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DateRangePicker = ({mode}: {mode?: string}) => {
  const dispatch = useDispatch()
  const storeSearch = useSelector(getDefaultSearch)

  useEffect(() => {
    const currentSearch: any = {...storeSearch}
    if (!currentSearch.dates) {
      const minDate = getMinBookingDate()
      const twoWeeksLater = new Date(minDate)
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)
      currentSearch.dates = {
        startDate: '' + minDate,
        endDate: '' + twoWeeksLater,
        key: 'selection',
      }
      dispatch(setSearch(currentSearch))
    }
  }, [storeSearch])

  const setBookingDates = (dates: any) => {
    const search: any = {...storeSearch}
    search.dates = {
      startDate: '' + dates.selection.startDate,
      endDate: '' + dates.selection.endDate,
      key: 'selection',
    }
    dispatch(setSearch(search))
  }

  return (
    <div className="min-w-[270px]">
      <DateSelector
        storeSearch={storeSearch}
        size="sm"
        onDateChange={setBookingDates}
        theme="dark"
      />
    </div>
  )
}
