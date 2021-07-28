import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'user',
    initialState: {
            token: '',
            isAuth: false,
            data: {}
    },
    reducers: {
        setMeData(state, { payload }) {
            state.token = payload.token;
            state.isAuth = true;
            state.data = payload;
        },
        logOutUser(state) {
            state.token = '';
            state.isAuth = false;
            state.data = {};
        },
        setToken(state, {payload}) {
            state.token = payload;
        },
    },
});

export const { setMeData,logOutUser,setToken } = slice.actions;

export default slice.reducer;
