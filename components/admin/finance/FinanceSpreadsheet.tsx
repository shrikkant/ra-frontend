'use client'

import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {FaFileExcel, FaSpinner} from 'react-icons/fa'
import {
  FinanceReport,
  downloadFinanceExport,
  fetchFinanceReport,
} from '../../../api/admin/finance.api'
import {displayMessage} from '../../../util/global.util'
import MyPageHeader from '../../MyPageHeader'

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

const COLUMNS = [
  'Month',
  'Invoice Date',
  'Invoice Number',
  'Bill To Party',
  'City',
  'State',
  'Description',
  'Quantity/Days',
  'Rent Amount',
  'Other Charges',
  'Total',
  'Taxable Value',
  'GST',
  'Payment Remark',
]

const inr = (value: number): string =>
  value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const thClass =
  'px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'
const tdClass = 'px-3 py-2 text-sm text-gray-700 align-top'
const moneyTdClass = `${tdClass} text-right whitespace-nowrap`

/**
 * Admin finance / tax report. Lists every paid, non-cancelled order for the
 * selected month and year (keyed on invoice payment date), with the GST split
 * required for filing, and supports an .xlsx export of the same data.
 */
export const FinanceSpreadsheet: React.FC = () => {
  const now = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [report, setReport] = useState<FinanceReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const years = useMemo(() => {
    const current = now.getFullYear()
    return Array.from({length: 6}, (_, i) => current - i)
  }, [now])

  const loadReport = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchFinanceReport(month, year)
      setReport(data)
    } catch (error) {
      console.error('Failed to load finance report:', error)
      setReport(null)
    } finally {
      setIsLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    loadReport()
  }, [loadReport])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await downloadFinanceExport(month, year)
    } catch (error) {
      console.error('Failed to export finance report:', error)
      displayMessage('error', 'Failed to export report')
    } finally {
      setIsExporting(false)
    }
  }

  const rows = report?.rows ?? []
  const totals = report?.totals

  return (
    <div className="space-y-4">
      <MyPageHeader title="Finance">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || isLoading || rows.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? (
            <FaSpinner className="h-4 w-4 animate-spin" />
          ) : (
            <FaFileExcel className="h-4 w-4" />
          )}
          Export to Excel
        </button>
      </MyPageHeader>

      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Month</label>
            <select
              value={month}
              onChange={e => setMonth(parseInt(e.target.value, 10))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            >
              {MONTHS.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Year</label>
            <select
              value={year}
              onChange={e => setYear(parseInt(e.target.value, 10))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            {rows.length} invoice{rows.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map(col => (
                  <th key={col} className={thClass}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-3 py-10 text-center text-gray-400"
                  >
                    <FaSpinner className="inline h-5 w-5 animate-spin" /> Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-3 py-10 text-center text-gray-400"
                  >
                    No paid orders for {MONTHS[month - 1]} {year}.
                  </td>
                </tr>
              ) : (
                rows.map(row => (
                  <tr key={row.invoiceId} className="hover:bg-gray-50">
                    <td className={`${tdClass} whitespace-nowrap`}>{row.month}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {row.invoiceDate}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap font-medium`}>
                      {row.invoiceNumber}
                    </td>
                    <td className={tdClass}>{row.billToParty}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>{row.city}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>{row.state}</td>
                    <td className={tdClass}>{row.description}</td>
                    <td className={`${tdClass} text-right`}>{row.quantityDays}</td>
                    <td className={moneyTdClass}>{inr(row.rentAmount)}</td>
                    <td className={moneyTdClass}>{inr(row.otherCharges)}</td>
                    <td className={moneyTdClass}>{inr(row.total)}</td>
                    <td className={moneyTdClass}>{inr(row.taxableValue)}</td>
                    <td className={moneyTdClass}>{inr(row.gst)}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {row.paymentRemark}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {!isLoading && totals && rows.length > 0 && (
              <tfoot className="bg-gray-50 font-semibold text-gray-800">
                <tr>
                  <td className={tdClass} colSpan={8}>
                    Total
                  </td>
                  <td className={moneyTdClass}>{inr(totals.rentAmount)}</td>
                  <td className={moneyTdClass}>{inr(totals.otherCharges)}</td>
                  <td className={moneyTdClass}>{inr(totals.total)}</td>
                  <td className={moneyTdClass}>{inr(totals.taxableValue)}</td>
                  <td className={moneyTdClass}>{inr(totals.gst)}</td>
                  <td className={tdClass} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
