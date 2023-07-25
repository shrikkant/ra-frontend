import AppHeader from '../../components/header'
import { AppFooter } from '../../components/footer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchMetaData, getSearchResults, getSearchResultsAction, setSearchMetaData, setSearchResults } from '../../app-store/products/products.slice'
import Loader from '../../components/Loader'
import { fetchProducts } from '../../api/products.api'
import { useRouter } from 'next/router'
import ProductCard from "../../components/ProductCard";
import { getProductFilter } from "../../util/search.util"

import styles from "../../styles/search.module.css";
import ProductFilterNav from '../../components/ProductFilterNav'

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
    <div className="layout" style={{ minHeight: '100vh' }}>
      <AppHeader></AppHeader>

      <div style={{paddingTop:65}}>
        {loading && <Loader></Loader>}

        {!loading &&
          <div className={styles.searchContent}>
            <ProductFilterNav searchMeta={searchMeta} onChange={onChange}></ProductFilterNav>
            {/* <div className={styles.searchContent}> */}
              <div className={styles.searchGrid}>
                {searchResults && searchResults.map((product: any) => (
                  <ProductCard key={product.id} product={product}></ProductCard>
                ))}
              </div>
            {/* </div> */}
          </div>}
      </div>

      <AppFooter></AppFooter>

    </div>
  )
}




