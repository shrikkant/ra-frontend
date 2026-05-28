'use client'

import React, {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'

const WA_PHONE = '7720829444'
const WA_MESSAGE = 'Hi RentAcross 👋 I have a quick question.'
const WA_URL = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`

// Routes where the FAB is suppressed. Keep this list narrow — focused
// flows (login, KYC) where a distractor would hurt conversion, plus any
// screen with its own primary CTA at the bottom-right.
const HIDE_PATTERNS: RegExp[] = [
  /^\/join/,
  /^\/p\/profile\/verify/,
  /^\/photobooth/,
]

const WhatsappGlyph = ({size = 28}: {size?: number}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.5-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.3 1.2 4.7L2 22l5.4-1.4c1.4.7 2.9 1.1 4.6 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.5 0-3-.4-4.2-1.1l-.3-.2-3.2.8.9-3.1-.2-.3C4.3 15.1 4 13.6 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8.3-8 8.3z" />
  </svg>
)

// Floating WhatsApp launcher, Intercom-style. Sits above the mobile TabBar
// on small screens, bottom-right on desktop. The wa.me message is a warm
// conversational opener ("Hi RentAcross 👋 I have a quick question.")
// rather than a templated support ticket, so the first message in the
// thread reads like a real conversation start.
export default function WhatsAppFab() {
  const pathname = usePathname() ?? '/'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Subtle entrance delay so the FAB doesn't compete with LCP/initial
    // paint, and so it feels like it "arrives" rather than flashing on.
    const t = setTimeout(() => setMounted(true), 500)
    return () => clearTimeout(t)
  }, [])

  if (HIDE_PATTERNS.some(re => re.test(pathname))) return null

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with RentAcross on WhatsApp"
      className={`group fixed right-4 md:right-6 bottom-[140px] md:bottom-6 z-40 transition-all duration-300 ease-out ${
        mounted
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-90 pointer-events-none'
      }`}
    >
      <span className="hidden md:inline-flex absolute right-full mr-3 top-1/2 -translate-y-1/2 items-center bg-ink text-surface text-[12px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
      <span className="block w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
        <WhatsappGlyph />
      </span>
    </a>
  )
}
