
import {
  Card,
  Carousel,
  Divider,
  Layout,

} from "antd";
import Meta from "antd/lib/card/Meta";
import { IProduct } from "../../app-store/types";
import LocationShort from "../LocationShort";
import { Content } from "antd/lib/layout/layout";
import styles from "../../styles/active-product.module.css";
import { CarouselRef } from 'antd/lib/carousel'
import React from "react";

interface ProductProps {
  product: IProduct;
}

export const HeadCard: React.FC<ProductProps> = ({ product }: ProductProps) => {
  const carouselRef = React.createRef<CarouselRef>();

  return (
    <Card>
      <Meta
        title={product.title}
        description={
          <LocationShort location={product.location}></LocationShort>
        }
      ></Meta>
      <Divider />
      <Content className={styles.imageSection}>
        <div className={styles.imageIcons}>
          {product.photos &&
            product.photos.map((photo, index) => {
              return (
                <div
                  key={index}
                  style={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => {
                    carouselRef.current?.goTo(index);
                  }}
                >
                  <img
                    style={{ height: 40, width: "auto" }}
                    src={photo.path}
                  ></img>
                </div>
              );
            })}
        </div>

        <div style={{ flex: 5 }}>
          <Carousel dotPosition={"left"} ref={carouselRef}>
            {product.photos &&
              product.photos.map((photo, i) => {
                return (
                  <div key={i}>
                    <img className={styles.carouselImg} src={photo.path}></img>
                  </div>
                );
              })}
          </Carousel>
        </div>
      </Content>
    </Card>
  );
};
