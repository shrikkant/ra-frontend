'use client'

import React, {useEffect, useState} from 'react'
import {FaChevronDown, FaChevronRight} from 'react-icons/fa'
import {
  fetchMasterProductConversionStats,
  fetchProductConversionStatsForMaster,
  MasterProductConversionRow,
  ProductConversionRow,
} from '../../api/admin/index.api'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const formatPercent = (v: number) => `${(v * 100).toFixed(1)}%`

interface DrillDownState {
  loading: boolean
  rows: ProductConversionRow[]
  error?: string
}

export default function ProductConversionTable() {
  const now = new Date()
  const [year, setYear] = useState<number>(now.getFullYear())
  const [month, setMonth] = useState<number>(now.getMonth() + 1)
  const [rows, setRows] = useState<MasterProductConversionRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<number, DrillDownState>>({})

  const yearOptions: number[] = []
  for (let y = now.getFullYear(); y >= now.getFullYear() - 3; y--) {
    yearOptions.push(y)
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setIsLoading(true)
        setExpanded({})
        const data = await fetchMasterProductConversionStats(year, month)
        if (cancelled) return
        setRows(data.rows || [])
      } catch (err) {
        console.error('Error fetching master product conversion stats:', err)
        if (!cancelled) setRows([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [year, month])

  const toggleRow = async (masterProductId: number) => {
    const existing = expanded[masterProductId]
    if (existing) {
      setExpanded(prev => {
        const next = {...prev}
        delete next[masterProductId]
        return next
      })
      return
    }

    setExpanded(prev => ({
      ...prev,
      [masterProductId]: {loading: true, rows: []},
    }))

    try {
      const data = await fetchProductConversionStatsForMaster(
        masterProductId,
        year,
        month,
      )
      setExpanded(prev => ({
        ...prev,
        [masterProductId]: {loading: false, rows: data.rows || []},
      }))
    } catch (err) {
      console.error('Error fetching product conversion stats:', err)
      setExpanded(prev => ({
        ...prev,
        [masterProductId]: {
          loading: false,
          rows: [],
          error: 'Failed to load',
        },
      }))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Master Product Conversion
          </h3>
          <p className="text-sm text-gray-500">
            Add-to-cart vs signup conversion per master product
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
            value={month}
            onChange={e => setMonth(parseInt(e.target.value, 10))}
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
            value={year}
            onChange={e => setYear(parseInt(e.target.value, 10))}
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center p-8 text-gray-500 text-sm">
          No data for the selected period
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Master Product</th>
                <th className="px-4 py-2 font-medium text-right">Add to Cart</th>
                <th className="px-4 py-2 font-medium text-right">Signups</th>
                <th className="px-4 py-2 font-medium text-right">Engaged</th>
                <th className="px-4 py-2 font-medium text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const drill = expanded[row.master_product_id]
                const isOpen = !!drill
                return (
                  <React.Fragment key={row.master_product_id}>
                    <tr
                      className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRow(row.master_product_id)}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2 text-gray-900">
                          {isOpen ? (
                            <FaChevronDown className="text-gray-400 text-xs" />
                          ) : (
                            <FaChevronRight className="text-gray-400 text-xs" />
                          )}
                          <span>
                            {row.master_product_name ||
                              `Master #${row.master_product_id}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {row.add_to_cart}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {row.signups}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {row.engaged}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums font-medium text-gray-900">
                        {formatPercent(row.conversion)}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={5} className="px-4 py-3">
                          <DrillDown drill={drill} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function DrillDown({drill}: {drill: DrillDownState}) {
  if (drill.loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  if (drill.error) {
    return <div className="text-sm text-red-600 py-2">{drill.error}</div>
  }
  if (drill.rows.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-2">No products to show</div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-white text-gray-500 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Product</th>
            <th className="px-3 py-2 font-medium text-right">Rate</th>
            <th className="px-3 py-2 font-medium text-right">Add to Cart</th>
            <th className="px-3 py-2 font-medium text-right">Signups</th>
            <th className="px-3 py-2 font-medium text-right">Engaged</th>
            <th className="px-3 py-2 font-medium text-right">Conversion</th>
          </tr>
        </thead>
        <tbody>
          {drill.rows.map(row => (
            <tr key={row.product_id} className="border-t border-gray-100">
              <td className="px-3 py-2 text-gray-800">
                {row.product_title || `Product #${row.product_id}`}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-gray-700">
                {row.product_rate != null ? row.product_rate : '—'}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {row.add_to_cart}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {row.signups}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {row.engaged}
              </td>
              <td className="px-3 py-2 text-right tabular-nums font-medium text-gray-800">
                {formatPercent(row.conversion)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
