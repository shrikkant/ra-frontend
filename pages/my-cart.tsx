import { Content } from "antd/lib/layout/layout";

import {
  getCart,
  setCart,
  updateDeliveryAddressAction,
} from "../app-store/user/orders/orders.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../api/user/orders.api";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import OrderSummary from "../components/OrderSummary";
import styles from "../styles/my-cart.module.css";
import { AppLayout } from "../components/AppLayout";
import { displayRazorpay } from "../util/razorpay.util";
import { selectAuthState } from "../app-store/auth/auth.slice";
import { AddressList } from "../components/AddressList";
import { Address } from "../components/Address";
import { OrderItemsReview } from "../components/order/OrderItemsReview";
import { ORDER_STEPS } from "../config/constants";

export default function Orders() {
  const cart = useSelector(getCart);
  const loggedUser = useSelector(selectAuthState);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressId, setAddressId] = useState(null);

  const dispatch = useDispatch();
  const df = Moment().format("DD MMM");

  if (!cart) {
    fetchCart().then((data) => {
      dispatch(setCart(data));
    });
  }

  const onRazorPayCheckout = (mode) => {
    const currentAddr =
      loggedUser.address.find((ad) => ad.id === addressId) || null;

    if (mode === ORDER_STEPS.ORDER_STEP_DELIVERY) {
      updateDeliveryAddressAction(cart, currentAddr)(dispatch);
    } else if (mode === ORDER_STEPS.ORDER_STEP_PAYMENT) {
      displayRazorpay(cart.id);
    }
  };

  const changeAddress = () => {
    setSelectedAddress(null);
  };

  const checkRadio = (addressId: number) => {
    setAddressId(addressId);
  };

  useEffect(() => {
    setSelectedAddress(JSON.parse(cart?.delivery_address || null));
  }, [cart]);

  return (
    <AppLayout>
      <Content className={styles.mainContent}>
        {cart && (
          <div className={"flex w-full space-x-8"}>
            <div className={"w-3/4"}>
              <div className={"border-b border-gray-300 pb-2"}>
                <div className={"flex justify-between items-center"}>
                  <div className={"flex space-x-3 text-xl font-bold"}>
                    <div>1</div>
                    <div>Delivery Address </div>
                    {selectedAddress && (
                      <Address
                        address={selectedAddress}
                        name={loggedUser.firstname + " " + loggedUser.lastname}
                      />
                    )}
                  </div>
                  <button onClick={changeAddress}>Change</button>
                </div>

                {!selectedAddress && (
                  <AddressList
                    onAddressChange={checkRadio}
                    addressList={loggedUser.address}
                    userName={
                      loggedUser?.firstname + " " + loggedUser?.lastname
                    }
                  />
                )}
              </div>

              <div className={"border-b border-gray-300 pb-2 mt-5"}>
                <div className={"flex justify-between items-center"}>
                  <div className={"flex space-x-3 text-xl font-bold"}>
                    <div>2</div>
                    <div>Review your items </div>
                  </div>
                </div>
              </div>

              {selectedAddress?.id && (
                <OrderItemsReview order={cart}></OrderItemsReview>
              )}
            </div>

            <div className={"w-1/4"}>
              <div className="fixed top-100 w-80">
                <OrderSummary
                  order={cart}
                  step={
                    selectedAddress
                      ? ORDER_STEPS.ORDER_STEP_PAYMENT
                      : ORDER_STEPS.ORDER_STEP_DELIVERY
                  }
                  onInitRazorPay={onRazorPayCheckout}
                ></OrderSummary>
              </div>
            </div>
          </div>
        )}
      </Content>
    </AppLayout>
  );
}
