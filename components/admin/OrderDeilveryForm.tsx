import React from "react";
import { IOrder } from "../../app-store/types";
import { DeliveryAssignmentForm } from "./DeliveryAssignmentForm";

export const OrderDeliveryForm = ({ order }: { order: IOrder }) => {
  console.log("order", order.delivery);
  const { customer_address } = order.delivery || {};
  const { items } = order.delivery || {};
  return (
    <div>
      <div>
        <DeliveryAssignmentForm order={order} />
      </div>
      {customer_address && <div>
        <h2 className="font-semibold border-b border-gray-200 py-2 my-2">Customer Address:</h2>

        <div>{customer_address.address_line_1}</div>
        <div>{customer_address.address_line_2}, {customer_address.city}, {customer_address.postal_code}</div>
      </div>}

      {items && <div>
        <h2 className="font-semibold border-b border-gray-200 py-2 my-2">Store Address:</h2>

        {items.map((item, index) => {
          const { store_address } = item;
          return <div key={index} className="my-2">
            <div>{store_address.address_line_1}</div>
            <div>{store_address.address_line_2} {store_address.city}, {store_address.postal_code}</div>
          </div>
        })}

      </div>}
    </div>
  );

}
