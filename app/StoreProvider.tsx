'use client'
import React, {useRef} from 'react'
import {Provider} from 'react-redux'
import {makeStore, AppStore} from '../app-store/store'
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore, Persistor} from 'redux-persist'
import AuthBootstrap from './AuthBootstrap'

export default function StoreProvider({children}: {children: React.ReactNode}) {
  const storeRef = useRef<AppStore | null>(null)
  const persistorRef = useRef<Persistor | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    persistorRef.current = persistStore(storeRef.current)
  }

  // children render OUTSIDE PersistGate so they SSR. Gating children on
  // PersistGate (loading={null}) makes the whole page tree empty on SSR,
  // breaking SEO/AEO for crawlers and answer engines that don't run JS.
  // Components that need persisted state should handle the brief
  // pre-hydration window themselves (useEffect, conditional render, etc.).
  // AuthBootstrap stays gated because it kicks off a fetch and we want it
  // to wait until any persisted auth state has been rehydrated first.
  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        <AuthBootstrap />
      </PersistGate>
      {children}
    </Provider>
  )
}
