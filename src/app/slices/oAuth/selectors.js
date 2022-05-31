import {createSelector} from '@reduxjs/toolkit';
import {initialState} from './oAuthSlice';

const selectDomain = (state) => state.oAuth || initialState;

export const selectTokenOAuth2LeggedFromOAUTH = createSelector(
  [selectDomain],
  (oAuthState) => oAuthState.tokenOAuth2Legged,
);

export const selectTokenOAuth3LeggedFromOAUTH = createSelector(
  [selectDomain],
  (oAuthState) => oAuthState.tokenOAuth3Legged,
);
