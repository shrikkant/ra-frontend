'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {IProductSubCategory} from '../../../../app-store/types'

const ICON_FALLBACKS = ['▣', '◆', '✸', '◎', '△', '◐', '◇', '◈']

function iconFor(title: string, index: number): string {
  const t = title.toLowerCase()
  if (t.includes('mirror')) return '▣'
  if (t.includes('action') || t.includes('gopro')) return '◆'
  if (t.includes('light')) return '✸'
  if (t.includes('lens')) return '◎'
  if (t.includes('drone')) return '△'
  if (t.includes('audio') || t.includes('mic')) return '◐'
  if (t.includes('dslr')) return '▤'
  return ICON_FALLBACKS[index % ICON_FALLBACKS.length]
}

interface CategoryRailProps {
  subCategories: IProductSubCategory[]
  city?: string
}

export default function CategoryRail({
  subCategories,
  city = 'pune',
}: CategoryRailProps) {
  const [active, setActive] = useState<string>('all')

  return (
    <div className="pt-4 pb-1">
      <div
        className="flex gap-2.5 px-4 overflow-x-auto"
        style={{scrollbarWidth: 'none'}}
      >
        <CategoryPill
          label="All"
          icon="◉"
          active={active === 'all'}
          onSelect={() => setActive('all')}
          href={`/${city}/rent-camera?q=`}
        />
        {subCategories.map((sc, i) => (
          <CategoryPill
            key={sc.id ?? sc.slug}
            label={sc.title}
            icon={iconFor(sc.title, i)}
            active={active === sc.slug}
            onSelect={() => setActive(sc.slug)}
            href={`/${city}/${sc.slug}`}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryPill({
  label,
  icon,
  active,
  onSelect,
  href,
}: {
  label: string
  icon: string
  active: boolean
  onSelect: () => void
  href: string
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold border whitespace-nowrap no-underline ${
        active
          ? 'bg-ink text-surface border-ink'
          : 'bg-surface text-ink border-line'
      }`}
    >
      <span aria-hidden className="text-[16px] leading-none">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  )
}
