import {createSlice} from '@reduxjs/toolkit';

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  tokenOAuth2Legged: '',
  tokenOAuth3Legged: '',
};

const oAuthSlice = createSlice({
  name: 'oAuth',
  initialState,
  reducers: {
    setTokenOAuth2Legged: (state, {payload}) => {
      state.tokenOAuth2Legged = payload;
    },
    setTokenOAuth3Legged: (state, {payload}) => {
      state.tokenOAuth3Legged = payload;
    },
    resetAllFromOAuthSlice: (state) => {
      state.tokenOAuth2Legged = '';
      state.tokenOAuth3Legged = '';
    },
  },
});

// --- Export reducer here ---

export const {
  setTokenOAuth2Legged,
  setTokenOAuth3Legged,
  resetAllFromOAuthSlice,
} = oAuthSlice.actions;
export const {reducer} = oAuthSlice;
