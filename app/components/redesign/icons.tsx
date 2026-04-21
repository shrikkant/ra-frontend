// Inline SVG icon set for the redesign.
// Stroke widths are intentional (1.7–2.4) — keep when editing.
import React from 'react'

type IconProps = {
  size?: number
  className?: string
  strokeWidth?: number
}

const base = ({size = 22, strokeWidth = 2}: IconProps) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V11z" />
  </svg>
)

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)

export const CartIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <path d="M5 7h14l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
  </svg>
)

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base({...p, strokeWidth: p.strokeWidth ?? 2.4})} className={p.className} aria-hidden>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const MicIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </svg>
)

export const PlusIcon = (p: IconProps) => (
  <svg {...base({...p, strokeWidth: p.strokeWidth ?? 2.4})} className={p.className} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const StarIcon = (p: IconProps) => (
  <svg
    width={p.size ?? 14}
    height={p.size ?? 14}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={p.className}
    aria-hidden
  >
    <path d="M12 17.3l-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62 7.19.62-5.46 4.73 1.64 7.03z" />
  </svg>
)

export const TruckIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <rect x="2" y="7" width="13" height="10" rx="1.5" />
    <path d="M15 10h4l3 3v4h-7" />
    <circle cx="6.5" cy="18.5" r="2" />
    <circle cx="17.5" cy="18.5" r="2" />
  </svg>
)

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
  </svg>
)

export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base({...p, strokeWidth: p.strokeWidth ?? 2.4})} className={p.className} aria-hidden>
    <path d="M5 12l5 5L20 7" />
  </svg>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <path d="M19 12H5" />
    <path d="M12 5l-7 7 7 7" />
  </svg>
)

export const CloseIcon = (p: IconProps) => (
  <svg {...base({...p, strokeWidth: p.strokeWidth ?? 2.4})} className={p.className} aria-hidden>
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
)

export const SlidersIcon = (p: IconProps) => (
  <svg {...base(p)} className={p.className} aria-hidden>
    <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="8" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
)

export const BoltIcon = (p: IconProps) => (
  <svg
    width={p.size ?? 22}
    height={p.size ?? 22}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={p.className}
    aria-hidden
  >
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
)
