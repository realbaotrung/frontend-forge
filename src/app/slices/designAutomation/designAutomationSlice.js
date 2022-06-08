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
    console.log(response);
    return response;
  },
};

const getDesignAutomationInfoByIdQuery = {
  query: (designInfoId) => ({
    url: `${apiPaths.API_DESIGNAUTOMATION_DESIGN_INFO}/${designInfoId}`,
    method: 'GET',
  }),
  transformResponse: (response) => {
    console.log(response);
    return response;
  },
};

const getDesignAutomationEngineQuery = {
  query: () => ({
    url: apiPaths.API_DESIGNAUTOMATION_ENGINES,
    method: 'GET',
  }),
  transformResponse: (response) => {
    console.log(response);
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
    console.log(response);
    return response;
  },
};

const postJsonScheduleFormDataToServerMutation = {
  query: (data) => ({
    url: apiPaths.API_DESIGNAUTOMATION_SCHEDULE_START,
    method: 'POST',
    data,
  }),
  transformResponse: (response) => {
    console.log(response);
    return response;
  },
};

const postJsonCheckDoorsFormDataToServerMutation = {
  query: (data) => ({
    url: apiPaths.API_DESIGNAUTOMATION_CHECK_START,
    method: 'POST',
    data,
  }),
  transformResponse: (response) => {
    console.log(response);
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
    postJsonScheduleFormDataToServer: builder.mutation(
      postJsonScheduleFormDataToServerMutation,
    ),
    postJsonCheckDoorsFormDataToServer: builder.mutation(
      postJsonCheckDoorsFormDataToServerMutation,
    ),
  }),
});

export const {
  useGetDesignAutomationActivitiesQuery,
  useGetDesignAutomationInfoByIdQuery,
  useGetDesignAutomationEngineQuery,
  usePostDesignAutomationGetInfoProjectMutation,
  usePostJsonScheduleFormDataToServerMutation,
  usePostJsonCheckDoorsFormDataToServerMutation,
} = designAutomationApi;

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  id: '',
  revitFileName: '',
  hasLoading: false,
  jsonDataFromServer: null,
  categoryData: null,
  categoryNames: null,
  categoryKeyName: '',
  categoryValuesByKeyName: null,
  scheduleName: '',
  isSheet: false,
  isError: false,
  jsonTargetCategoryData: null,
  jsonFinalCategoryDataToUpload: null,
};

// --- Declaring slice here ---

const designAutomationSlice = createSlice({
  name: 'designAutomation',
  initialState,
  reducers: {
    setJsonDataFromServer: (state, {payload}) => {
      const pattern = /\\/g;
      state.jsonDataFromServer = formatStringToJsonObjectWithRegex(
        pattern,
        payload,
      );
    },
    setJsonScheduleData: (state, {payload}) => {
      state.jsonDataFromServer = JSON.parse(payload);
    },
    setRevitFileName: (state, {payload}) => {
      state.revitFileName = payload;
    },
    setCategoryData: (state, {payload}) => {
      state.categoryData = payload;
    },
    setCategoryNames: (state, {payload}) => {
      state.categoryNames = payload;
    },
    setCategoryKeyName: (state, {payload}) => {
      state.categoryKeyName = payload;
    },
    setScheduleName: (state, {payload}) => {
      state.scheduleName = payload;
    },
    setCheckboxSheet: (state, {payload}) => {
      state.isSheet = payload;
    },
    setCategoryValuesByKeyName: (state, {payload}) => {
      state.categoryValuesByKeyName = payload;
    },
    setJsonTargetCategoryData: (state, {payload}) => {
      state.jsonTargetCategoryData = payload;
    },
    setJsonFinalCategoryDataToUpload: (state, {payload}) => {
      const {categoryKeyName, jsonTargetCategoryData, scheduleName, isSheet} =
        payload;
      const jsonFinal = [];
      const schedule = {
        Category: categoryKeyName,
        ScheduleName: scheduleName,
        Parameters: jsonTargetCategoryData,
        IsAddToSheet: isSheet,
        SheetName: 'auto name',
      };
      console.log('schedule from DA: ', schedule);
      jsonFinal.push(schedule);
      state.jsonFinalCategoryDataToUpload = jsonFinal;
    },

    // ====================

    resetFormUploadFilesState: (state) => {
      state.revitFileName = '';
      state.hasLoading = false;
      state.isError = false;
    },
    resetFormScheduleCategory: (state) => {
      state.categoryNames = null;
      state.categoryKeyName = '';
      state.scheduleName = '';
      state.isSheet = false;
      state.jsonTargetCategoryData = null;
      state.jsonFinalCategoryDataToUpload = null;
      state.isError = false;
    },
    resetAllFromDesignAutomation: (state) => {
      state.id = '';
      state.revitFileName = '';
      state.hasLoading = false;
      state.jsonScheduleData = null;
      state.categoryNames = null;
      state.categoryData = null;
      state.categoryKeyName = '';
      state.categoryValuesByKeyName = null;
      state.jsonTargetCategoryData = null;
      state.jsonFinalCategoryDataToUpload = null;
      state.scheduleName = '';
      state.isSheet = false;
      state.isError = false;
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
      )
      .addMatcher(
        designAutomationApi.endpoints.postDesignAutomationGetInfoProject
          .matchRejected,
        (state) => {
          state.id = '';
          state.revitFileName = '';
          state.hasLoading = false;
          state.jsonScheduleData = null;
          state.isError = true;
        },
      )
      .addMatcher(
        designAutomationApi.endpoints.postJsonScheduleFormDataToServer
          .matchRejected,
        (state) => {
          state.scheduleName = '';
          state.isSheet = false;
          state.categoryNames = null;
          state.categoryKeyName = '';
          state.categoryValuesByKeyName = null;
          state.jsonTargetCategoryData = null;
          state.jsonFinalCategoryDataToUpload = null;
          state.isError = true;
        },
      );
  },
});

// --- Export reducer here ---

export const {
  setJsonDataFromServer,
  setRevitFileName,
  setJsonScheduleData,
  setCategoryData,
  setCategoryNames,
  setCategoryKeyName,
  setScheduleName,
  setCheckboxSheet,
  setCategoryValuesByKeyName,
  setJsonTargetCategoryData,
  setJsonFinalCategoryDataToUpload,
  resetFormUploadFilesState,
  resetFormScheduleCategory,
  resetAllFromDesignAutomation,
} = designAutomationSlice.actions;
export const {reducer} = designAutomationSlice;
