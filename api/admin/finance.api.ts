import httpClient, {getToken} from './../axios.config'
import {ENV_CONFIG} from '../../config/environment'
import {TOKEN_HEADER_KEY} from '../../config/constants'

export interface FinanceReportRow {
  invoiceId: number
  month: string
  invoiceDate: string
  invoiceNumber: string
  billToParty: string
  city: string
  state: string
  description: string
  quantityDays: number
  rentAmount: number
  otherCharges: number
  total: number
  taxableValue: number
  gst: number
  paymentRemark: string
}

export interface FinanceReportTotals {
  rentAmount: number
  otherCharges: number
  total: number
  taxableValue: number
  gst: number
}

export interface FinanceReport {
  month: number
  year: number
  rows: FinanceReportRow[]
  totals: FinanceReportTotals
}

/**
 * Fetch the finance/tax report (paid, non-cancelled orders) for a given
 * month (1-12) and year, keyed on the invoice payment date.
 */
export async function fetchFinanceReport(
  month: number,
  year: number,
): Promise<FinanceReport> {
  const report: FinanceReport = await httpClient.get(
    `/admin/finance?month=${month}&year=${year}`,
  )
  return report
}

/**
 * Download the same report as an .xlsx file. Done via a direct fetch (rather
 * than the shared httpClient) so we can stream the binary response as a blob
 * and trigger a browser download, while still sending the admin auth token.
 */
export async function downloadFinanceExport(
  month: number,
  year: number,
): Promise<void> {
  const token = await getToken()
  const base = ENV_CONFIG.CLIENT_API_URL.replace(/\/?$/, '')
  const url = `${base}/admin/finance/export?month=${month}&year=${year}`

  const response = await fetch(url, {
    headers: token ? {[TOKEN_HEADER_KEY]: token} : {},
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}`)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = `RentAcross-Finance-${year}-${String(month).padStart(2, '0')}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
