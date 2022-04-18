import {createSelector} from '@reduxjs/toolkit';
import {initialState} from './index';

const selectDomain = (state) => state.message || initialState;
export const selectMessage = createSelector(
  [selectDomain],
  (messageState) => messageState.message,
);
