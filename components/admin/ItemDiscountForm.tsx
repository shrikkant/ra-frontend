import { Button, Form, Input } from "antd"
import { applyDiscount } from "../../api/admin/orders.api";
import { displayMessage } from "../../util/global.util";
import { setActiveOrder } from "app-store/admin/index.slice";
import { useState } from "react";
import { IOrder } from "../../app-store/types";
import { useDispatch } from "react-redux";

type LayoutType = Parameters<typeof Form>[0]['layout'];

export function ItemDiscountForm({ item, handleItemChange }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [transactionUpdate, setTransactionUpdate] = useState({ transaction_id: item.id, discount: 0, percent: 0 });
  const [transaction, setTransaction] = useState(item);

  const handleDiscountChange = (id: number, value: string) => {
    const tr = { ...transactionUpdate };
    tr.discount = parseInt(value || "0");
    tr.percent = Math.round((tr.discount / item.original_rent) * 100);
    setTransactionUpdate(tr);
  }


  const handleSubmit = () => {
    applyDiscount(item.order_id, item.id, transactionUpdate).then((data: IOrder) => {
      handleItemChange(data.items.find((item) => (item.id == item.id)));

      displayMessage('success', 'Discount applied successfully');
      setTransaction(data.items.find((item) => (item.id == item.id)));

      dispatch(setActiveOrder(data));
    })
  }


  const handleDiscountPercent = (id: number, value: string) => {
    const transaction = { ...transactionUpdate };
    transaction.percent = parseInt(value || "0");
    transaction.discount = Math.round(item.original_rent * transaction.percent / 100);
    setTransactionUpdate(transaction);

  }

  return (<Form
    layout={"inline"}
    form={form}
    size="small"
    initialValues={{ layout: "inline" }}
    style={{ border: "1px solid #ddd", padding: 10, borderRadius: 4 }}
  >
    <Form.Item label="Discount" >
      <Input style={{ width: 80 }} type="number" placeholder="Discount" value={transactionUpdate.discount} onChange={(e) => { handleDiscountChange(item.id, e.target.value) }} />
    </Form.Item>
    <Form.Item label="%" >
      <Input style={{ width: 80 }} type="number" placeholder="Discount %" value={transactionUpdate.percent} onChange={(e) => { handleDiscountPercent(item.id, e.target.value) }} />
    </Form.Item>
    {/* <Form.Item label="Delivery" >
      <Switch checked={transactionUpdate.waiveDelivery} onChange={(checked) => handleDeliveryChange(transaction.id, checked)} />
    </Form.Item> */}
    <Form.Item style={{ textAlign: "right" }} >
      <Button onClick={handleSubmit} type="link">Apply</Button>
    </Form.Item>
  </Form>)
}

