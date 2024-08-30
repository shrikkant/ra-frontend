import React from 'react'

export default function PageContainer({ children }) {
  return (
    <div className="sm:container mx-auto">
      {children}
    </div>
  )
}
