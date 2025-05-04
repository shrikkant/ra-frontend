import {fetchProductBySlug, fetchProducts} from '../api/products.api'
import {useEffect, useState} from 'react'
import {IProduct} from '../app-store/types'
import {useRouter} from 'next/router'

export const useActiveProduct = (
  slug: string | string[],
): {activeProduct: IProduct} => {
  const [activeProduct, setActiveProduct] = useState<any>(null)
  useEffect(() => {
    slug &&
      fetchProductBySlug(String(slug)).then(res => {
        setActiveProduct(res)
      })
  }, [slug])

  return {activeProduct}
}
