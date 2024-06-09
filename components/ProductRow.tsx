import { Card, Space, Statistic } from "antd";
import { Content } from "antd/lib/layout/layout";
import { IProductRatePlan } from "../app-store/types";
import React from "react";



export default function ProductRow({product}) {
  return (<Card key={product.id} title={product.title} className="r-comp">
    <Card.Grid style={{width:'25%'}}>
      <div>
        {product.photos.length  }
        <img src={product.photos[0]?.path}></img>
      </div>
    </Card.Grid>
    <Card.Grid hoverable={false} style={{width:'75%'}}>
      <Content style={{ display: 'flex' }}>
        <Space size={[10, 20]} direction="horizontal">

          {product.rates && product.rates.map((rate: IProductRatePlan, index) => (
            <Card key={product.id + '-' + index} style={{ padding: '20px' }}>
              <Statistic
                title={rate.duration}
                value={rate.rate}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix="&#8377;"
                suffix="/day"
              />
            </Card>
          ))}
        </Space>
      </Content>

    </Card.Grid>
  </Card>)
}
