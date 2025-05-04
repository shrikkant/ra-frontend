import {useEffect} from 'react'
import {
  getSearchResultsAction,
  getSearchResults,
  setSearchResults,
  setSearchMetaData,
} from '../app-store/products/products.slice'
import {getProductFilter} from '../util/search.util'
import {useRouter} from 'next/router'
import {useDispatch, useSelector} from 'react-redux'
import {getCategories} from '../app-store/app-defaults/app-defaults.slice'

import {IDefaultSearch} from '../app-store/app-defaults/types'
import {getDefaultSearch} from '../app-store/session/session.slice'

export const useProducts = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const {query} = router
  const {q} = query
  const products = useSelector(getSearchResults)
  const categories = useSelector(getCategories)
  const defaultSearch = useSelector<IDefaultSearch>(
    getDefaultSearch,
  ) as IDefaultSearch

  useEffect(() => {
    dispatch(setSearchResults(null))
    dispatch(setSearchMetaData(null))

    const queryString = q ? String(q) : ''
    try {
      const filter = categories ? getProductFilter(query, categories) : null
      if (!filter) {
        return
      }

      filter.city = !filter.city ? defaultSearch?.location?.city : filter.city

      if (filter && filter.city) {
        !filter.product && getSearchResultsAction(queryString, filter)(dispatch)
      }
    } catch (e) {
      console.log(e)
    }
  }, [router.query, categories, defaultSearch])

  return {products}
}
