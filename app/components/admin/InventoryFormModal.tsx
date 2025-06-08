import React from 'react'
import {useEffect} from 'react'
import Modal from 'components/common/Modal'
import Input from 'components/common/form/Input'
import SelectField from 'components/common/form/SelectField'
import DatePicker from '../../components/common/form/DatePicker'
import {IAddressChoice} from './Inventory.client'
import {getProductsByAddress} from 'api/user/products.api'

interface InventoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
  addressList: IAddressChoice[]
}

export default function InventoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  addressList,
}: InventoryFormModalProps) {
  const [formData, setFormData] = React.useState({
    master_product_id: '',
    address_id: '',
    serial_number: '',
    condition_status: '',
    purchase_date: '',
    last_maintenance_date: '',
    status: '',
  })
  const [productList, setProductList] = React.useState<
    {label: string; value: string}[]
  >([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    console.log('Initial Data : ', initialData)
    if (initialData) {
      setFormData({
        master_product_id: String(initialData.master_product_id),
        address_id: String(initialData.address_id),
        serial_number: initialData.serial_number || '',
        condition_status: initialData.condition_status || '',
        purchase_date: initialData.purchase_date
          ? new Date(initialData.purchase_date).toISOString().split('T')[0]
          : '',
        last_maintenance_date: initialData.last_maintenance_date
          ? new Date(initialData.last_maintenance_date)
              .toISOString()
              .split('T')[0]
          : '',
        status: String(initialData.status || ''),
      })
    }
  }, [initialData])

  useEffect(() => {
    console.log('Form Data : ', formData)
    const loadProducts = async () => {
      if (!formData.address_id || formData.address_id === '0') {
        setProductList([])
        return
      }

      setLoading(true)
      try {
        const products = await getProductsByAddress(Number(formData.address_id))
        console.log('Products : ', products)

        const formattedProducts = products.map(p => ({
          label: p.title,
          value: String(p.master_product_id),
        }))
        setProductList(formattedProducts)
      } catch (error) {
        console.error('Failed to load products:', error)
      }
      setLoading(false)
    }

    loadProducts()
  }, [formData.address_id])

  const handleInputChange = (value: string, field: string) => {
    setFormData(prev => ({...prev, [field]: value}))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData(prev => ({...prev, address_id: value}))
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData(prev => ({...prev, master_product_id: value}))
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData(prev => ({...prev, status: value}))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const processedData = {
      ...formData,
      master_product_id: Number(formData.master_product_id),
    }
    onSubmit(processedData)
  }

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Inventory' : 'Add Inventory'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label="Address"
          value={formData.address_id}
          onChange={handleAddressChange}
          choices={addressList}
        />

        <SelectField
          label="Product"
          value={formData.master_product_id}
          onChange={handleProductChange}
          choices={productList}
        />

        <Input
          label="Serial Number"
          value={formData.serial_number}
          onChange={value => handleInputChange(value, 'serial_number')}
        />

        <Input
          label="Condition Status"
          value={formData.condition_status}
          onChange={value => handleInputChange(value, 'condition_status')}
        />

        <DatePicker
          label="Purchase Date"
          value={formData.purchase_date}
          onChange={value => handleInputChange(value, 'purchase_date')}
        />

        <DatePicker
          label="Last Maintenance Date"
          value={formData.last_maintenance_date}
          onChange={value => handleInputChange(value, 'last_maintenance_date')}
        />

        <SelectField
          label="Status"
          value={formData.status}
          onChange={handleStatusChange}
          choices={[
            {label: 'Active', value: '1'},
            {label: 'Inactive', value: '0'},
          ]}
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Update' : 'Add'} Inventory
          </button>
        </div>
      </form>
    </Modal>
  )
}
