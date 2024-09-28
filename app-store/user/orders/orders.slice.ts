import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrdersState } from "./types";
import { AppDispatch, RootState } from "../../store";
import { updateDeliveryAddress } from "../../../api/user/orders.api";
import { ILocation, IOrder } from "../../types";

const initialState: OrdersState = {};

export const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<IOrder[]>) {
      state.orders = action.payload;
    },
    setCart(state, action: PayloadAction<IOrder | null>) {
      state.cart = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;

export const { setCart } = ordersSlice.actions;

export const getCart = (state: RootState) => state.orders.cart;
export const getOrders = (state: RootState) => state.orders.orders;

export const updateDeliveryAddressAction =
  (order: IOrder, address: ILocation) => async (dispatch: AppDispatch) => {
    const response: IOrder = await updateDeliveryAddress(order.id, address);
    const newOrder = { ...response };
    newOrder.delivery_address = response.delivery_address;
    dispatch(ordersSlice.actions.setCart(newOrder));
  };

export default ordersSlice.reducer;
