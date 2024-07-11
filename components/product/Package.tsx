import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import { Content } from "antd/lib/layout/layout";
import React from "react";

export interface Photo {
  path: string
}
export interface MasterProduct {
  id: number,
  photos: Photo[],
  name: string
}

export interface Addon {
  masterProduct: MasterProduct
}
export interface ProductProps {
  addons: Addon[] | null
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
