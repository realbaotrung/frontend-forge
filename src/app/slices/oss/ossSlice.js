import {createSlice} from '@reduxjs/toolkit';
import {apiRtk} from '../../../api/rtkQuery';
import {apiPaths} from '../../../api/features/apiPaths';

const getOssBucketsQuery = {
  query: () => ({
    url: apiPaths.API_OSS_BUCKETS,
    method: 'GET',
  }),
  transformResponse: (response) => {
    const data = response.result;
    console.log(data);
    return data;
  },
};

const getOssBucketByIdQuery = {
  query: (ossBucketId) => ({
    url: `${apiPaths.API_OSS_BUCKETS}/${ossBucketId}`,
    method: 'GET',
  }),
  transformResponse: (response) => {
    console.log(response);
    return response;
  },
};

const addOssBucketMutation = {
  query: (bucketKey) => ({
    url: apiPaths.API_OSS_BUCKETS,
    method: 'POST',
    data: bucketKey,
  }),
  transformResponse: (response) => {
    console.log(response);
    return response;
  },
};

const addOssObjectMutation = {
  query: (formData) => ({
    url: apiPaths.API_OSS_OBJECTS,
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

export const ossApi = apiRtk.injectEndpoints({
  endpoints: (builder) => ({
    getOssBuckets: builder.query(getOssBucketsQuery),
    getOssBucketById: builder.query(getOssBucketByIdQuery),
    addOssBucket: builder.mutation(addOssBucketMutation),
    addOssObject: builder.mutation(addOssObjectMutation),
  }),
});

export const {
  useGetOssBucketsQuery,
  useGetOssBucketByIdQuery,
  useAddOssBucketMutation,
  useAddOssObjectMutation,
} = ossApi;

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  ossBucketKey: '',
  ossObjectNameKey: '',
  buckets: null,
  bucket: null,
};

const ossSlice = createSlice({
  name: 'oss',
  initialState,
  reducers: {
    setOssBucketKey: (state, {payload}) => {
      state.ossBucketKey = payload;
    },
    setOssObjectNameKey: (state, {payload}) => {
      state.ossObjectNameKey = payload;
    },
    resetAllFromOssSlice: (state) => {
      state.ossBucketKey = '';
      state.ossObjectNameKey = '';
      state.buckets = null;
      state.bucket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        ossApi.endpoints.getOssBucketById.matchFulfilled,
        (state, {payload}) => {
          state.bucket = payload.result;
        },
      )
      .addMatcher(
        ossApi.endpoints.getOssBuckets.matchFulfilled,
        (state, {payload}) => {
          state.buckets = payload;
        },
      );
  },
});

// --- Export reducer here ---

export const {setOssBucketKey, setOssObjectNameKey, resetAllFromOssSlice} = ossSlice.actions;
export const {reducer} = ossSlice;
