import {createSelector} from '@reduxjs/toolkit';
import {initialState} from './authSlice';

// const selectDomain = (state) => state.auth || initialState;
const selectDomain = (state) => state.auth || initialState;

export const selectUser = createSelector(
  [selectDomain],
  (authState) => authState.user,
);

export const selectIsLoggedIn = createSelector(
  [selectDomain],
  (authState) => authState.isLoggedIn,
);

export const selectAccessToken = createSelector(
  [selectDomain],
  (authState) => authState.accessToken,
);

export const selectRole = createSelector(
  [selectDomain],
  (authState) => authState.role,
);