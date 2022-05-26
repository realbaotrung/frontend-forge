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

const postJsonFinalDataToServerMutation = {
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
    postJsonFinalDataToServer: builder.mutation(
      postJsonFinalDataToServerMutation,
    ),
  }),
});

export const {
  useGetDesignAutomationActivitiesQuery,
  useGetDesignAutomationInfoByIdQuery,
  useGetDesignAutomationEngineQuery,
  usePostDesignAutomationGetInfoProjectMutation,
  usePostJsonFinalDataToServerMutation,
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

  // For Schedule form
  isOpenFormScheduleCategory: false,

  // For Check door form
  isOpenFormCheckDoors: false,
  jsonFormCheckDoors: null,
  jsonFinalCheckDoorsToUpload: null,
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
      state.jsonScheduleData = JSON.parse(payload);
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

    // ====================
    // Test for check doors
    // ====================
    setIsOpenFormCheckDoors: (state, {payload}) => {
      state.isOpenFormCheckDoors = payload;
    },
    setJsonFormCheckDoors: (state, {payload}) => {
      state.jsonFormCheckDoors = payload;
    },
    setJsonFinalCheckDoorsToUpload: (state, {payload}) => {
      // {
      //   "DataDoor": {
      //     "MaxLength": 9.5,
      //     "EpsilonCenter": 0.5
      //   }
      // }
      const {maxLength, epsilonCenter} = payload;
      const jsonFinal = {
        DataDoor: {
          MaxLength: maxLength,
          EpsilonCenter: epsilonCenter
        }
      };
      console.log('json file CheckDoors from DA: ', jsonFinal);

      state.jsonFinalCheckDoorsToUpload = jsonFinal;
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
        designAutomationApi.endpoints.postJsonFinalDataToServer
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
  setIsOpenFormScheduleCategory,
  resetFormUploadFilesState,
  resetFormScheduleCategory,
  resetAllFromDesignAutomation,
  // ===================
  setIsOpenFormCheckDoors,
  setJsonFormCheckDoors,
  // ===================
} = designAutomationSlice.actions;
export const {reducer} = designAutomationSlice;
