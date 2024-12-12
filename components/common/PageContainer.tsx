import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="sm:container mx-auto">
      {children}
    </div>
  )
}
