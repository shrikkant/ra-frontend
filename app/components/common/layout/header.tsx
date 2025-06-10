import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

import React from 'react'
import HeaderSubNav from './HeaderSubNav'
import MainHeaderNav from './MainHeaderNav'

export default function AppHeader() {
  return (
    <div className="bg-gradient-to-br from-[#1f2937] to-[#111827]">
      <MainHeaderNav />
      <HeaderSubNav />
    </div>
  )
}
