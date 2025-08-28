import React from 'react'
import {headers} from 'next/headers'
import AppHeader from '../../app/components/common/layout/header'

export default async function Header() {
  const headersList = await headers()
  const pathname =
    headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''

  console.log('pathname', pathname)
  // You can now use pathname to conditionally render
  // For example, hide header on photobooth pages:
  if (pathname.startsWith('/photobooth')) {
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
