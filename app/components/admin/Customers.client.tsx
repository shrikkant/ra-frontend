/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, {useState} from 'react'
import {FaSearch, FaUser} from 'react-icons/fa'

import {SignupSummary} from '../../../components/admin/SignupSummary'
import {CustomerCard} from '../../../components/admin/CustomerCard'
import Loader from 'components/Loader'
import MyPageHeader from 'components/MyPageHeader'
import {useCustomers} from '../../../hooks/useCustomers'
import {IUser} from '../../../app-store/types'

// Types
interface Customer {
  id: number
  firstname: string
  lastname: string
  email_address: string
  phone?: string
  city?: string
  profile_pic?: string
  verified?: number
}

interface CustomerSearchProps {
  onSearch: (phone: string) => void
}

interface CustomerListProps {
  customers: IUser[]
  onAdminLogin: (customerId: number) => void
  onVisitProfile: (customerId: number) => void
}

// Customer Search Component
const CustomerSearch: React.FC<CustomerSearchProps> = ({onSearch}) => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (value.length >= 10) {
      onSearch(value)
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="tel"
        value={searchValue}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search by phone number..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
      />
    </div>
  )
}

// Customer List Component
const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onAdminLogin,
  onVisitProfile,
}) => {
  if (!customers || customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <FaUser className="h-12 w-12" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No customers found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {customers.map(customer => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onAdminLogin={onAdminLogin}
          onVisitProfile={onVisitProfile}
        />
      ))}
    </div>
  )
}

// Main Customers Component
export default function Customers() {
  const {
    customers,
    loading,
    error,
    signupStats,
    searchCustomersByPhone,
    loginAsCustomer,
    visitCustomerProfile,
  } = useCustomers()

  return (
    <div className="space-y-6">
      <MyPageHeader title="Customers">
        <CustomerSearch onSearch={searchCustomersByPhone} />
      </MyPageHeader>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <CustomerList
          customers={customers}
          onAdminLogin={loginAsCustomer}
          onVisitProfile={visitCustomerProfile}
        />
      )}
    </div>
  )
}
