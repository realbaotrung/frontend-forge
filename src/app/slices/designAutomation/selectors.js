import {createSelector} from '@reduxjs/toolkit';
import {initialState} from './designAutomationSlice';

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

export const selectJsonScheduleDataFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.jsonScheduleData,
);

export const selectCategoryDataFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.categoryData,
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
export const selectScheduleNameFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.scheduleName,
);
export const selectIsSheetFromDA = createSelector(
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
  (designAutomationState) =>
    designAutomationState.jsonFinalCategoryDataToUpload,
);

export const selectIsOpenFormScheduleCategoryFromDA = createSelector(
  [selectDomain],
  (designAutomationState) => designAutomationState.isOpenFormScheduleCategory,
);
