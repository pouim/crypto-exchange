import {createSlice} from '@reduxjs/toolkit';

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    lastOtcBar: null,
  },
  reducers: {
    setLastOtcBar(state,{payload}:any) {
      state.lastOtcBar = payload;
    },
  },
});

export const {setLastOtcBar} = tradeSlice.actions;

export default tradeSlice.reducer;
