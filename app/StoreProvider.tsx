'use client'
import React, {useRef} from 'react'
import {Provider} from 'react-redux'
import {makeStore, AppStore} from '../app-store/store'
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore, Persistor} from 'redux-persist'

export default function StoreProvider({children}: {children: React.ReactNode}) {
  const storeRef = useRef<AppStore | null>(null)
  const persistorRef = useRef<Persistor | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    persistorRef.current = persistStore(storeRef.current)
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        {children}
      </PersistGate>
    </Provider>
  )
}
