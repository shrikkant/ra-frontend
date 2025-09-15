import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
}

export default function PageContainer({children}: PageContainerProps) {
  return <div className="px-4 mx-auto max-w-7xl">{children}</div>
}
