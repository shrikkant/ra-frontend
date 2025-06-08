'use client'
import MyPageHeader from 'components/MyPageHeader'

import React, {useEffect} from 'react'

import BulkUpload from 'components/admin/BulkUpload'
import {fetchMasterProducts} from 'api/admin/index.api'
import {IMasterProduct} from 'app-store/types'
import Loader from 'components/Loader'
import _debounce from 'lodash/debounce'

// import COUNTRIES from "config/constants";
import Input from '../../../components/common/form/Input'
import Link from 'next/link'

export default function Products() {
  const PAGE_SIZE = 50
  const [loading, setLoading] = React.useState(false)
  const [products, setProducts] = React.useState<IMasterProduct[]>([])
  const debounceFn = _debounce(handleDebounceFn, 1200)

  const handleSearch = (value: string) => {
    debounceFn(value)
  }

  function handleDebounceFn(inputValue: string) {
    if (inputValue.length < 3) {
      return
    }
    console.log('Debounce : ', inputValue)
    setLoading(true)
    fetchMasterProducts(inputValue, 0, PAGE_SIZE).then(data => {
      setProducts(data)
      console.log('Products : ', data)
      setLoading(false)
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchMasterProducts('', 0, PAGE_SIZE).then(data => {
      setProducts(data)
      console.log('Products : ', data)
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
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
