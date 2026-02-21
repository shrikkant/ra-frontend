'use client'
import React, {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setIsNavigating(true)
    const timeout = setTimeout(() => setIsNavigating(false), 500)
    return () => clearTimeout(timeout)
  }, [pathname])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-[#ffd910] animate-progress-bar"
        style={{
          animation: 'progress-bar 500ms ease-out forwards',
        }}
      />
      <style jsx>{`
        @keyframes progress-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
