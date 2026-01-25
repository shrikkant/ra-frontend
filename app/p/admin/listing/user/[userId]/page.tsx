'use client'

import React, {useEffect, use} from 'react'
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
        <div className="text-sm text-gray-500">
          {matrixData.totalProducts} products | {matrixData.totalCities} cities
        </div>
      </MyPageHeader>

      <ProductMatrixTable
        matrixData={matrixData}
        onToggleFeatured={toggleFeatured}
        onToggleAddress={toggleAddressLink}
        isToggling={isToggling}
      />
    </div>
  )
}
