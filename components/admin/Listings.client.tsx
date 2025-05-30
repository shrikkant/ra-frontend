'use client'

import React, {useEffect, useState} from 'react'
import MyPageHeader from 'components/MyPageHeader'
import Input from 'components/common/form/Input'
import Loader from 'components/Loader'
import Link from 'next/link'
import _debounce from 'lodash/debounce'
import httpClient from '../../api/axios.config'
import {IProduct} from '../../app-store/types'

interface IApiResponse {
  products: IProduct[]
  totalCount: number
}

export default function Listings() {
  const PAGE_SIZE = 25
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState<IProduct[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearch = _debounce((query: string) => {
    setSearchQuery(query)
    setCurrentPage(0)
    loadListings(0, query)
  }, 500)

  const loadListings = async (page: number, query: string = '') => {
    setLoading(true)
    try {
      const response = await httpClient.get<IApiResponse>(
        `/admin/products?pageNumber=${page}&pageLimit=${PAGE_SIZE}&search=${query}`,
      )

      console.log(response.products[0])
      setListings(response.products)
    } catch (error) {
      console.error('Error loading listings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings(currentPage, searchQuery)
  }, [currentPage])

  const handleSearch = (value: string) => {
    debouncedSearch(value)
  }

  return (
    <>
      <MyPageHeader title={'Listings'}>
        <div>
          <Input onChange={handleSearch} label="Search by name" />
        </div>
      </MyPageHeader>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Category
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings &&
                listings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/p/admin/listing/${listing.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        {listing.title}
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.category.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.subCategory.title}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          listing.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {listing.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
