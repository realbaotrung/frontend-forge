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

const postJsonFinalCategoryDataToServerMutation = {
  query: (data) => ({
    url: apiPaths.API_DESIGNAUTOMATION_START,
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
    postJsonFinalCategoryDataToServer: builder.mutation(
      postJsonFinalCategoryDataToServerMutation,
    ),
  }),
});

export const {
  useGetDesignAutomationActivitiesQuery,
  useGetDesignAutomationInfoByIdQuery,
  useGetDesignAutomationEngineQuery,
  usePostDesignAutomationGetInfoProjectMutation,
  usePostJsonFinalCategoryDataToServerMutation,
} = designAutomationApi;

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  id: '',
  revitFileName: '',
  hasLoading: false,
  jsonScheduleData: null,
  categoryData: null,
  categoryNames: null,
  categoryKeyName: '',
  categoryValuesByKeyName: null,
  jsonTargetCategoryData: null,
  jsonFinalCategoryDataToUpload: null,
  isOpenFormScheduleCategory: false,
  scheduleName: '',
  isSheet: false,
  isError: false,
};

// --- Declaring slice here ---

const designAutomationSlice = createSlice({
  name: 'designAutomation',
  initialState,
  reducers: {
    getJsonDataFromServer: (state, {payload}) => {
      const pattern = /\\/g;
      state.jsonScheduleData = formatStringToJsonObjectWithRegex(
        pattern,
        payload,
      );
    },
    getJsonScheduleData: (state, {payload}) => {
      state.jsonScheduleData = JSON.parse(payload);
    },
    getRevitFileName: (state, {payload}) => {
      state.revitFileName = payload;
    },
    getCategoryData: (state, {payload}) => {
      state.categoryData = payload;
    },
    getCategoryNames: (state, {payload}) => {
      state.categoryNames = payload;
    },
    getCategoryKeyName: (state, {payload}) => {
      state.categoryKeyName = payload;
    },
    getScheduleName: (state, {payload}) => {
      state.scheduleName = payload;
    },
    getCheckboxSheet: (state, {payload}) => {
      state.isSheet = payload;
    },
    getCategoryValuesByKeyName: (state, {payload}) => {
      state.categoryValuesByKeyName = payload;
    },
    getJsonTargetCategoryData: (state, {payload}) => {
      state.jsonTargetCategoryData = payload;
    },
    getJsonFinalCategoryDataToUpload: (state, {payload}) => {
      // TODO: create structure JSON file for uploading to server
      //   [
      //     {
      //       "Category": "Air Systems",
      //       "ScheduleName": "",
      //       "Parameters": [
      //         "Fan",
      //         "Chilled Water Loop",
      //         "Cooling Coil"
      //       ],
      //       "IsAddToSheet": true,
      //       "SheetName": ""
      //     },
      //     {
      //       "Category": "aaaa",
      //       "ScheduleName": "",
      //       "Parameters": [
      //         "Fan",
      //         "Chilled Water Loop",
      //         "Cooling Coil"
      //       ],
      //       "IsAddToSheet": true,
      //       "SheetName": ""
      //     }
      //   ]
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
    setIsOpenFormScheduleCategory: (state, {payload}) => {
      state.isOpenFormScheduleCategory = payload;
    },
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
      state.isOpenFormScheduleCategory = false;
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
        designAutomationApi.endpoints.postJsonFinalCategoryDataToServer
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
  getJsonDataFromServer,
  getRevitFileName,
  getJsonScheduleData,
  getCategoryData,
  getCategoryNames,
  getCategoryKeyName,
  getScheduleName,
  getCheckboxSheet,
  getCategoryValuesByKeyName,
  getJsonTargetCategoryData,
  getJsonFinalCategoryDataToUpload,
  resetFormUploadFilesState,
  resetFormScheduleCategory,
  setIsOpenFormScheduleCategory,
  resetAllFromDesignAutomation,
} = designAutomationSlice.actions;
export const {reducer} = designAutomationSlice;
