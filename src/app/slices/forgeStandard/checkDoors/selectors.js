import {createSelector} from '@reduxjs/toolkit';
import {initialState} from './fsCheckDoorsSlice';

const selectDomain = (state) => state.fsCheckDoors || initialState;

export const selectJsonCheckDoorDataFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.jsonCheckDoorData,
);

export const selectErrorDoorsFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.errorDoors,
);

export const selectErrorDoorFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.errorDoor,
);

export const selectFlattedExternalIdErrorDoorsFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.flattedExternalIdErrorDoors,
);

export const selectFlattedDbIdErrorDoorsFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.flattedDbIdErrorDoors,
);

export const selectFlattedDataFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.flattedData,
);

export const selectIsShowAllDbIdErrorDoorsFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.isShowAllDbIdErrorDoors,
);

export const selectIsShowDbIdErrorDoorsFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.isShowDbIdErrorDoors,
);

export const selectWarningDataAtLevelFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.warningDataAtLevel,
);

/*
eslint
  consistent-return: 0
*/