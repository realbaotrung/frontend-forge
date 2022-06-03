import {createSlice} from '@reduxjs/toolkit';
// import {apiRtk} from '../../../../api/rtkQuery';
// import {apiPaths} from '../../../../api/features/apiPaths';

// const postModelDerivativeJobsMutation = {
//   query: (data) => ({
//     url: apiPaths.API_MODEL_DERIVATIVE_JOBS,
//     method: 'POST',
//     data,
//   }),
//   transformResponse: (response) => {
//     console.log(response);
//     return response;
//   },
// };

// export const modelDerivativeApi = apiRtk.injectEndpoints({
//   endpoints: (builder) => ({
//     postModelDerivativeJobs: builder.mutation(postModelDerivativeJobsMutation),
//   }),
// });

// export const {usePostModelDerivativeJobsMutation} = modelDerivativeApi;

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  jsonCheckDoorData: null,
  flattedExternalIdErrorDoors: null,
  flattedDbIdErrorDoors: null,
  warningDataAtLevel: null,
  isShowDbIdErrorDoors: false,
  isShowAllDbIdErrorDoors: false,
  flattedData: null,
  errorDoors: null,
  errorDoor: '',
};

const fsCheckDoorsSlice = createSlice({
  name: 'fsCheckDoorsSlice',
  initialState,
  reducers: {
    setJsonCheckDoorData: (state, {payload}) => {
      state.jsonCheckDoorData = payload;
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
    setFlattedData: (state, {payload}) => {
      state.flattedData = payload;
    },
    setFlattedExternalIdErrorDoors: (state, {payload}) => {
        const warningDoorData = [];
        const data = payload;

        data.forEach(level => warningDoorData.push(level.WarningData))

        // Flatten array with depth = 2
        state.flattedExternalIdErrorDoors = warningDoorData.flat(2);
    },
    setFlattedDbIdErrorDoors: (state, {payload}) => {
      state.flattedDbIdErrorDoors = payload;
    },
    showAllDbIdErrorDoors: (state, {payload}) => {
      state.isShowAllDbIdErrorDoors = payload;
    },
    setIsShowDbIdErrorDoors: (state, {payload}) => {
      state.isShowDbIdErrorDoors = payload;
    },
    resetAllFromFsCheckDoorsSlice: (state) => {
      state.jsonCheckDoorData = '';
      state.errorDoors = null;
      state.errorDoor = '';
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addMatcher(
  //       modelDerivativeApi.endpoints.postModelDerivativeJobs.matchPending,
  //       (state) => {
  //         state.urn = '';
  //         state.acceptedJobs = null;
  //         state.isLoadingModel = true;
  //       },
  //     )
  //     .addMatcher(
  //       modelDerivativeApi.endpoints.postModelDerivativeJobs.matchFulfilled,
  //       (state, {payload}) => {
  //         state.urn = payload.urn;
  //         state.acceptedJobs = payload.acceptedJobs;
  //         state.isLoadingModel = false;
  //       },
  //     );
  // },
});

// --- Export reducer here ---
export const {
  setJsonCheckDoorData,
  setFlattedExternalIdErrorDoors,
  setFlattedDbIdErrorDoors,
  setFlattedData,
  setWarningDataAtLevel,
  showAllDbIdErrorDoors,
  setIsShowDbIdErrorDoors,
  setErrorDoors,
  setErrorDoor,
  resetAllFromModelDerivative,
} = fsCheckDoorsSlice.actions;

export const {reducer} = fsCheckDoorsSlice;
