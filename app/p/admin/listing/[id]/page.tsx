'use client'

import React, {useEffect, useState, use} from 'react'
import {useSelector} from 'react-redux'
import {
  IProduct,
  IProductCategory,
  IProductSubCategory,
  IMasterProduct,
  IAddon,
} from '../../../../../app-store/types'
import SelectField from '../../../../../components/common/form/SelectField'
import MasterProductList from '../../../../../components/common/form/MasterProductList'
import httpClient from '../../../../../api/axios.config'
import {useCategories} from '../../../../../hooks/useCategories'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function ListingDetailPage({params}: Props) {
  const resolvedParams = use(params) as {id: string}
  const [product, setProduct] = useState<IProduct | null>(null)

  const {categories} = useCategories()

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        const response = await httpClient.get(
          `/admin/products/${resolvedParams.id}`,
        )
        console.log('Product : ', response)
        setProduct(response)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }
    fetchProduct()
  }, [resolvedParams.id])

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (product) {
      setProduct({
        ...product,
        category_id: parseInt(event.target.value),
        sub_category_id: 0, // Reset subcategory when category changes
      })
    }
  }

  const handleSubCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (product) {
      setProduct({
        ...product,
        sub_category_id: parseInt(event.target.value),
      })
    }
  }

  const handleMasterProductsChange = (products: IAddon[]) => {
    if (product) {
      setProduct({
        ...product,
        masterProductList: products,
      })
    }
  }

  const getSubCategories = (categoryId: number): IProductSubCategory[] => {
    const category = categories.find(c => c.id === categoryId)
    return category?.subCategories || []
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{product.title}</h1>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <SelectField
            label="Category"
            value={product.category_id?.toString()}
            onChange={handleCategoryChange}
            choices={categories.map(c => ({
              label: c.title,
              value: String(c.id),
            }))}
          />
        </div>

        {/* Subcategory Selection */}
        <div>
          <SelectField
            label="Subcategory"
            value={product.sub_category_id?.toString()}
            onChange={handleSubCategoryChange}
            choices={getSubCategories(product.category_id).map(sc => ({
              label: sc.title,
              value: sc.id?.toString() || '',
            }))}
          />
        </div>

        {/* Master Products List */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Master Products</h2>
          {product.masterProductList?.length}

          <MasterProductList
            productId={product.id}
            masterProducts={product.masterProductList}
            onProductsChange={handleMasterProductsChange}
          />
        </div>
      </div>
    </div>
  )
}
