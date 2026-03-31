'use client'

import React, {useState, useEffect} from 'react'
import Link from 'next/link'

export default function StickyMobileCTA({href}: {href: string}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the hero (roughly 400px)
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200/60 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Link
          href={href}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-b from-gray-800 to-gray-900 text-white text-sm font-medium rounded-full shadow-lg shadow-gray-900/20 active:scale-[0.98] transition-transform"
        >
          Browse gear
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
        </Link>
      </div>
    </div>
  )
}
