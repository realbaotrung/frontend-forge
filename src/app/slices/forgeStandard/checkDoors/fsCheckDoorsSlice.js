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
  flattedErrorDoors: null,
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
    setFlattedErrorDoors: (state) => {
      if (state.jsonCheckDoorData) {
        const warningDoorData = [];
        const data = state.jsonCheckDoorData;

        data.forEach(level => warningDoorData.push(level.WarningData))

        state.flattedErrorDoors = warningDoorData.flat();
      }
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
  setFlattedErrorDoors,
  setErrorDoors,
  setErrorDoor,
  resetAllFromModelDerivative,
} = fsCheckDoorsSlice.actions;

export const {reducer} = fsCheckDoorsSlice;
