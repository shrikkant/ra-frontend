import {IOrder} from '../../types'

export interface OrdersState {
  orders?: IOrder[] | null
  cart?: IOrder | null
}
