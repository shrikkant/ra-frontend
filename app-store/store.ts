import { configureStore } from '@reduxjs/toolkit';

import appDefaults from './app-defaults/app-defaults.slice';

import auth from './auth/auth.slice';
import products from './products/products.slice'
import myProducts from './user/products/products.slice'
import orders from './user/orders/orders.slice'
import session from './session/session.slice';

export const store = configureStore({
  reducer: {
    appDefaults,
    auth,
    session,
    products,
    myProducts,
    orders,
  },
  devTools: true,
});

// const store = configureStore({
// 	reducer: rootReducer,
// });

// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch;
// export type AppStore = ReturnType<typeof makeStore>;
// export type AppState = ReturnType<AppStore["getState"]>;

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   AppState,
//   unknown,
//   Action
// >;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

