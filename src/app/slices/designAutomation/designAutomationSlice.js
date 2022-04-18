// import {createEntityAdapter} from '@reduxjs/toolkit';
// import qs from 'qs';
import {api} from '../../../api/rtkQuery';
import {apiPaths} from '../../../api/apiPaths';

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

export const designAutomationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDesignAutomationActivities: builder.query(
      getDesignAutomationActivitiesQuery
    ),
    getDesignAutomationInfoById: builder.query(
      getDesignAutomationInfoByIdQuery
    ),
    getDesignAutomationEngine: builder.query(
      getDesignAutomationEngineQuery
    ),
    postDesignAutomationGetInfoProject: builder.mutation(
      postDesignAutomationGetInfoProjectMutation
    ),
  }),
});

export const {
  useGetDesignAutomationActivitiesQuery,
  useGetDesignAutomationInfoByIdQuery,
  useGetDesignAutomationEngineQuery,
  usePostDesignAutomationGetInfoProjectMutation,
} = designAutomationApi;
