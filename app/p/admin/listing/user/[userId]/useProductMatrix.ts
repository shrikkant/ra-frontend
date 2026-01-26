import {useState, useCallback, useMemo} from 'react'
import httpClient from '../../../../../../api/axios.config'
import {MatrixData, Product} from './types'

export function useProductMatrix(userId: string) {
  const [loading, setLoading] = useState(true)
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null)
  const [togglingKey, setTogglingKey] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    if (!matrixData?.products) return []
    if (!searchQuery.trim()) return matrixData.products

    const query = searchQuery.toLowerCase().trim()
    return matrixData.products.filter(
      product =>
        product.title?.toLowerCase().includes(query) ||
        product.masterProductName?.toLowerCase().includes(query),
    )
  }, [matrixData?.products, searchQuery])

  const loadMatrix = useCallback(async () => {
    setLoading(true)
    try {
      const response = await httpClient.get<MatrixData>(
        `/admin/users/${userId}/products-matrix`,
      )
      setMatrixData(response)
    } catch (error) {
      console.error('Error loading matrix:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const updateProduct = (productId: number, updates: Partial<Product>) => {
    setMatrixData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        products: prev.products.map(p =>
          p.id === productId ? {...p, ...updates} : p,
        ),
      }
    })
  }

  const toggleAddressLink = async (
    productId: number,
    addressId: number,
    currentlyActive: boolean,
  ) => {
    const key = `address-${productId}-${addressId}`
    setTogglingKey(key)

    try {
      await httpClient.post(`/admin/products/${productId}/address-link`, {
        addressId,
        isActive: !currentlyActive,
      })

      setMatrixData(prev => {
        if (!prev) return prev

        return {
          ...prev,
          products: prev.products.map(product => {
            if (product.id !== productId) return product

            const updatedLinks = {...product.addressLinks}
            if (!currentlyActive) {
              updatedLinks[addressId] = {linkId: 0, isActive: true}
            } else {
              delete updatedLinks[addressId]
            }

            return {...product, addressLinks: updatedLinks}
          }),
        }
      })
    } catch (error) {
      console.error('Error toggling address link:', error)
    } finally {
      setTogglingKey(null)
    }
  }

  const toggleFeatured = async (productId: number, currentFeatured: number) => {
    const key = `featured-${productId}`
    setTogglingKey(key)

    try {
      await httpClient.post(`/admin/products/${productId}/featured`, {
        featured: currentFeatured ? 0 : 1,
      })

      updateProduct(productId, {featured: currentFeatured ? 0 : 1})
    } catch (error) {
      console.error('Error toggling featured:', error)
    } finally {
      setTogglingKey(null)
    }
  }

  const isToggling = (key: string) => togglingKey === key

  return {
    loading,
    matrixData,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    loadMatrix,
    toggleAddressLink,
    toggleFeatured,
    isToggling,
  }
}
