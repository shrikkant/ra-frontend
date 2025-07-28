import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IDefaultSearch} from '../app-defaults/types'

interface DefaultSearch {
  location
  dates: []
}

export interface UtmData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string

  gclid?: string // Google Click Identifier
  gad_source?: string // Google Ads Source
  gad_campaignid?: string // Google Ads Campaign ID
  gbraid?: string // Google Bridge ID (for offline tracking or GAds)
}

export interface SessionState {
  isSessionValid: null | boolean
  defaultSearch?: DefaultSearch
  lastLink?: string
  utmData?: UtmData
}

const initialState: SessionState = {
  isSessionValid: null,
  lastLink: '',
}

export const sessionSlice = createSlice({
  name: 'sessionSlice',
  initialState,
  reducers: {
    setSession: () => ({isSessionValid: true}),
    deleteSession: () => {
      return {isSessionValid: false}
    },
    setSearch: (state, action: PayloadAction<any>) => {
      state.defaultSearch = action.payload
    },
    setLastLink: (state, action: PayloadAction<any>) => {
      state.lastLink = action.payload
    },
    setUTMData: (state, action: PayloadAction<UtmData>) => {
      state.utmData = action.payload
    },
  },
})

export const {deleteSession, setSession, setSearch, setLastLink, setUTMData} =
  sessionSlice.actions

export const sessionData = state => state.session

export const getDefaultSearch = (state): IDefaultSearch =>
  state.session.defaultSearch
export const getLastLink = (state): string => state.session.lastLink
export const getUTMData = (state): UtmData | undefined => state.session.utmData

export default sessionSlice.reducer
