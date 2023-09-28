import React from "react";
import styles from "./../styles/order-summary.module.css";
import { ORDER_STEPS } from "../config/constants";

export default function OrderSummary({ order, step, onInitRazorPay }) {
  return (
    <div className={"w-80 p-3 bg-gray-50 shadow-lg rounded-md"}>
      <div>
        <div>
          <button
            onClick={() => {onInitRazorPay(step)}}
            className="bg-[#ffd814] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffd814]"
            type="submit"
          >
            {step === ORDER_STEPS.ORDER_STEP_DELIVERY ? "Use this address" : "Place Your Order & Pay"}
          </button>
        </div>
      </div>

      {/* <div className={"flex border-gray-200 border justify-around rounded-md"}>
        <div className={"p-2 flex-col flex"}>
          <span className={""}>Starting</span>
          <span className={"text-lg"}>26/5/2023</span>
        </div>
        <div className={"p-2 flex-col flex"}>
          <span className={""}>Ending</span>
          <span className={"text-lg"}>27/5/2023</span>
        </div>
      </div> */}

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
