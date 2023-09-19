import { Card, Carousel, Divider, Layout } from "antd";
import Meta from "antd/lib/card/Meta";
import { IProduct } from "../../app-store/types";
import LocationShort from "../LocationShort";
import { Content } from "antd/lib/layout/layout";
import styles from "../../styles/active-product.module.css";
import { CarouselRef } from "antd/lib/carousel";
import React from "react";

interface Photo {
  path: string
}
interface MasterProduct {
  id: number,
  photos: Photo[],
  name: string
}

interface Addon {
  masterProduct: MasterProduct
}
interface ProductProps {
  addons: Addon[]
}

export const Package: React.FC<ProductProps> = ({ addons }: ProductProps) => {

  return (
    <Card style={{ marginTop: 40 }} title={"Package Includes"} hoverable>
      <Content
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {addons &&
          addons.map((addon) => {
            return (
             <Card
                key={addon?.masterProduct.id}
                hoverable
                style={{ width: 220, padding: 10, margin: 10 }}
                cover={
                  <img
                    style={{ padding: 20 }}
                    alt="example"
                    src={addon?.masterProduct?.photos[0].path}
                  />
                }
              >
                <Meta description={addon?.masterProduct.name} />
              </Card>
            );
          })}
      </Content>
    </Card>
  );
};
