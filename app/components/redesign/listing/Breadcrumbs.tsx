import React from 'react'
import Link from 'next/link'
import {capitalizeCity} from 'util/category.util'
import type {IProductFilter} from '../../../../app-store/types'

interface BreadcrumbsProps {
  filter: IProductFilter
  slug: string[]
  subCategoryTitle?: string
}

// Visible breadcrumb. The schema.org BreadcrumbList JSON-LD is emitted
// separately by util/seo.util.ts.
export default function Breadcrumbs({
  filter,
  slug,
  subCategoryTitle,
}: BreadcrumbsProps) {
  const isCountryPrefixed =
    slug.length > 0 && slug[0].length === 2 && slug[0] !== filter.city

  const cityHref = filter.city
    ? `/${(isCountryPrefixed ? slug.slice(0, 2) : [filter.city]).join('/')}`
    : filter.state
      ? `/${filter.state}`
      : undefined

  const cityLabel = filter.city
    ? capitalizeCity(filter.city)
    : filter.state
      ? capitalizeCity(filter.state)
      : undefined

  const items: Array<{label: string; href?: string}> = [
    {label: 'Home', href: '/'},
  ]
  if (cityLabel) {
    items.push({
      label: cityLabel,
      href: subCategoryTitle ? cityHref : undefined,
    })
  }
  if (subCategoryTitle) {
    items.push({label: subCategoryTitle})
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-4 lg:px-0 pt-3 lg:pt-5 pb-1"
    >
      <ol className="flex items-center flex-wrap gap-1.5 text-[12px] font-mono text-ink-muted">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <li aria-hidden="true" className="text-ink-muted">
                ›
              </li>
            )}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
