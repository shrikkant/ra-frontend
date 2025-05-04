// context/UserContext.tsx
'use client'
import React, {createContext, useContext, ReactNode} from 'react'
import {IUser} from '../../app-store/types'

const UserContext = createContext<IUser | null>(null)

export const UserProvider = ({
  children,
  user,
}: {
  children: ReactNode
  user: IUser | null
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
  return useContext(UserContext)
}
