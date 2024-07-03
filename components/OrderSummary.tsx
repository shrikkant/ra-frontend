import React from "react";
import styles from "./../styles/order-summary.module.css";
import { ORDER_STEPS } from "../config/constants";
import { dateDisplay } from "../util/date.util";
import { IOrder } from "../app-store/types";

export default function OrderSummary({
  order,
  step,
  onInitRazorPay }:
  {
    order: IOrder,
    step: number,
    showCallToAction?: boolean,
    onInitRazorPay: (mode: number) => void
  }) {

  const callToAction = (step: number) => {
    switch (step) {
      case ORDER_STEPS.ORDER_STEP_CART:
        return "Proceed to Book";
      case ORDER_STEPS.ORDER_STEP_DELIVERY:
        return "Use this address";
      case ORDER_STEPS.ORDER_STEP_PAYMENT:
        return "Place Your Order & Pay";
    }
  }

  return (
    <div className={"p-3 bg-gray-50 shadow-lg rounded-md"}>
      <div>
        <div className="fixed md:relative bottom-0 left-0 p-4 md:p-0 bg-slate-50 w-full shadow-2xl md:shadow-none">
          {callToAction(step) && <button
            onClick={() => { onInitRazorPay(step) }}
            className="bg-[#ffd814] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffd814]"
            type="submit"
          >
            {callToAction(step)}
          </button>}
        </div>
      </div>

      <div className={"flex border-gray-200 border justify-around rounded-md mt-5"}>
        <div className={"p-2 flex-col flex"}>
          <span className={""}>Starting</span>
          <span className={"text-md font-semibold"}>{dateDisplay(order.start_date)}</span>
        </div>
        <div className={"p-2 flex-col flex"}>
          <span className={""}>Ending</span>
          <span className={"text-md font-semibold"}>{dateDisplay(order.end_date)}</span>
        </div>
      </div>

      <div
        className={"flex flex-col pt-3 gap-y-3 border-t border-gray-300 mt-5"}
      >
        <div className={"text-xl font-bold"}>Order Summary</div>
        <div className={styles["detail-row"]}>
          <div>
            Rent for <span>1</span> days
          </div>
          <div>₹{order.amount}</div>
        </div>
        <div className={styles["detail-row"]}>
          <div>Taxes</div>
          <div>₹{order.gst_tax}</div>
        </div>
        <div className={styles["detail-row"]}>
          <div>Delivery &amp; Pickup Fee</div>
          <div>₹{order.delivery_fee}</div>
        </div>

        <div
          className={
            "flex text-rose-600 font-bold justify-between text-xl border-t border-gray-300 pt-3"
          }
        >
          <div>Order Total</div>
          <div>
            <span>₹</span>
            <span>{order.total_amount}</span>
          </div>
        </div>

        {order.applied_discount && (
          <div className={"border-t border-gray-300"}>
            <div className={"text-lg pt-3 font-bold text-rose-600"}>
              <span>Your Savings : </span>
              <span>₹</span>
              <span>{order.applied_discount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
