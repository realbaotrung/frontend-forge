import { createSlice } from "@reduxjs/toolkit";
import { apiRtk } from "../../../api/rtkQuery";
import { apiPaths } from "../../../api/features/apiPaths";

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
    postModelDerivativeJobs: builder.mutation(
      postModelDerivativeJobsMutation,
    ),
  }),
});

export const {usePostModelDerivativeJobsMutation} = modelDerivativeApi;

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  urn: '',
  acceptedJobs: null,
};

const modelDerivativeSlice = createSlice({
  name: 'modelDerivative',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        modelDerivativeApi.endpoints.postModelDerivativeJobs.matchFulfilled,
        (state, {payload}) => {
          state.urn = payload.urn;
          state.acceptedJobs = payload.acceptedJobs;
        },
      )
  },
});

// --- Export reducer here ---

export const {reducer} = modelDerivativeSlice;