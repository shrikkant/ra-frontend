'use client'

import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import ArrowIcon from '../common/ArrowIcon'
import {BROWSE_CTA_TEXT} from '../../config/home.constants'

const SCROLL_THRESHOLD = 400

export default function StickyMobileCTA({href}: {href: string}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
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
          {BROWSE_CTA_TEXT}
          <ArrowIcon />
        </Link>
      </div>
    </div>
  )
}
