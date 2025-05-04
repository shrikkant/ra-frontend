import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file

import React from 'react'

import HeaderSubNav from '../app/components/common/layout/HeaderSubNav'
import MainHeaderNav from '../app/components/common/layout/MainHeaderNav'

export default function AppHeader() {
  return (
    <div>
      <MainHeaderNav />
      <HeaderSubNav />
    </div>
  )
}
