'use client'
import MyPageHeader from 'components/MyPageHeader'
import React, {useEffect} from 'react'
import {
  fetchProductInventory,
  createProductInventory,
  updateProductInventory,
} from 'api/admin/index.api'
import Loader from 'components/Loader'
import _debounce from '../../../util/debounce'
import Input from '../../../components/common/form/Input'
import Link from 'next/link'
import {useSelector} from 'react-redux'
import {selectAuthState} from '../../../app-store/auth/auth.slice'
import SelectField from '../../../components/common/form/SelectField'
import InventoryFormModal from './InventoryFormModal'

interface IProductInventory {
  id: number
  user_id: number
  master_product_id: number
  address_id: number
  serial_number: string | null
  condition_status: string | null
  purchase_date: string | null
  last_maintenance_date: string | null
  status: number | null
  master_product: {
    id: number
    name: string
    brand_id: number
    category_id: number
    sub_category_id: number
  }
  address: {
    id: number
    city: string
    postal_code: string
  }
}

export interface IAddressChoice {
  label: string
  value: string
}

export default function Inventory() {
  const PAGE_SIZE = 50
  const [loading, setLoading] = React.useState(false)
  const [inventory, setInventory] = React.useState<IProductInventory[]>([])
  const [addressId, setAddressId] = React.useState<number>(0)
  const [addressList, setAddressList] = React.useState<IAddressChoice[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const [selectedInventory, setSelectedInventory] =
    React.useState<IProductInventory | null>(null)
  const loggedUser = useSelector(selectAuthState)
  const debounceFn = _debounce(handleDebounceFn, 1200)

  useEffect(() => {
    if (loggedUser && loggedUser?.address) {
      const list = loggedUser.address.map(a => {
        return {label: `${a.address_line_1}, ${a.city}`, value: String(a.id)}
      })
      list.unshift({label: 'Select Address', value: '0'})
      setAddressList(list)
    }
  }, [loggedUser])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    debounceFn(value)
  }

  function handleDebounceFn(inputValue: string) {
    if (inputValue.length < 3) {
      return
    }
    setLoading(true)
    fetchProductInventory(loggedUser.id, addressId, 0, PAGE_SIZE).then(data => {
      setInventory(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    setLoading(true)
    fetchProductInventory(loggedUser.id, addressId, 0, PAGE_SIZE).then(data => {
      setInventory(data)
      setLoading(false)
    })
  }, [addressId])

  const handleAddInventory = () => {
    setSelectedInventory(null)
    setIsModalOpen(true)
  }

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setAddressId(parseInt(value))
  }

  const handleEditInventory = (inventory: IProductInventory) => {
    setSelectedInventory(inventory)
    setIsModalOpen(true)
  }

  const handleModalSubmit = async (processedData: any) => {
    try {
      // Convert master_product_id to number

      if (selectedInventory) {
        await updateProductInventory(
          loggedUser.id,
          selectedInventory.address_id,
          selectedInventory.id,
          processedData,
        )
      } else {
        await createProductInventory(
          loggedUser.id,
          processedData.address_id,
          processedData,
        )
      }
      setIsModalOpen(false)
      // Refresh the inventory list
      setLoading(true)
      const updatedData = await fetchProductInventory(
        0,
        addressId,
        0,
        PAGE_SIZE,
      )
      setInventory(updatedData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to save inventory:', error)
      // TODO: Show error message to user
    }
  }

  return (
    <>
      <MyPageHeader title={'Product Inventory'}>
        <div className="flex gap-4">
          <SelectField
            label="Address"
            value={String(addressId)}
            onChange={handleAddressChange}
            choices={addressList}
          />
          {/* <Input onChange={handleSearch} label="Search" value={searchValue} /> */}
          <button
            onClick={handleAddInventory}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Inventory
          </button>
        </div>
      </MyPageHeader>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Serial Number</th>
                <th className="px-4 py-2">Condition</th>
                <th className="px-4 py-2">Purchase Date</th>
                <th className="px-4 py-2">Last Maintenance</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Postal Code</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory &&
                inventory.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/p/admin/inventory/${item.master_product_id}`}
                      >
                        {item.master_product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{item.serial_number || '-'}</td>
                    <td className="px-4 py-2">
                      {item.condition_status || '-'}
                    </td>
                    <td className="px-4 py-2">
                      {item.purchase_date
                        ? new Date(item.purchase_date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-2">
                      {item.last_maintenance_date
                        ? new Date(
                            item.last_maintenance_date,
                          ).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-2">{item.status || '-'}</td>
                    <td className="px-4 py-2">{item.address.city}</td>
                    <td className="px-4 py-2">{item.address.postal_code}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditInventory(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedInventory}
        addressList={addressList}
      />
    </>
  )
}
