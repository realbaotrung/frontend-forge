import {createSlice} from '@reduxjs/toolkit';
import {apiRtk} from '../../../api/rtkQuery';
import {apiPaths} from '../../../api/features/apiPaths';

const postModelDerivativeJobsMutation = {
  query: (data) => ({
    url: apiPaths.API_MODEL_DERIVATIVE_JOBS,
    method: 'POST',
    data,
  }),
  transformResponse: (response) => {
    console.log(response);
    return response;
  },
};

export const modelDerivativeApi = apiRtk.injectEndpoints({
  endpoints: (builder) => ({
    postModelDerivativeJobs: builder.mutation(postModelDerivativeJobsMutation),
  }),
});

export const {usePostModelDerivativeJobsMutation} = modelDerivativeApi;

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  urn: '',
  metadata: null,
  fileName: '',
  isChosenFile: false,
  acceptedJobs: null,
  isLoadingModel: false,
};

const modelDerivativeSlice = createSlice({
  name: 'modelDerivative',
  initialState,
  reducers: {
    setMetadata: (state, {payload}) => {
      state.metadata = payload;
    },
    setFileName: (state, {payload}) => {
      state.fileName = payload;
    },
    setIsChosenFile: (state, {payload}) => {
      state.isChosenFile = payload;
    },
    resetAllFromModelDerivative: (state) => {
      state.urn = '';
      state.metadata = null;
      state.acceptedJobs = null;
      state.isLoadingModel = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        modelDerivativeApi.endpoints.postModelDerivativeJobs.matchPending,
        (state) => {
          state.urn = '';
          state.acceptedJobs = null;
          state.isLoadingModel = true;
        },
      )
      .addMatcher(
        modelDerivativeApi.endpoints.postModelDerivativeJobs.matchFulfilled,
        (state, {payload}) => {
          state.urn = payload.urn;
          state.acceptedJobs = payload.acceptedJobs;
          state.isLoadingModel = false;
        },
      );
  },
});

// --- Export reducer here ---
export const {
  setMetadata,
  setFileName,
  setIsChosenFile,
  resetAllFromModelDerivative,
} = modelDerivativeSlice.actions;

export const {reducer} = modelDerivativeSlice;
