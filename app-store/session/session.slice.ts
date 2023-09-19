import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_KEY } from '../../config/constants';

interface DefaultSearch {
    location: any,
    dates: any[]
}

interface SessionState {
    isSessionValid: null | boolean,
    defaultSearch?: DefaultSearch
}

const initialState: SessionState = {
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
        setSearch: (state, action: PayloadAction<any>) => {
            console.log("Pay  load :  ,", action.payload);
			state.defaultSearch = JSON.parse(action.payload);
		}
    },
});

export const { deleteSession, setSession, setSearch } = sessionSlice.actions;

export const sessionData = (state: any) => state.session;

export const getDefaultSearch = (state: any) => state.session.defaultSearch;

export default sessionSlice.reducer;
