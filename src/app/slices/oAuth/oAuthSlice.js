import { createSlice } from '@reduxjs/toolkit';

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
  },
});

// --- Export reducer here ---

export const {
  setTokenOAuth2Legged,
  setTokenOAuth3Legged
} = oAuthSlice.actions;
export const {reducer} = oAuthSlice;