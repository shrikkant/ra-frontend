'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {useDispatch, useSelector} from 'react-redux'
import {format} from 'date-fns'
import MobileChrome from '../MobileChrome'
import {selectAuthState, logout} from '../../../../app-store/auth/auth.slice'
import {fetchOrders} from '../../../../api/user/orders.api'
import {IOrder} from '../../../../app-store/types'
import {productPhotoUrl} from '../../../../util/product-image.util'
import {
  isVerified,
  VERIFICATION_FLAGS,
} from '../../../../config/constants'
import {
  CheckIcon,
  PinIcon,
  CardIcon,
  BellIcon,
  HelpIcon,
  LogoutIcon,
  ChevronRightIcon,
} from '../icons'

const APP_VERSION = 'v2.6.0 · build 2026.04'

const fmtINR = (n: number) =>
  '₹' + Math.round(n).toLocaleString('en-IN')

export default function ProfileScreen() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectAuthState)
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/join')
      return
    }
    setLoadingOrders(true)
    fetchOrders()
      .then(list => setOrders(list ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [user, router])

  const onLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  if (!user) return null

  const initial = (user.firstname?.[0] ?? user.email_address?.[0] ?? 'U')
    .toUpperCase()
  const fullName =
    `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim() ||
    user.email_address ||
    'You'
  const phoneDisplay = user.phone ? `+91 ${user.phone}` : 'Add phone'
  const kycVerified = isVerified(user.verified ?? 0, VERIFICATION_FLAGS.AADHAAR)

  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.created_ts).getTime() - new Date(a.created_ts).getTime(),
  )
  const active = sorted.find(o => isOrderActive(o))
  const past = sorted.filter(o => o !== active).slice(0, 5)

  return (
    <MobileChrome bottomPad="tabBar">
      <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-8 lg:pt-6">
        <div>
          <div className="px-4 lg:px-0 lg:sticky lg:top-24">
            <ProfileCard
              initial={initial}
              name={fullName}
              phoneDisplay={phoneDisplay}
              kycVerified={kycVerified}
              rentalCount={orders.length}
            />
          </div>
        </div>

        <div className="lg:max-w-2xl">
      {loadingOrders ? (
        <div className="px-4 lg:px-0 mt-4 lg:mt-0">
          <div className="h-28 rounded-[18px] bg-surface-muted animate-pulse" />
        </div>
      ) : (
        active && <ActiveRentalCard order={active} />
      )}

      {past.length > 0 && (
        <>
          <SectionTitle>Past orders</SectionTitle>
          <ul className="bg-surface mx-4 lg:mx-0 rounded-[18px] border border-line-soft divide-y divide-line-soft">
            {past.map(o => (
              <li key={o.id}>
                <PastOrderRow order={o} />
              </li>
            ))}
          </ul>
        </>
      )}

      <SectionTitle>Settings</SectionTitle>
      <div className="bg-surface mx-4 lg:mx-0 rounded-[18px] border border-line-soft divide-y divide-line-soft">
        <SettingsRow
          Icon={PinIcon}
          label="Addresses"
          href="/p/profile?section=addresses"
        />
        <SettingsRow
          Icon={CardIcon}
          label="Payment methods"
          href="/p/profile?section=payments"
        />
        <SettingsRow
          Icon={BellIcon}
          label="Notifications"
          href="/p/profile?section=notifications"
        />
        <SettingsRow Icon={HelpIcon} label="Help & support" href="/help" />
        <SettingsRow
          Icon={LogoutIcon}
          label="Log out"
          onClick={onLogout}
          tone="danger"
        />
      </div>
        </div>
      </div>

      <div className="text-center font-mono text-[11px] text-ink-subtle mt-6 mb-2">
        {APP_VERSION}
      </div>
    </MobileChrome>
  )
}

// ── Pieces ────────────────────────────────────────────────────────────

function ProfileCard({
  initial,
  name,
  phoneDisplay,
  kycVerified,
  rentalCount,
}: {
  initial: string
  name: string
  phoneDisplay: string
  kycVerified: boolean
  rentalCount: number
}) {
  return (
    <div className="bg-ink rounded-[20px] p-4 mt-2 flex items-center gap-4">
      <div className="w-[60px] h-[60px] rounded-full bg-accent text-ink flex items-center justify-center text-[24px] font-extrabold shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[18px] font-extrabold text-surface leading-tight truncate">
          {name}
        </div>
        <div className="font-mono text-[12px] text-white/70 mt-0.5">
          {phoneDisplay}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {kycVerified && (
            <span className="inline-flex items-center gap-1 bg-success/20 text-surface text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-kicker">
              <CheckIcon size={10} strokeWidth={3} />
              KYC verified
            </span>
          )}
          <span className="inline-flex items-center bg-accent text-ink text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-kicker">
            {tierLabel(rentalCount)} · {rentalCount}{' '}
            {rentalCount === 1 ? 'rental' : 'rentals'}
          </span>
        </div>
      </div>
    </div>
  )
}

function ActiveRentalCard({order}: {order: IOrder}) {
  const item = order.items?.[0]
  const product = item?.product
  const img = product ? productPhotoUrl(product, 160) : null
  const returnDate = order.end_date
    ? format(new Date(order.end_date), 'd MMM')
    : null
  const orderId = `RA-${String(order.id).padStart(8, '0').slice(-8)}`

  return (
    <>
      <SectionTitle>Active rental</SectionTitle>
      <div className="mx-4 lg:mx-0 bg-surface rounded-[18px] border border-line-soft p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-[12px] bg-surface-muted shrink-0 overflow-hidden">
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img}
                alt={product?.title ?? 'Rental'}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain p-2"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-ink leading-tight line-clamp-2">
              {product?.title ?? 'Active rental'}
            </div>
            <div className="font-mono text-[12px] text-ink-muted mt-0.5">
              {orderId}
              {returnDate && <> · returns {returnDate}</>}
            </div>
            <div className="mt-1.5">
              <span className="inline-flex items-center gap-1 bg-success/15 text-success text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-kicker">
                <span
                  aria-hidden
                  className="block w-1.5 h-1.5 rounded-full bg-success"
                />
                Out for delivery
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link
            href={`/p/orders/${order.id}`}
            className="text-center bg-ink text-surface text-[13px] font-extrabold rounded-full py-2.5 no-underline"
          >
            Extend rental
          </Link>
          <Link
            href="/help"
            className="text-center bg-surface border border-line text-ink text-[13px] font-extrabold rounded-full py-2.5 no-underline"
          >
            Need help?
          </Link>
        </div>
      </div>
    </>
  )
}

function PastOrderRow({order}: {order: IOrder}) {
  const item = order.items?.[0]
  const name = item?.product?.title ?? 'Order'
  const when = order.created_ts
    ? format(new Date(order.created_ts), 'd MMM yyyy')
    : ''
  const orderId = `RA-${String(order.id).padStart(8, '0').slice(-8)}`
  const amount = Number(order.total_amount ?? order.amount ?? 0)
  const rebookHref = item?.product?.slug
    ? `/pune/${item.product.subCategory?.slug ?? 'rent-camera'}/${item.product.slug}`
    : '/'

  return (
    <Link
      href={`/p/orders/${order.id}`}
      className="flex items-center gap-3 px-3 py-3 no-underline"
    >
      <div className="w-10 h-10 rounded-[10px] bg-success/15 text-success flex items-center justify-center shrink-0">
        <CheckIcon size={20} strokeWidth={3} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-ink line-clamp-1">
          {name}
        </div>
        <div className="font-mono text-[11px] text-ink-muted mt-0.5">
          {orderId}
          {when && <> · {when}</>}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-[13px] font-extrabold text-ink">
          {fmtINR(amount)}
        </div>
        <Link
          href={rebookHref}
          onClick={e => e.stopPropagation()}
          className="text-[11px] font-bold text-ink no-underline"
        >
          Rebook →
        </Link>
      </div>
    </Link>
  )
}

function SettingsRow({
  Icon,
  label,
  href,
  onClick,
  tone,
}: {
  Icon: React.ComponentType<{size?: number; className?: string}>
  label: string
  href?: string
  onClick?: () => void
  tone?: 'danger'
}) {
  const danger = tone === 'danger'
  const className = `w-full flex items-center gap-3 px-4 py-3.5 text-left ${
    danger ? 'text-danger' : 'text-ink'
  }`
  const content = (
    <>
      <Icon
        size={20}
        className={danger ? 'text-danger' : 'text-ink-secondary'}
      />
      <span className="flex-1 text-[14px] font-bold">{label}</span>
      {!danger && (
        <ChevronRightIcon size={16} className="text-ink-subtle" />
      )}
    </>
  )
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    )
  }
  return (
    <Link href={href ?? '#'} className={`${className} no-underline`}>
      {content}
    </Link>
  )
}

function SectionTitle({children}: {children: React.ReactNode}) {
  return (
    <div className="px-4 lg:px-0 pt-6 pb-3 text-[13px] uppercase tracking-kicker font-extrabold text-ink-secondary">
      {children}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────

function isOrderActive(o: IOrder): boolean {
  // Treat anything that's still within its rental window as active.
  if (!o.end_date) return false
  const now = Date.now()
  const end = new Date(o.end_date).getTime()
  if (Number.isNaN(end)) return false
  return end >= now
}

function tierLabel(count: number): string {
  if (count >= 25) return 'Platinum'
  if (count >= 10) return 'Gold'
  if (count >= 3) return 'Silver'
  return 'Bronze'
}

