import {createSelector} from '@reduxjs/toolkit';
import {
  initialState,
} from './modelDerivativeSlice';

const selectDomain = (state) => state.modelDerivative || initialState;

export const selectUrnFromMD = createSelector(
  [selectDomain],
  (modelDerivativeState) => modelDerivativeState.urn,
);

export const selectAcceptedJobsFromMD = createSelector(
  [selectDomain],
  (modelDerivativeState) => modelDerivativeState.acceptedJobs,
);

export const selectIsLoadingModelFromMD = createSelector(
  [selectDomain],
  (modelDerivativeState) => modelDerivativeState.isLoadingModel,
);

export const selectFileNameFromMD = createSelector(
  [selectDomain],
  (modelDerivativeState) => modelDerivativeState.fileName,
);

export const selectIsChosenFileFromMD = createSelector(
  [selectDomain],
  (modelDerivativeState) => modelDerivativeState.isChosenFile,
);