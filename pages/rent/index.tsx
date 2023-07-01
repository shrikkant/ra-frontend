import {
  Layout,
  Checkbox,
  Slider,
  Card,
  Radio,
  Menu,
  Form,
  Pagination,
} from 'antd'

import { Content } from 'antd/lib/layout/layout'
import AppHeader from '../../components/header'
import { AppFooter } from '../../components/footer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchMetaData, getSearchResults, getSearchResultsAction, setSearchMetaData, setSearchResults } from '../../app-store/products/products.slice'
import Loader from '../../components/Loader'
import { fetchProducts } from '../../api/products.api'
import { useRouter } from 'next/router'
import ProductCard from '../../components/ProductCard'
import { getProductFilter } from "../../util/search.util"

import styles from "../../styles/search.module.css";
import ProductFilterNav from '../../components/ProductFilterNav'
import SearchPager from '../../components/SearchPager'
import React from 'react'

export default function RentSearch() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const searchResults = useSelector(getSearchResults);
  const searchMeta = useSelector(getSearchMetaData);

  const dispatch = useDispatch();
  const { q } = router.query;


  const onChange = (query) => {
    router.replace({ pathname: router.pathname, query: query });
    getSearchResultsAction(String(q), getProductFilter(query))(dispatch).then(() => {
      setLoading(false);
    });

  }

  useEffect(() => {
    console.log("Fetching <> ", router.query);
    getSearchResultsAction(String(q), getProductFilter(router.query))(dispatch).then(() => {
      setLoading(false);
    });
  }, [router.query])

  return (searchResults &&
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <AppHeader></AppHeader>

      <Content style={{paddingTop:65}}>
        {loading && <Loader></Loader>}

        {!loading &&
          <Content className={styles.searchContent}>
            <ProductFilterNav searchMeta={searchMeta} onChange={onChange}></ProductFilterNav>
            {/* <Content className={styles.searchContent}> */}
              <Content className={styles.searchGrid}>
                {searchResults && searchResults.map((product: any) => (
                  <ProductCard key={product.id} product={product}></ProductCard>
                ))}
              </Content>
            {/* </Content> */}
          </Content>}
      </Content>

      <AppFooter></AppFooter>

    </Layout>
  )
}




