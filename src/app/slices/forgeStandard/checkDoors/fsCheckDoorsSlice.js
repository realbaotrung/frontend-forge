import {createSlice} from '@reduxjs/toolkit';
import {formatStringToJsonObjectWithRegex} from '../../../../utils/helpers.utils';

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  isLoadingJsonCheckDoorsDataFromServer: true,
  jsonCheckDoorsData: null,
  flattedExternalIdErrorDoors: null,
  flattedDbIdErrorDoors: null,
  warningDataAtLevel: null,
  errorDoors: null,
  errorDoor: '',
};

const fsCheckDoorsSlice = createSlice({
  name: 'fsCheckDoorsSlice',
  initialState,
  reducers: {
    setIsLoadingJsonCheckDoorsDataFromServer: (state, {payload}) => {
      state.isLoadingJsonCheckDoorsDataFromServer = payload;
    },
    setJsonCheckDoorsData: (state, {payload}) => {
      const pattern = /\\/g;
      state.jsonCheckDoorsData = formatStringToJsonObjectWithRegex(
        pattern,
        payload,
      );
    },
    setErrorDoors: (state, {payload}) => {
      state.errorDoors = payload;
    },
    setErrorDoor: (state, {payload}) => {
      state.errorDoor = payload;
    },
    setWarningDataAtLevel: (state, {payload}) => {
      state.warningDataAtLevel = payload;
    },
    setFlattedExternalIdErrorDoors: (state, {payload}) => {
      const warningDoorData = [];
      const data = payload;

      data.forEach((level) => warningDoorData.push(level.WarningData));

      // Flatten array with depth = 2
      state.flattedExternalIdErrorDoors = warningDoorData.flat(2);
    },
    setFlattedDbIdErrorDoors: (state, {payload}) => {
      state.flattedDbIdErrorDoors = payload;
    },
    showAllDbIdErrorDoors: (state, {payload}) => {
      state.isShowAllDbIdErrorDoors = payload;
    },
    resetAllFromFsCheckDoorsSlice: (state) => {
      state.jsonCheckDoorsData = '';
      state.errorDoors = null;
      state.errorDoor = '';
    },
  },
});

// --- Export reducer here ---
export const {
  setIsLoadingJsonCheckDoorsDataFromServer,
  setJsonCheckDoorsData,
  setFlattedExternalIdErrorDoors,
  setFlattedDbIdErrorDoors,
  setWarningDataAtLevel,
  showAllDbIdErrorDoors,
  setErrorDoors,
  setErrorDoor,
  resetAllFromModelDerivative,
} = fsCheckDoorsSlice.actions;

export const {reducer} = fsCheckDoorsSlice;
