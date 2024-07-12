import { Content } from "antd/lib/layout/layout";
import {
  getCart,
  setCart,
  updateDeliveryAddressAction,
} from "app-store/user/orders/orders.slice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "api/user/orders.api";
import React, { useEffect, useState } from "react";
import OrderSummary from "components/OrderSummary";
import styles from "styles/my-cart.module.css";
import { displayRazorpay } from "util/razorpay.util";
import { authUser, selectAuthState } from "app-store/auth/auth.slice";
import { OrderItemsReview } from "components/order/OrderItemsReview";
import { ORDER_STEPS } from "config/constants";
import { AddressPicker } from "components/order/AddressPicker";
import EmptyCart from "components/cart/EmptyCart";
import Loader from "components/Loader";
import { getAuthUser } from "../../../../api/auth.api";

export default function Orders() {
  const cart: any = useSelector(getCart);
  const loggedUser: any = useSelector(selectAuthState);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressId, setAddressId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const onRazorPayCheckout = (mode: number) => {
    const currentAddr = loggedUser?.address.find(
      (ad) => ad.id === addressId
    ) || { id: -1, name: "Store Pickup" };

    if (mode === ORDER_STEPS.ORDER_STEP_DELIVERY) {
      updateDeliveryAddressAction(cart, currentAddr)(dispatch);
      setSelectedAddress(currentAddr);
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

  const resolveStep = () => {
    if (loggedUser.address.length === 0) {
      return ORDER_STEPS.ORDER_STEP_ADDRESS;
    } else if (addressId !== 0 && !selectedAddress) {
      return ORDER_STEPS.ORDER_STEP_DELIVERY
    } else if (selectedAddress) {
      return ORDER_STEPS.ORDER_STEP_PAYMENT;
    }
    return -1;
  }

  useEffect(() => {
    setLoading(true);
    if (!loggedUser) {
      getAuthUser().then((user) => dispatch(authUser(user)));
    }

    if (!cart) {
      fetchCart().then((data) => {
        dispatch(setCart(data));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    console.log("Delivery Address : ", cart?.delivery_address);
    if (cart?.delivery_address) {
      // setSelectedAddress(JSON.parse(cart?.delivery_address));
    }
  }, []);

  return (

    <Content className={styles.mainContent}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {cart ? (
            <div
              className={"flex flex-col-reverse md:flex-row w-full md:space-x-8"}
            >
              <div className={"md:w-3/4 w-full"}>
                <AddressPicker
                  onAddressPick={checkRadio}
                  onAddressReset={changeAddress}
                  selectedAddress={selectedAddress}
                ></AddressPicker>
                {selectedAddress && <OrderItemsReview
                  title="Review your order"
                  order={cart}
                  selectedAddress={selectedAddress}
                ></OrderItemsReview>}
              </div>

              <div className={"md:w-1/4 w-full"}>
                <div className="md:fixed top-100 md:w-80 w-full p-4">
                  <OrderSummary
                    order={cart}
                    step={
                      resolveStep()
                    }
                    onCallToAction={onRazorPayCheckout}
                  ></OrderSummary>
                </div>
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </>
      )}
    </Content>

  );
}
