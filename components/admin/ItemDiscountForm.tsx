import React from "react";
import { applyDiscount } from "../../api/admin/orders.api";
import { setActiveOrder } from "app-store/admin/index.slice";
import { useState } from "react";
import { IOrder, IOrderItem } from "../../app-store/types";
import { useDispatch } from "react-redux";
import Input from "../common/form/Input";

export function ItemDiscountForm({ item, handleItemChange }: { item: IOrderItem, handleItemChange: (item: IOrderItem) => void }) {
  const dispatch = useDispatch();
  const [transactionUpdate, setTransactionUpdate] = useState({ transaction_id: item.id, discount: 0, percent: 0 });

  const testApplyDiscount = (percent: number, discount: number) => {
    const transaction = { ...transactionUpdate };
    transaction.percent = percent;
    transaction.discount = discount;
    const i = { ...item };
    i.applied_discount_amount = discount;
    i.rent = item.original_rent - discount;
    handleItemChange(i);

    setTransactionUpdate(transaction);
  }

  const handleDiscountChange = (value: string) => {
    const discount = parseInt(value || "0");
    const percent = Math.round((discount / item.original_rent) * 100);
    testApplyDiscount(percent, discount);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const order: IOrder = await applyDiscount(item.order_id, item.id, transactionUpdate);
    dispatch(setActiveOrder(order));
  }


  const handleDiscountPercent = (value: string) => {
    const percent = parseInt(value || "0");
    const discount = Math.round((item.original_rent * percent) / 100);
    testApplyDiscount(percent, discount);
  }

  return (<form className="w-40">
    <div className="flex gap-x-2">
      <div className="w-3/4">
        <Input label="Discount" type="number" placeholder="Discount" onChange={handleDiscountChange} />
      </div>
      <div className="w-1/4">
        <Input label="%" type="number" placeholder="Discount %" onChange={handleDiscountPercent} />
      </div>
    </div>
    {/* <Form.Item label="Delivery" >
      <Switch checked={transactionUpdate.waiveDelivery} onChange={(checked) => handleDeliveryChange(transaction.id, checked)} />
    </Form.Item> */}
    <div className="flex justify-end w-full py-2">
      <button type="button" onClick={handleSubmit} className="h-8 p-2">Apply</button>
    </div>
  </form>)
}

