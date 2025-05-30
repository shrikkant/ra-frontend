import React, {useState} from 'react'
import MasterProductLookup from './MasterProductLookup'
import {
  fetchMasterProducts,
  createMasterProductLink,
} from '../../../api/admin/index.api'
import {IoMdAdd} from 'react-icons/io'
import {IoMdClose} from 'react-icons/io'
import {IAddon, IMasterProduct} from '../../../app-store/types'

interface IOption {
  label: string
  value: string
}

interface IMasterProductListProps {
  productId: number
  masterProducts: IAddon[] | undefined
  onProductsChange: (products: IAddon[]) => void
}

export default function MasterProductList({
  productId,
  masterProducts = [],
  onProductsChange,
}: IMasterProductListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<IOption[]>([])

  const handleSearch = async (query: string) => {
    if (query.length < 3) return

    setLoading(true)
    try {
      const products = await fetchMasterProducts(query, 1, 10)
      const newOptions = products.map(p => ({
        label: p.name,
        value: p.id.toString(),
      }))
      setOptions(newOptions)
    } catch (error) {
      console.error('Error searching master products:', error)
    }
    setLoading(false)
  }

  const handleSelect = async (option: IOption) => {
    // Check if product is already in the list
    if (
      !masterProducts.some(p => p.masterProduct?.id.toString() === option.value)
    ) {
      try {
        const response = await createMasterProductLink([
          {
            product_id: productId,
            master_product_id: parseInt(option.value),
          },
        ])

        onProductsChange([...masterProducts, ...response])
      } catch (error) {
        console.error('Error creating master product link:', error)
      }
    }
    setIsAdding(false)
  }

  const handleRemove = (productToRemove: IAddon) => {
    onProductsChange(
      masterProducts.filter(
        p => p.masterProduct?.id !== productToRemove.masterProduct?.id,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Master Products</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            <IoMdAdd className="w-5 h-5" />
            Add Product
          </button>
        )}
      </div>

      {isAdding && (
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Add New Product</h4>
            <button
              onClick={() => setIsAdding(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </div>
          <MasterProductLookup
            name="newMasterProduct"
            label="Search Master Product"
            onChange={handleSearch}
            onSelect={handleSelect}
            options={options}
            isLoading={loading}
          />
        </div>
      )}

      <div className="space-y-2">
        {masterProducts.map((productLink, index) => (
          <div
            key={`${productLink.id}-${index}`}
            className="flex items-center justify-between p-3 bg-white border rounded-md"
          >
            <span>{productLink.masterProduct?.name}</span>
            <button
              onClick={() => handleRemove(productLink)}
              className="text-red-500 hover:text-red-700"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
