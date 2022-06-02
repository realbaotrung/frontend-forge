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

export const selectFlattedErrorDoorsFromFsCheckDoors = createSelector(
  [selectDomain],
  (fsCheckDoorsState) => fsCheckDoorsState.flattedErrorDoors,
);

/*
eslint
  consistent-return: 0
*/