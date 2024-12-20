import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_KEY } from '../../config/constants';
import { IDefaultSearch } from '../app-defaults/types';

interface DefaultSearch {
    location: any,
    dates: any[]
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

export const sessionData = (state: any) => state.session;

export const getDefaultSearch = (state: any): IDefaultSearch => state.session.defaultSearch;
export const getLastLink = (state: any): string => state.session.lastLink;

export default sessionSlice.reducer;
