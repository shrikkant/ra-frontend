import React from 'react'

export default function PageContainer({ children }) {
  return (
    <div className="container mx-auto">
      {children}
    </div>
  )
}
