import React from 'react'
export default function Layout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="max-w-7xl m-auto min-h-screen px-4">{children}</div>
}
