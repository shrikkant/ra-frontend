import {DISCOUNT_STEPS} from '../../config/constants'

export const getDays = (storeSearch: any): number => {
  const startDate =
    storeSearch && storeSearch.dates
      ? new Date(storeSearch?.dates.startDate)
      : new Date()
  const endDate =
    storeSearch && storeSearch.dates
      ? new Date(storeSearch.dates.endDate)
      : new Date()

  // Calculate the difference in days and add 1 to include both start and end dates
  const diffTime = endDate.getTime() - startDate.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return Math.floor(diffDays) + 1
}

export const getPlural = (text: string, days: number): string => {
  return text + (days > 1 ? 's' : '')
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export const calculateFinalDiscount = (
  baseDiscount: number,
  days: number,
): number => {
  const discountStep = DISCOUNT_STEPS.find(step => step.days <= days)
  if (discountStep) {
    return baseDiscount + discountStep.discount
  }
  return baseDiscount
}

export const calculateDiscountedRate = (
  originalRate: number,
  finalDiscount: number,
): number => {
  return Math.ceil(originalRate - (originalRate * finalDiscount) / 100)
}

export const calculateSavings = (
  originalRate: number,
  discountedRate: number,
  days: number,
): number => {
  return (originalRate - discountedRate) * days
}
