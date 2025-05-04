import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AppDefaultsState} from './types'
import {fetchCategoriesClient} from '../../api/products.api'
import {AppDispatch, RootState} from '../store'

const initialState: AppDefaultsState = {}

export const appDefaultsSlice = createSlice({
  name: 'appDefaultsSlice',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<any>) {
      state.categories = action.payload
    },
    setSearchDefault(state, action: PayloadAction<any>) {
      state.searchDefaults = action.payload
    },
  },
})

export const {setCategories} = appDefaultsSlice.actions

export const getCategories = (state: RootState) => state.appDefaults.categories

export const getCategoriesAction = () => async (dispatch: AppDispatch) => {
  const response = await fetchCategoriesClient()
  dispatch(appDefaultsSlice.actions.setCategories(response))
}

export default appDefaultsSlice.reducer
