'use client'
import React from 'react'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../app-store/store'
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function StoreProvider({ children }: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }
  const persistor = persistStore(storeRef.current);

  return (<>
    <Provider store={storeRef.current}>
      <PersistGate loading={
        <div className="preloader-cover">
          <div className="preloader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>}
        persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  </>
  );
}
