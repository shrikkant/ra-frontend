import React from 'react'
import AppHeader from '../../app/components/common/layout/header'

// Pure server component. Renders the legacy AppHeader unconditionally.
// The conditional "show on legacy routes only" check is done by the
// HeaderRouteGate client wrapper (see app/layout.tsx) so we don't pull
// next/headers into the layout — that was forcing the whole tree dynamic.
export default function Header() {
  return (
    <div>
      <header className="header">
        <AppHeader />
      </header>
    </div>
  )
}
