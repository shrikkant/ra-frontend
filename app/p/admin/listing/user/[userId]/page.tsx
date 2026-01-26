'use client'

import React, {useEffect, use} from 'react'
import {FaSearch} from 'react-icons/fa'
import MyPageHeader from 'components/MyPageHeader'
import Loader from 'components/Loader'
import {useProductMatrix} from './useProductMatrix'
import ProductMatrixTable from './components/ProductMatrixTable'

interface Props {
  params: Promise<{userId: string}>
}

export default function UserListingMatrixPage({params}: Props) {
  const {userId} = use(params) as {userId: string}
  const {
    loading,
    matrixData,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    loadMatrix,
    toggleAddressLink,
    toggleFeatured,
    isToggling,
  } = useProductMatrix(userId)

  useEffect(() => {
    loadMatrix()
  }, [loadMatrix])

  if (loading) {
    return (
      <div className="p-6">
        <MyPageHeader title="Product Matrix" />
        <Loader />
      </div>
    )
  }

  if (!matrixData) {
    return (
      <div className="p-6">
        <MyPageHeader title="Product Matrix" />
        <p className="text-gray-500">Failed to load data</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <MyPageHeader title={`Product Matrix (User #${matrixData.userId})`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-48"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredProducts.length} of {matrixData.totalProducts} products |{' '}
            {matrixData.totalCities} cities
          </div>
        </div>
      </MyPageHeader>

      <ProductMatrixTable
        matrixData={{...matrixData, products: filteredProducts}}
        onToggleFeatured={toggleFeatured}
        onToggleAddress={toggleAddressLink}
        isToggling={isToggling}
      />
    </div>
  )
}
