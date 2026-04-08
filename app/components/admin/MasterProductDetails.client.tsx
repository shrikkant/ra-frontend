'use client'

import MyPageHeader from 'components/MyPageHeader'

import React, {useEffect, useState} from 'react'

import {ILocation, IMasterProduct, IUser} from '../../../app-store/types'
import {fetchMasterProduct} from '../../../api/admin/index.api'
import {adminListNewProduct} from '../../../api/admin/index.api'
import {fetchCustomers, fetchActiveCustomer} from '../../../api/admin/customers.api'
import {Section} from '../common/Section'
import Input from '../../../components/common/form/Input'
import {Button} from '@headlessui/react'
import SelectField from '../../../components/common/form/SelectField'

interface CustomerDetailsProps {
  id: string
}

interface IAddressChoice {
  label: string
  value: string
}

export default function MasterProductDetails({id}: CustomerDetailsProps) {
  const [masterProduct, setMasterProduct] = useState<IMasterProduct>()
  const [perDayRate, setPerDayRate] = useState<number>(0)
  const [addressId, setAddressId] = useState<number>(0)
  const [addressList, setAddressList] = useState<IAddressChoice[]>([])

  const [userSearchQuery, setUserSearchQuery] = useState<string>('')
  const [userResults, setUserResults] = useState<IUser[]>([])
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  useEffect(() => {
    if (id && !masterProduct) {
      const productId = parseInt(String(id))
      fetchMasterProduct(productId).then((product: IMasterProduct) => {
        setMasterProduct(product)
      })
    }
  }, [id])

  const handleUserSearch = async (value: string) => {
    setUserSearchQuery(value)
    if (value.length < 3) {
      setUserResults([])
      return
    }
    setSearchLoading(true)
    try {
      const results = await fetchCustomers(value)
      const filtered = results.filter(
        (u: IUser) => u.role === 'P' || u.role === 'A',
      )
      setUserResults(filtered)
    } catch (e) {
      console.error('Error searching users:', e)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectUser = async (user: IUser) => {
    setSelectedUser(user)
    setUserResults([])
    setUserSearchQuery('')
    setAddressId(0)
    setAddressList([])

    try {
      const fullUser = await fetchActiveCustomer(user.id)
      if (fullUser?.address && fullUser.address.length > 0) {
        const list = fullUser.address.map((a: ILocation) => ({
          label: a.address_line_1 + (a.city ? ', ' + a.city : ''),
          value: String(a.id),
        }))
        list.unshift({label: 'Select Address', value: '0'})
        setAddressList(list)
      }
    } catch (e) {
      console.error('Error fetching user addresses:', e)
    }
  }

  const handleClearUser = () => {
    setSelectedUser(null)
    setAddressList([])
    setAddressId(0)
  }

  const handlePerDayRateChange = (value: string) => {
    const rate = parseInt(value)
    setPerDayRate(rate)
  }

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setAddressId(parseInt(value))
  }

  const addNewListing = async () => {
    if (masterProduct && selectedUser && addressId > 0) {
      await adminListNewProduct(selectedUser.id, masterProduct, perDayRate, addressId)
    }
  }

  return (
    <>
      <MyPageHeader title={'Products'}></MyPageHeader>

      {masterProduct?.id && (
        <Section title={masterProduct.name}>
          <div className="w-96 flex flex-col gap-y-4 m-auto">
            {/* User Search */}
            <div>
              {selectedUser ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                  <span className="text-sm font-medium text-green-800">
                    {selectedUser.firstname} {selectedUser.lastname} ({selectedUser.phone})
                  </span>
                  <button
                    onClick={handleClearUser}
                    className="text-red-500 text-xs hover:underline ml-2"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    label="Search User (Partner)"
                    placeholder="Search by name, phone, email..."
                    onChange={handleUserSearch}
                    value={userSearchQuery}
                    loading={searchLoading}
                  />
                  {userResults.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto mt-1">
                      {userResults.map((user) => (
                        <li
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-b-0"
                        >
                          <span className="font-medium">
                            {user.firstname} {user.lastname}
                          </span>
                          <span className="text-gray-500 ml-2">{user.phone}</span>
                          {user.city && (
                            <span className="text-gray-400 ml-2">- {user.city}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <Input label="Per day rent" onChange={handlePerDayRateChange} />
            </div>
            <div>
              <SelectField
                choices={addressList}
                onChange={handleAddressChange}
                label="Select Address"
              ></SelectField>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={addNewListing}
                type="button"
                disabled={!selectedUser || addressId === 0}
              >
                Add Product
              </Button>
            </div>
          </div>
        </Section>
      )}
    </>
  )
}
