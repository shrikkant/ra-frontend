'use client'

import React, {useEffect, useState} from 'react'
import {fetchSignupStats} from '../../../api/admin/index.api'
import {SignupSummary} from '../../../components/admin/SignupSummary'

interface SignupStat {
  month: number
  signups: number
  add_to_cart: number
}

export default function StatsClient() {
  const [signupStats, setSignupStats] = useState<SignupStat[] | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetchSignupStats()
      setSignupStats(response)
    } catch (error) {
      console.error('Error fetching signup stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!signupStats) {
      fetchData()
    }
  }, [signupStats])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Key performance indicators and analytics
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : signupStats && signupStats.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Signup Conversion Metrics
            </h2>
            <SignupSummary signupStats={signupStats} />
          </div>

          {/* Placeholder for future dashboard sections */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Analytics
            </h2>
          </div> */}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No data available</p>
        </div>
      )}
    </div>
  )
}
