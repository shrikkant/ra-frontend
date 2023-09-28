import { IOrderItem } from "../../app-store/types";
import { OrderItemRow } from "../OrderItemRow";

export const OrderItemsReview = ({order}) => {
  return (
    <>
      {order.items &&
        order.items.map((item: IOrderItem) => (
          <OrderItemRow key={item.id} orderItem={item}></OrderItemRow>
        ))}
    </>
  );
};
