import React from "react";
import { ILocation, IOrder, IOrderItem } from "../../app-store/types";
import OrderItemRow from "../OrderItemRow";

import { StepHeader } from "./StepHeader";

export const OrderItemsReview = ({ order, selectedAddress }: { order: IOrder, selectedAddress: ILocation | null }) => {
  return (
    <>
      <StepHeader label={"Review your items"} index={2}></StepHeader>

      {selectedAddress?.id && (
        <div className={"border rounded-md border-gray-400 ml-8 mt-3"}>
          {order.items &&
            order.items.map((item: IOrderItem) => (
              <OrderItemRow key={item.id} orderItem={item}></OrderItemRow>
            ))}
        </div>
      )}
    </>
  );
};
