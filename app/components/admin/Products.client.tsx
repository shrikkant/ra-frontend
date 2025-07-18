'use client'
import MyPageHeader from 'components/MyPageHeader'

import React, {useEffect} from 'react'

import BulkUpload from 'components/admin/BulkUpload'
import AISyncSection from 'components/admin/AISyncSection'
import {fetchMasterProducts, syncProductWithAI} from 'api/admin/index.api'
import {IMasterProduct} from 'app-store/types'
import Loader from 'components/Loader'
import _debounce from 'lodash/debounce'
import {FaRobot} from 'react-icons/fa'

// import COUNTRIES from "config/constants";
import Input from '../../../components/common/form/Input'
import Link from 'next/link'

export default function Products() {
  const PAGE_SIZE = 50
  const [loading, setLoading] = React.useState(false)
  const [products, setProducts] = React.useState<IMasterProduct[]>([])
  const [syncingProducts, setSyncingProducts] = React.useState<Set<number>>(
    new Set(),
  )
  const debounceFn = _debounce(handleDebounceFn, 1200)

  const handleSearch = (value: string) => {
    debounceFn(value)
  }

  function handleDebounceFn(inputValue: string) {
    if (inputValue.length < 3) {
      return
    }

    setLoading(true)
    fetchMasterProducts(inputValue, 0, PAGE_SIZE).then(data => {
      setProducts(data)
      setLoading(false)
    })
  }

  const handleAISync = async (productId: number) => {
    setSyncingProducts(prev => new Set(prev).add(productId))
    try {
      await syncProductWithAI(productId)
      // Optionally refresh the product list or show success message
    } catch (error) {
      console.error(`AI sync failed for product ${productId}:`, error)
      // Optionally show error message
    } finally {
      setSyncingProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchMasterProducts('', 0, PAGE_SIZE).then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <MyPageHeader title={'Products'}>
        <div>
          <Input onChange={handleSearch} label="Search" />
        </div>
      </MyPageHeader>

      <BulkUpload />

      <AISyncSection />

      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* <div>

            <div className="flex gap-x-3">
              {COUNTRIES.map((c: any) => {
                return c.locations.map((l, i) => {
                  return (
                    <div key={i}>
                      {l}
                    </div>
                  );
                });
              })}
            </div>
          </div> */}

          <table>
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Sub Category</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">AI Sync</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.brand_id}</td>
                    <td className="px-4 py-2">{p.category_id}</td>
                    <td className="px-4 py-2">{p.sub_category_id}</td>
                    <td className="px-4 py-2">
                      <Link href={`/p/admin/products/${p.id}`}>{p.name}</Link>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleAISync(p.id)}
                        disabled={syncingProducts.has(p.id)}
                        className={`p-2 rounded-md transition-colors ${
                          syncingProducts.has(p.id)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        title="Sync product details with AI"
                      >
                        <FaRobot className="w-4 h-4" />
                      </button>
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
