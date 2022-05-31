import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  message: '',
};
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = '';
    },
  },
});

export const {reducer} = messageSlice;
export const useMessageSlice = () => {
  const {setMessage, clearMessage} = messageSlice.actions;
  return {
    actions: {
      setMessage,
      clearMessage,
    },
  };
};
