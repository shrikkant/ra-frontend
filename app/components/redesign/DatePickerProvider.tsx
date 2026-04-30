'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import DatePickerSheet from './product/DatePickerSheet'
import {
  getDefaultSearch,
  setSearch,
} from '../../../app-store/session/session.slice'
import {defaultDatesPayload, shouldSeedDefaults} from './home/dateUtils'

interface DatePickerContextValue {
  open: () => void
}

const DatePickerContext = createContext<DatePickerContextValue | null>(null)

/**
 * Single host for the global date picker. Mounted once inside MobileChrome
 * so any descendant — DateChip in the nav, disabled Add buttons on cards,
 * sticky CTA on product detail — can call `useDatePicker().open()` to
 * surface the same sheet without each rendering its own copy.
 *
 * Also seeds a sensible default rental window (tomorrow + 7 days) on
 * mount when nothing is stored yet — or when a returning user's previous
 * pick has rolled into the past. This removes the wall on add-to-cart
 * (no friction step before adding) while keeping the chip in the header
 * as the affordance for users who want to edit.
 */
export function DatePickerProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const dispatch = useDispatch()
  const stored = useSelector(getDefaultSearch)
  useEffect(() => {
    if (!shouldSeedDefaults(stored)) return
    dispatch(
      setSearch({
        ...((stored as any) ?? {}),
        dates: defaultDatesPayload(),
      }),
    )
  }, [stored, dispatch])

  return (
    <DatePickerContext.Provider value={{open}}>
      {children}
      <DatePickerSheet open={isOpen} onClose={close} />
    </DatePickerContext.Provider>
  )
}

export function useDatePicker(): DatePickerContextValue {
  const ctx = useContext(DatePickerContext)
  if (!ctx) {
    return {open: () => {}}
  }
  return ctx
}
