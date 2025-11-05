import React from 'react'
import {FaUserPlus, FaShoppingCart, FaChartLine, FaUsers} from 'react-icons/fa'

interface SignupStat {
  month: number
  signups: number
  add_to_cart: number
}

interface SignupSummaryProps {
  signupStats: SignupStat[]
}

export function SignupSummary({signupStats}: SignupSummaryProps) {
  const current = signupStats[0] ? Number(signupStats[0].signups) : 0
  const currentAddToCart = signupStats[0] ? Number(signupStats[0].add_to_cart) : 0
  const previous = signupStats[1] ? Number(signupStats[1].signups) : 0
  const previousAddToCart = signupStats[1] ? Number(signupStats[1].add_to_cart) : 0

  const signupGrowth = previous > 0 ? Math.round((current / previous - 1) * 100) : 0
  const totalEngaged = current + currentAddToCart
  const conversionRate = totalEngaged > 0
    ? ((current / totalEngaged) * 100).toFixed(1)
    : '0.0'

  const previousTotalEngaged = previous + previousAddToCart
  const previousConversionRate = previousTotalEngaged > 0
    ? ((previous / previousTotalEngaged) * 100).toFixed(1)
    : '0.0'

  const conversionGrowth = previousConversionRate !== '0.0'
    ? (parseFloat(conversionRate) - parseFloat(previousConversionRate)).toFixed(1)
    : '0.0'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Signups Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Signups</span>
          <FaUserPlus className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{current}</span>
          {signupGrowth !== 0 && (
            <span
              className={
                (signupGrowth > 0 ? 'text-green-600' : 'text-red-600') +
                ' text-sm font-semibold'
              }
            >
              {signupGrowth > 0 ? '+' : ''}{signupGrowth}%
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">vs {previous} last month</p>
      </div>

      {/* Add to Cart (No Signup) Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Cart (No Signup)</span>
          <FaShoppingCart className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{currentAddToCart}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">vs {previousAddToCart} last month</p>
      </div>

      {/* Conversion Rate Card - PRIMARY KPI */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-blue-900">Conversion Rate</span>
          <FaChartLine className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-900">{conversionRate}%</span>
          {conversionGrowth !== '0.0' && (
            <span
              className={
                (parseFloat(conversionGrowth) > 0 ? 'text-green-700' : 'text-red-700') +
                ' text-sm font-semibold'
              }
            >
              {parseFloat(conversionGrowth) > 0 ? '+' : ''}{conversionGrowth}pp
            </span>
          )}
        </div>
        <p className="text-xs text-blue-700 mt-1">
          {current} signups / {totalEngaged} engaged
        </p>
      </div>

      {/* Total Engaged Users Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Total Engaged</span>
          <FaUsers className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{totalEngaged}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Signups + Add to Cart
        </p>
      </div>
    </div>
  )
}
