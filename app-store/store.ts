import { combineReducers, configureStore } from '@reduxjs/toolkit';

import appDefaults from './app-defaults/app-defaults.slice';

import auth from './auth/auth.slice';
import products from './products/products.slice'
import myProducts from './user/products/products.slice'
import orders from './user/orders/orders.slice'
import session from './session/session.slice';

import admin from "./admin/index.slice";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import storage from './storage';

const SIGNOUT_REQUEST = "authSlice/logout";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["tracking"],
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  appDefaults,
  auth,
  session,
  products,
  myProducts,
  orders,
  admin
}))

export const appReducer = (state, action) => {
  if (action.type === SIGNOUT_REQUEST) {
    storage.removeItem('persist:root')
    return persistedReducer(undefined, action);
  }

  return persistedReducer(state, action)
}




export const makeStore = () => {
  return configureStore({
    reducer: appReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  // return configureStore({
  //   reducer: persistedReducer,
  //   devTools: true,
  // });
};

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

