import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {OrdersState} from './types'
import {AppDispatch, RootState} from '../../store'
import {updateDeliveryAddress} from '../../../api/user/orders.api'
import {ILocation, IOrder} from '../../types'

/** Coerce API response fields to correct types so downstream code can do safe arithmetic. */
function normalizeOrder(order: IOrder): IOrder {
  return {
    ...order,
    amount: Number(order.amount) || 0,
    delivery_fee: Number(order.delivery_fee) || 0,
    total_amount: Number(order.total_amount) || 0,
    applied_discount: Number(order.applied_discount) || 0,
    days: Number(order.days) || 0,
    start_date: order.start_date ? new Date(order.start_date) : undefined,
    end_date: order.end_date ? new Date(order.end_date) : undefined,
  }
}

const initialState: OrdersState = {}

export const ordersSlice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<IOrder[]>) {
      state.orders = action.payload.map(normalizeOrder)
    },
    setCart(state, action: PayloadAction<IOrder | null>) {
      state.cart = action.payload ? normalizeOrder(action.payload) : null
    },
  },
})

export const {setOrders} = ordersSlice.actions

export const {setCart} = ordersSlice.actions

export const getCart = (state: RootState) => state.orders.cart
export const getOrders = (state: RootState) => state.orders.orders

export const updateDeliveryAddressAction =
  (order: IOrder, address: ILocation) => async (dispatch: AppDispatch) => {
    const response: IOrder = await updateDeliveryAddress(order.id, address)
    const newOrder = {...response}
    newOrder.delivery_address = response.delivery_address
    dispatch(ordersSlice.actions.setCart(newOrder))
  }

export default ordersSlice.reducer
