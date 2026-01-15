import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IUser} from '../types'
import {IAuthState} from './types'
import {RootState} from '../store'

const initialState: IAuthState = {}

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    authUser(state, action: PayloadAction<IUser>) {
      // Only persist essential user fields to avoid localStorage quota issues
      const {documents, address, ...essentialUser} = action.payload
      state.user = essentialUser as IUser
    },
    logout(state) {
      state.user = undefined
    },
    setAdminLogin(state, action: PayloadAction<boolean>) {
      state.isAdminLogin = action.payload
    },
  },
})

export const {authUser, logout, setAdminLogin} = authSlice.actions

export const selectAuthState = (state: RootState) => state.auth.user

export const isAdminLogin = (state: RootState) => state.auth.isAdminLogin

export default authSlice.reducer
