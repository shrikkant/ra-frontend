'use client'

import React from 'react'
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa'

interface OrdersPagerProps {
  /** Zero-based index of the current page. */
  currentPage: number
  /** Total number of items across all pages. */
  totalItems: number
  /** Number of items shown per page. */
  pageSize: number
  /** Called with the zero-based index of the page to navigate to. */
  onPageChange: (page: number) => void
}

/** Sentinel used to mark a gap (…) between page-number groups. */
const ELLIPSIS = -1

/**
 * Builds a compact list of 1-based page numbers with ellipsis gaps, always
 * showing the first page, last page, and a window around the current page.
 * e.g. [1, …, 4, 5, 6, …, 20]
 */
const buildPageItems = (current: number, totalPages: number): number[] => {
  if (totalPages <= 7) {
    return Array.from({length: totalPages}, (_, i) => i + 1)
  }

  const items: number[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)

  if (start > 2) items.push(ELLIPSIS)
  for (let page = start; page <= end; page++) items.push(page)
  if (end < totalPages - 1) items.push(ELLIPSIS)

  items.push(totalPages)
  return items
}

const arrowClassName =
  'flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500'

/**
 * Clean, accessible page-number navigation for the admin orders table.
 * Renders a results summary and numbered pages with prev/next arrows.
 * Returns null when everything fits on a single page.
 */
export const OrdersPager: React.FC<OrdersPagerProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize)
  if (totalPages <= 1) return null

  const current = currentPage + 1 // 1-based for display
  const firstItem = currentPage * pageSize + 1
  const lastItem = Math.min(totalItems, current * pageSize)
  const pageItems = buildPageItems(current, totalPages)

  const goTo = (page: number) => {
    const clamped = Math.min(Math.max(page, 0), totalPages - 1)
    if (clamped !== currentPage) onPageChange(clamped)
  }

  return (
    <nav
      className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-1 pt-4 sm:flex-row"
      aria-label="Orders pagination"
    >
      <p className="text-xs text-gray-500">
        Showing <span className="font-medium text-gray-700">{firstItem}</span>–
        <span className="font-medium text-gray-700">{lastItem}</span> of{' '}
        <span className="font-medium text-gray-700">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 0}
          className={arrowClassName}
          aria-label="Previous page"
        >
          <FaChevronLeft className="h-3 w-3" />
        </button>

        {pageItems.map((page, index) =>
          page === ELLIPSIS ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 items-center justify-center text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goTo(page - 1)}
              aria-current={page === current ? 'page' : undefined}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors ${
                page === current
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={current >= totalPages}
          className={arrowClassName}
          aria-label="Next page"
        >
          <FaChevronRight className="h-3 w-3" />
        </button>
      </div>
    </nav>
  )
}
