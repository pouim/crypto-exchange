import {createSlice} from '@reduxjs/toolkit';

const appearanceSlice = createSlice({
  name: 'appearance',
  initialState: {
    theme: 'light',
    dir: 'ltr',
    sideBar:"CLOSE",
    notifSideBar:"CLOSE",
    symbol:'BTC-USDT',
    authPage: 'sign-in',
    phone_number: '',
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    layout(state,{payload}) {
      state.dir = payload;
    },
    isSideBarOpen(state, { payload }) {
      state.sideBar = payload;
    },
    isSideBarNotifOpen(state, { payload }) {
      state.notifSideBar = payload;
    },
    setCurrentSymbol(state,{payload}:any) {
      state.symbol = payload;
    },
    setAuthPage(state,{payload}:any) {
      state.authPage = payload;
    },
    setPhoneNumber(state,{payload}:any) {
      state.phone_number = payload;
    },
  },
});

export const {
    toggleTheme,
    layout,
    isSideBarOpen,
    setCurrentSymbol,
    isSideBarNotifOpen,
    setAuthPage,
    setPhoneNumber,
} = appearanceSlice.actions;

export default appearanceSlice.reducer;
