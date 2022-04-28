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

export const selectCategoryNamesFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.categoryNames,
);

export const selectCategoryKeyNameFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.categoryKeyName,
);
export const inputScheduleNameFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.ScheduleName,
);
export const checkboxSheetFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.isSheet,
);
export const selectCategoryValuesByKeyNameFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.categoryValuesByKeyName,
);

export const selectJsonTargetCategoryDataFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.jsonTargetCategoryData,
);

export const selectJsonFinalCategoryDataToUploadFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.jsonFinalCategoryDataToUpload,
);
