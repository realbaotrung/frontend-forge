import {createSelector} from '@reduxjs/toolkit';
import {initialState} from './messageSlice';

const selectDomain = (state) => state.message || initialState;
export const selectMessage = createSelector(
  [selectDomain],
  (messageState) => messageState.message,
);
