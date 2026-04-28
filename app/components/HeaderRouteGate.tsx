'use client'

import React from 'react'
import {usePathname} from 'next/navigation'
import {isRedesignedRoute} from './redesign/routes'

// Client-side gate that hides the legacy Header on redesigned routes.
// Receives the server-rendered Header as `children`, so the heavy
// AppHeader (which uses next/headers under the hood for cookies) stays
// server-rendered. usePathname() works during SSR for client components,
// so the conditional rendering happens both server- and client-side.
//
// Why this matters: the previous Header.tsx used next/headers() directly,
// which forced the root layout — and therefore every page — into dynamic
// rendering and disqualified them from SSG.
export default function HeaderRouteGate({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() || ''
  if (pathname.startsWith('/photobooth')) return null
  if (isRedesignedRoute(pathname)) return null
  return <>{children}</>
}
