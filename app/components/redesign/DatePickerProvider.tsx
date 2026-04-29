'use client'

import React, {createContext, useCallback, useContext, useState} from 'react'
import DatePickerSheet from './product/DatePickerSheet'

interface DatePickerContextValue {
  open: () => void
}

const DatePickerContext = createContext<DatePickerContextValue | null>(null)

/**
 * Single host for the global date picker. Mounted once inside MobileChrome
 * so any descendant — DateChip in the nav, disabled Add buttons on cards,
 * sticky CTA on product detail — can call `useDatePicker().open()` to
 * surface the same sheet without each rendering its own copy.
 */
export function DatePickerProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

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
