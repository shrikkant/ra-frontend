import React from 'react'
import {headers} from 'next/headers'
import AppHeader from '../../app/components/common/layout/header'
import {isRedesignedRoute} from '../../app/components/redesign/routes'

export default async function Header() {
  const headersList = await headers()
  const pathname =
    headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''

  if (pathname.startsWith('/photobooth')) {
    return null
  }
  if (isRedesignedRoute(pathname)) {
    return null
  }

  return (
    <div>
      <header className="header">
        <AppHeader></AppHeader>
      </header>
    </div>
  )
}
