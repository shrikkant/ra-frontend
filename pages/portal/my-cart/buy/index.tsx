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
import { ORDER_STEPS, STATUS_AADHAAR_VERIFIED } from "config/constants";
import { AddressPicker } from "components/order/AddressPicker";
import Loader from "components/Loader";
import { getAuthUser } from "../../../../api/auth.api";
import { useRouter } from "next/navigation";

export default function Orders() {
  const cart: any = useSelector(getCart);
  const router = useRouter();
  const loggedUser: any = useSelector(selectAuthState);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressId, setAddressId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const dispatch = useDispatch();


  const orderSuccess = () => {
    dispatch(setCart(null));
    if (loggedUser.verified !== STATUS_AADHAAR_VERIFIED) {
      router.push("/portal/profile/verify");
      return;
    }

    router.push("/portal/orders");
  }
  const onRazorPayCheckout = async (mode: number) => {

    const currentAddr = loggedUser?.address.find(
      (ad) => ad.id === addressId
    ) || { id: -1, name: "Store Pickup" };

    if (mode === ORDER_STEPS.ORDER_STEP_DELIVERY) {
      updateDeliveryAddressAction(cart, currentAddr)(dispatch);
      setSelectedAddress(currentAddr);
    } else if (mode === ORDER_STEPS.ORDER_STEP_PAYMENT) {
      setIsButtonLoading(true);

      displayRazorpay(cart.id, orderSuccess).then(() => {
        setIsButtonLoading(false);
      });
    }
  };

  const changeAddress = () => {
    setSelectedAddress(null);
  };

  const checkRadio = (addressId: number) => {
    setAddressId(addressId);
  };

  const onNewAddress = (newAddress) => {
    setSelectedAddress(newAddress);
  }

  const resolveStep = () => {
    if (!loggedUser.address || loggedUser.address.length === 0) {
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

    if (loggedUser?.address && loggedUser.address.length > 0) {
      setSelectedAddress(loggedUser.address[0]);
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
              className={"flex flex-col-reverse md:flex-row w-full xs:pb-20"}
            >
              <div className={"md:w-3/4 w-full"}>
                <AddressPicker
                  onAddressPick={checkRadio}
                  onAddressReset={changeAddress}
                  onNewAddress={onNewAddress}
                  selectedAddress={selectedAddress}
                ></AddressPicker>
                {selectedAddress && <OrderItemsReview
                  title="Review your order"
                  order={cart}
                  selectedAddress={selectedAddress}
                ></OrderItemsReview>}
              </div>

              <div className={"md:w-1/4 w-full"}>
                <div className="md:fixed md:w-max w-full top-20 xs:p-4 md:p-0">
                  <OrderSummary
                    order={cart}
                    step={
                      resolveStep()
                    }
                    isLoading={isButtonLoading}
                    onCallToAction={onRazorPayCheckout}
                  ></OrderSummary>
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </>
      )}
    </Content>

  );
}
