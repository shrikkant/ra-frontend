import React from "react";
import styles from "./../styles/order-summary.module.css";

export default function OrderSummary() {
  return (
    <div className={styles.summaryBox}>
      <div className="display: flex;margin-bottom:20px;">
        <span>
          <div className={styles.price}>
            <div>
              <span className={styles.discount} aria-hidden="true">
                -10%
              </span>
              <span>
                <span className="currency lg">₹</span>
                <span className="amount lg">1,833</span>
                <span className="postfix ng-hide"></span>
              </span>
            </div>
            <div></div>
          </div>
        </span>
      </div>

      <div className={styles["date-range-box"]}>
        <div className={styles["start"]}>
          <span className={styles["label"]}>Starting</span>
          <span className={styles["date"]}>26/5/2023</span>
        </div>
        <div className={styles["end"]}>
          <span className={styles["label"]}>Ending</span>
          <span className={styles["date"]}>27/5/2023</span>
        </div>
      </div>

      <div className={styles.summarySection}>
        <div>
          <b>Order Summary</b>
        </div>
        <div className={styles["detail-row"]}>
          <div>
            Rent for <span>1</span> days
          </div>
          <div>₹1299</div>
        </div>
        <div className={styles["detail-row"]}>
          <div>Taxes</div>
          <div>₹234</div>
        </div>
        <div className={styles["detail-row"]}>
          <div>Delivery &amp; Pickup Fee</div>
          <div>₹300</div>
        </div>

        <div className={styles["detail-row"] + " " + styles["total-row"]}>
          <div>
            <h5>
              <b>Total</b>
            </h5>
          </div>
          <div className="order-total-amount">
            <h5>
              <span>₹</span>
              <span>1833</span>
            </h5>
          </div>
        </div>
        <div>
          <div>
            <input
              className="bg-[#ffd814] w-full py-2 rounded-md text-[#555] font-bold cursor-pointer hover:bg-[#ffd814]"
              type="submit"
              value="Checkout"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
