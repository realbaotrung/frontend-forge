// import {createEntityAdapter} from '@reduxjs/toolkit';
// import qs from 'qs';
import {createSlice} from '@reduxjs/toolkit';
import {apiRtk} from '../../../api/rtkQuery';
import {apiPaths} from '../../../api/features/apiPaths';
import {formatStringToJsonObjectWithRegex} from '../../../utils/helpers.utils';

// export const designAutomationAdapter = createEntityAdapter();
// export const initialState = designAutomationAdapter.getInitialState();

const getDesignAutomationActivitiesQuery = {
  query: () => ({
    url: apiPaths.API_DESIGNAUTOMATION_ACTIVITIES,
    method: 'GET',
  }),
  transformResponse: (response) => {
    const data = response;
    console.log(data);
    return response;
  },
};

const getDesignAutomationInfoByIdQuery = {
  query: (designInfoId) => ({
    url: `${apiPaths.API_DESIGNAUTOMATION_DESIGN_INFO}/${designInfoId}`,
    method: 'GET',
  }),
  transformResponse: (response) => {
    const data = response;
    console.log(data);
    return response;
  },
};

const getDesignAutomationEngineQuery = {
  query: () => ({
    url: apiPaths.API_DESIGNAUTOMATION_ENGINES,
    method: 'GET',
  }),
  transformResponse: (response) => {
    const data = response;
    console.log(data);
    return response;
  },
};

const postDesignAutomationGetInfoProjectMutation = {
  query: (formData) => ({
    url: apiPaths.API_DESIGNAUTOMATION_GET_INFO_PROJECT,
    method: 'POST',
    data: formData,
    header: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  }),
  transformResponse: (response) => {
    const data = response;
    console.log(data);
    return response;
  },
};

export const designAutomationApi = apiRtk.injectEndpoints({
  endpoints: (builder) => ({
    getDesignAutomationActivities: builder.query(
      getDesignAutomationActivitiesQuery,
    ),
    getDesignAutomationInfoById: builder.query(
      getDesignAutomationInfoByIdQuery,
    ),
    getDesignAutomationEngine: builder.query(getDesignAutomationEngineQuery),
    postDesignAutomationGetInfoProject: builder.mutation(
      postDesignAutomationGetInfoProjectMutation,
    ),
  }),
});

export const {
  useGetDesignAutomationActivitiesQuery,
  useGetDesignAutomationInfoByIdQuery,
  useGetDesignAutomationEngineQuery,
  usePostDesignAutomationGetInfoProjectMutation,
} = designAutomationApi;

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  id: '',
  revitFileName: '',
  hasLoading: false,
  jsonData: null,
};

// --- Declaring slice here ---

const designAutomationSlice = createSlice({
  name: 'designAutomation',
  initialState,
  reducers: {
    getJsonDataForDesignAutomation: (state, {payload}) => {
      const pattern = /\\/g;
      const jsonData = formatStringToJsonObjectWithRegex(payload, pattern);
      state.jsonData = jsonData;
    },
    getRevitFileName: (state, {payload}) => {
      state.revitFileName = payload;
    },
    resetDesignAutomationState: (state) => {
      state.id = '';
      state.revitFileName = '';
      state.hasLoading = false;
      state.jsonData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        designAutomationApi.endpoints.postDesignAutomationGetInfoProject
          .matchPending,
        (state) => {
          state.hasLoading = true;
        },
      )
      .addMatcher(
        designAutomationApi.endpoints.postDesignAutomationGetInfoProject
          .matchFulfilled,
        (state, {payload}) => {
          state.hasLoading = false;
          state.id = payload.result.id;
        },
      );
  },
});

// --- Export reducer here ---

export const {
  getJsonDataForDesignAutomation,
  getRevitFileName,
  resetDesignAutomationState,
} = designAutomationSlice.actions;
export const {reducer} = designAutomationSlice;
