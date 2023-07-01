import { Button, Card, Form, Space, Tag } from "antd"
import React from "react"

import styles from "./../styles/active-product.module.css";

export default function BookingForm({rates}) {
  const nodeRef = React.useRef(null);
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (<Card
    title={"Rent Plans"}
    hoverable>
    <Space size={[10, 20]} direction="horizontal">
      {rates && rates.map((rate, i) => {
        return <Tag key={i} color="cyan" style={{ border: '1px solid #eee', textAlign: 'center', padding: '8px', }}>
          <div style={{ fontSize: '13px' }}>{"₹" + rate.rate}/ day</div>
          <div style={{ fontSize: '12px' }}>{rate.durationDisplay}</div>
        </Tag>
      })}
    </Space>

    <Form
      name="normal_login"
      className={styles.bookingForm}
      initialValues={{ remember: true }}
      onFinish={onFinish}>

      <Form.Item>

        <Button block type="primary">Book</Button>
      </Form.Item>

    </Form>
  </Card>)
}
