import {createSelector} from '@reduxjs/toolkit';
import {
  initialState,
} from './designAutomationSlice';

const selectDomain = (state) => state.designAutomation || initialState;

export const selectHasLoadingFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.hasLoading,
);

export const selectIdFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.id,
);

export const selectRevitFileNameFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.revitFileName,
);

export const selectJsonDataFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.jsonData,
);