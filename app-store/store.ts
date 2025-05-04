import {combineReducers, configureStore} from '@reduxjs/toolkit'

import appDefaults from './app-defaults/app-defaults.slice'

import auth from './auth/auth.slice'
import products from './products/products.slice'
import myProducts from './user/products/products.slice'
import orders from './user/orders/orders.slice'
import session from './session/session.slice'

import admin from './admin/index.slice'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist'
import storage from './storage'
import createCompressor from 'redux-persist-transform-compress'

const SIGNOUT_REQUEST = 'authSlice/logout'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['tracking'],
  whitelist: ['auth', 'appDefaults', 'session'],
  transforms: [createCompressor()], // Compress persisted data
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    appDefaults,
    auth,
    session,
    products,
    myProducts,
    orders,
    admin,
  }),
)

/*
export const makeStore = () => {

  const appReducer = combineReducers({
    appDefaults,
    auth,
    session,
    products,
    myProducts,
    orders,
    admin
  });

  const rootReducer = (state, action) => {
    if (action.type === SIGNOUT_REQUEST) {
      return appReducer(undefined, action); // Reset the state
    }
    return appReducer(state, action);
  };

  const store = configureStore({
    reducer: rootReducer,
  });

  store.subscribe(() => {
    console.log("State : ", store.getState());

    saveState('session', store.getState().session);
    saveState('auth', store.getState().auth);
  });


  return store;
}
*/

export const appReducer = (state, action) => {
  if (action.type === SIGNOUT_REQUEST) {
    storage.removeItem('persist:root')
    return persistedReducer(undefined, action)
  }

  return persistedReducer(state, action)
}

export const makeStore = () => {
  return configureStore({
    reducer: appReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
