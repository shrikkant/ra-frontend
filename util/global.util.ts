import {toast} from 'react-toastify'

/**
 * Formats a number as Indian currency (₹).
 * Handles null/undefined/string values safely.
 * Uses Indian numbering system (lakhs, crores).
 *
 * @param value - The number to format (can be number, string, null, or undefined)
 * @param showSymbol - Whether to include the ₹ symbol (default: true)
 * @returns Formatted currency string (e.g., "₹1,23,456")
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  showSymbol: boolean = true,
): string => {
  const numericValue = Number(value) || 0
  const formatted = numericValue.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
  return showSymbol ? `₹${formatted}` : formatted
}

export const resolveOrderStage = (status: number) => {
  switch (status) {
    case 0:
      return 'Leads'
    case 1:
      return 'Paid'
    case 2:
      return 'Approved'
    case 3:
      return 'In Progress'
    case 4:
      return 'Completed'
    case 97:
      return 'Owner Cancelled'
    case 98:
      return 'Renter Cancelled'
  }
}

export const enum OrderStages {
  Leads = 0,
  Paid = 1,
  Approved = 2,
  InProgress = 3,
  Completed = 4,
  OwnerCancelled = 97,
  RenterCancelled = 98,
}

export const capitalize = str => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
export const displayMessage = (type: string, text: string) => {
  switch (type) {
    case 'success':
      toast.success(text)
      break
    case 'error':
      toast.error(text)
      break
    case 'warning':
      toast.warning(text)
      break
    case 'info':
      toast.info(text)
      break
  }
  return
}
