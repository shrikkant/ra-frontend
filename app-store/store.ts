import { configureStore } from '@reduxjs/toolkit';

import appDefaults from './app-defaults/app-defaults.slice';

import auth from './auth/auth.slice';
import products from './products/products.slice'
import myProducts from './user/products/products.slice'
import orders from './user/orders/orders.slice'
import session from './session/session.slice';

import admin from "./admin/index.slice";

export const store = configureStore({
  reducer: {
    appDefaults,
    auth,
    session,
    products,
    myProducts,
    orders,
    admin
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

