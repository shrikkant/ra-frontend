'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {useSelector} from 'react-redux'
import {ArrowLeftIcon, HeartIcon, CartIcon} from '../icons'
import {getCart} from '../../../../app-store/user/orders/orders.slice'

export default function FloatingHeader() {
  const router = useRouter()
  const cart = useSelector(getCart)
  const cartCount = cart?.items?.length ?? 0
  const [faved, setFaved] = useState(false)

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 pt-notch pb-3 flex items-center justify-between"
      style={{backdropFilter: 'blur(12px)'}}
    >
      <IconButton
        ariaLabel="Go back"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon size={20} />
      </IconButton>
      <div className="flex items-center gap-2">
        <IconButton
          ariaLabel={faved ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => setFaved(f => !f)}
          pressed={faved}
        >
          <HeartIcon
            size={20}
            className={faved ? 'text-accent' : undefined}
          />
        </IconButton>
        <Link
          href="/p/mycart"
          aria-label={`Cart, ${cartCount} items`}
          className="relative w-10 h-10 rounded-full bg-white/80 border border-line flex items-center justify-center text-ink"
        >
          <CartIcon size={20} />
          {cartCount > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-accent text-ink text-[10px] font-bold font-mono flex items-center justify-center px-1"
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}

function IconButton({
  children,
  ariaLabel,
  onClick,
  pressed = false,
}: {
  children: React.ReactNode
  ariaLabel: string
  onClick: () => void
  pressed?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={pressed}
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-white/80 border border-line flex items-center justify-center text-ink"
    >
      {children}
    </button>
  )
}
