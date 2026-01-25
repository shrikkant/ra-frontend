'use client'

import React, {useEffect, useState, use, useCallback} from 'react'
import MyPageHeader from 'components/MyPageHeader'
import Loader from 'components/Loader'
import httpClient from '../../../../../../api/axios.config'

interface Address {
  id: number
  city: string
  state: string
  landmark: string
  display: string
  is_verified: boolean
}

interface City {
  city: string
  addresses: Address[]
}

interface Product {
  id: number
  title: string
  rate: number | null
  status: number
  masterProductId: number | null
  masterProductName: string | null
  addressLinks: Record<number, {linkId: number; isActive: boolean}>
}

interface MatrixData {
  userId: number
  cities: City[]
  products: Product[]
  totalProducts: number
  totalCities: number
}

interface Props {
  params: Promise<{
    userId: string
  }>
}

const STATUS_LABELS: Record<number, {label: string; color: string}> = {
  0: {label: 'Pending', color: 'bg-yellow-100 text-yellow-800'},
  1: {label: 'Active', color: 'bg-green-100 text-green-800'},
  2: {label: 'Draft', color: 'bg-gray-100 text-gray-800'},
  3: {label: 'Disabled', color: 'bg-red-100 text-red-800'},
  4: {label: 'Rejected', color: 'bg-red-100 text-red-800'},
}

export default function UserListingMatrixPage({params}: Props) {
  const resolvedParams = use(params) as {userId: string}
  const [loading, setLoading] = useState(true)
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const loadMatrix = useCallback(async () => {
    setLoading(true)
    try {
      const response = await httpClient.get<MatrixData>(
        `/admin/users/${resolvedParams.userId}/products-matrix`,
      )
      setMatrixData(response)
    } catch (error) {
      console.error('Error loading matrix:', error)
    } finally {
      setLoading(false)
    }
  }, [resolvedParams.userId])

  useEffect(() => {
    loadMatrix()
  }, [loadMatrix])

  const handleToggle = async (
    productId: number,
    addressId: number,
    currentlyActive: boolean,
  ) => {
    const key = `${productId}-${addressId}`
    setToggling(key)

    try {
      await httpClient.post(`/admin/products/${productId}/address-link`, {
        addressId,
        isActive: !currentlyActive,
      })

      // Update local state
      setMatrixData(prev => {
        if (!prev) return prev

        const updatedProducts = prev.products.map(product => {
          if (product.id !== productId) return product

          const updatedLinks = {...product.addressLinks}
          if (!currentlyActive) {
            // Enabling
            updatedLinks[addressId] = {linkId: 0, isActive: true}
          } else {
            // Disabling
            delete updatedLinks[addressId]
          }

          return {...product, addressLinks: updatedLinks}
        })

        return {...prev, products: updatedProducts}
      })
    } catch (error) {
      console.error('Error toggling link:', error)
    } finally {
      setToggling(null)
    }
  }

  const isAddressLinked = (product: Product, addressId: number): boolean => {
    return !!product.addressLinks[addressId]
  }

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

  // Flatten all addresses from all cities for the columns
  const allAddresses = matrixData.cities.flatMap(city => city.addresses)

  return (
    <div className="p-6">
      <MyPageHeader title={`Product Matrix (User #${matrixData.userId})`}>
        <div className="text-sm text-gray-500">
          {matrixData.totalProducts} products | {matrixData.totalCities} cities
        </div>
      </MyPageHeader>

      {matrixData.products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found for this user
        </div>
      ) : matrixData.cities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No addresses found for this user. Add addresses first.
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[320px]">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[80px]">
                  Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[80px]">
                  Status
                </th>
                {allAddresses.map(address => (
                  <th
                    key={address.id}
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[120px]"
                    title={address.display || address.landmark}
                  >
                    <div>{address.city}</div>
                    <div className="text-[10px] font-normal normal-case truncate max-w-[100px]">
                      {address.id}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matrixData.products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white px-4 py-3 border-r min-w-[320px]">
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                    {product.masterProductName && (
                      <div className="text-xs text-gray-500">
                        {product.masterProductName}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      ID: {product.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r text-sm text-gray-500">
                    {product.rate ? `₹${product.rate}` : '-'}
                  </td>
                  <td className="px-4 py-3 border-r">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        STATUS_LABELS[product.status]?.color ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {STATUS_LABELS[product.status]?.label || 'Unknown'}
                    </span>
                  </td>
                  {allAddresses.map(address => {
                    const isLinked = isAddressLinked(product, address.id)
                    const isToggling =
                      toggling === `${product.id}-${address.id}`

                    return (
                      <td
                        key={address.id}
                        className="px-4 py-3 text-center border-r"
                      >
                        <button
                          onClick={() =>
                            handleToggle(product.id, address.id, isLinked)
                          }
                          disabled={isToggling}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isToggling
                              ? 'bg-gray-200 cursor-wait'
                              : isLinked
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-400'
                          }`}
                          title={
                            isLinked
                              ? 'Click to disable'
                              : 'Click to enable'
                          }
                        >
                          {isToggling ? (
                            <span className="animate-spin text-xs">...</span>
                          ) : isLinked ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span className="text-lg">-</span>
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
