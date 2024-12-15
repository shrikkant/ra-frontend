import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDefaultSearch } from '../app-defaults/types';

interface DefaultSearch {
    location,
    dates: []
}

export interface SessionState {
    isSessionValid: null | boolean,
    defaultSearch?: DefaultSearch,
    lastLink?: string
}

const initialState: SessionState = {
    isSessionValid: null,
    lastLink: "",
};

export const sessionSlice = createSlice({
    name: 'sessionSlice',
    initialState,
    reducers: {
        setSession: () => ({ isSessionValid: true }),
        deleteSession: () => {
            return { isSessionValid: false };
        },
        setSearch: (state, action: PayloadAction<any>) => {
            state.defaultSearch = action.payload;
        },
        setLastLink: (state, action: PayloadAction<any>) => {
            state.lastLink = action.payload;
        }
    },
});

export const { deleteSession, setSession, setSearch, setLastLink } = sessionSlice.actions;

export const sessionData = (state) => state.session;

export const getDefaultSearch = (state): IDefaultSearch => state.session.defaultSearch;
export const getLastLink = (state): string => state.session.lastLink;

export default sessionSlice.reducer;
