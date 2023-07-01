import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_KEY } from '../../config/constants';

const initialState: { isSessionValid: null | boolean } = {
    isSessionValid: null,
};

export const sessionSlice = createSlice({
    name: 'sessionSlice',
    initialState,
    reducers: {
        setSession: () => ({ isSessionValid: true }),
        deleteSession: () => {
            Cookies.set(TOKEN_COOKIE_KEY, '');
            return { isSessionValid: false };
        },
    },
});

export const { deleteSession, setSession } = sessionSlice.actions;

export const sessionData = (state: any) => state.session;

export default sessionSlice.reducer;
