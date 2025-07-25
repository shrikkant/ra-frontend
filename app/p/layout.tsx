import React from 'react'
export default function Layout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl m-auto md:min-h-[calc(100vh-100px-418px)] px-4">
      {children}
    </div>
  )
}
