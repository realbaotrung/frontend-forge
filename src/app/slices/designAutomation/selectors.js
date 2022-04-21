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

export const selectJsonCategoryDataFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.jsonCategoryData,
);

export const selectIsErrorFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.isError,
);
