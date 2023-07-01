"use client"
import { Affix, Button, Card, Carousel, Divider, Form, Layout, Select, Space, Tag } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { CarouselRef } from 'antd/lib/carousel'
import { Content } from 'antd/lib/layout/layout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductBySlug } from '../../../api/products.api'
import { AppFooter } from '../../../components/footer'
import AppHeader from '../../../components/header'
import LocationShort from '../../../components/LocationShort'
import Loader from '../../../components/Loader'

import styles from "./../../../styles/active-product.module.css";
import BookingForm from '../../../components/BookingForm';

const ProductPage = () => {
  const router = useRouter();
  const carouselRef = React.createRef<CarouselRef>();

  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);



  // const activeProduct = useSelector(getActiveProduct);
  const dispatch = useDispatch();

  const loadActiveProduct = () => {
    setLoading(true);
    console.log("Router Query : ", slug);
    fetchProductBySlug(String(slug)).then((res) => {
      setLoading(false);
      setActiveProduct(res);
    });
  };

  useEffect(() => {
    router.isReady && loadActiveProduct();
  }, [router.isReady]);

  return activeProduct && (<Layout className="layout">
    <AppHeader></AppHeader>

    <Content style={{ background: '#fff', minHeight: '100vh', display: 'flex', paddingTop: 100 }}>

      {loading && <Loader></Loader>}

      {!loading && <Content style={{ maxWidth: 1240, margin: 'auto', }}>
        <Content className={styles.sbsContent}>

          <Content style={{ flex: '2', padding: '0px 20px' }}>
            <Card >
              <Meta title={activeProduct.title} description={<LocationShort location={activeProduct.location}></LocationShort>}></Meta>
              <Divider />
              <Content className={styles.imageSection}>
                <div className={styles.imageIcons}>
                  {
                    activeProduct.photos && activeProduct.photos.map((photo, index) => {
                      return (
                        <div key={index} style={{ textAlign: 'center', cursor: 'pointer' }}
                          onClick={() => { carouselRef.current?.goTo(index) }}>
                          <img style={{ height: 40, width: 'auto' }} src={photo.path}></img>
                        </div>)
                    })
                  }
                </div>

                <div style={{ flex: 5 }}>
                  <Carousel dotPosition={"left"} ref={carouselRef}>
                    {
                      activeProduct.photos && activeProduct.photos.map((photo, i) => {
                        return (<div key={i}><img className={styles.carouselImg} src={photo.path}></img></div>)
                      })
                    }
                  </Carousel>
                </div>

              </Content>
            </Card>




            <Card
              style={{ marginTop: 40 }}
              title={"Package Includes"}
              hoverable
            >

              <Content
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}>

                {
                  activeProduct.masterProductList && activeProduct.masterProductList.map((addon) => {


                    return (<Card
                      key={addon?.masterProduct.id}
                      hoverable
                      style={{ width: 220, padding: 10, margin: 10 }}
                      cover={<img style={{ padding: 20 }} alt="example" src={addon?.masterProduct?.photos[0].path} />}
                    >
                      <Meta description={addon?.masterProduct.name} />
                    </Card>)
                  })
                }


              </Content>

            </Card>

            <Card
              title={"Product Specifications"}
              hoverable
              style={{ width: '100%', marginTop: '40px' }}
            >
              <Content dangerouslySetInnerHTML={{ __html: activeProduct?.masterProduct?.description }}>

              </Content>
            </Card>
          </Content>

          <Content style={{ maxWidth: '320px' }}>
            <div style={{ position: "fixed", top: 100 }}>

              <BookingForm rates={activeProduct?.rates}></BookingForm>
            </div>
          </Content>

        </Content>
      </Content>}

    </Content>

    <AppFooter></AppFooter>
  </Layout>)
}

export default ProductPage;
