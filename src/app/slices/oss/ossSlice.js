import {createSlice} from '@reduxjs/toolkit';
import {apiRtk} from '../../../api/rtkQuery';
import {apiPaths} from '../../../api/features/apiPaths';

const getOssBucketsQuery = {
  query: () => ({
    url: apiPaths.API_OSS_BUCKETS,
    method: 'GET',
  }),
  transformResponse: (response) => {
    const data = response.result
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

// 1. ( useGetOssBucketsQuery ) to get Data (data.result)
// "result": [
//   {
//     "id": "user1-20220422021106-filerevit.rvt-da",
//     "text": "user1-20220422021106-filerevit.rvt-da",
//     "type": "bucket",
//     "children": true
//   },
//   {
//     "id": "user1-20220422021226-filerevit.rvt-da",
//     "text": "user1-20220422021226-filerevit.rvt-da",
//     "type": "bucket",
//     "children": true
//   },
// ]

// 2. take 1 arbitrary id (bucketKey) of an object (here is first id) and
// use ( useGetOssBucketsByIdQuery ) to get data
// (bucketKey) id = user1-20220426020733-testrevit2.rvt-da
// "result": [
//   {
//     "id": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA0MjYwMjA3MzMtdGVzdHJldml0Mi5ydnQtZGEvdGVzdFJldml0Mi5ydnQ=",
//     "text": "testRevit2.rvt",
//     "type": "object",
//     "children": false
//   },
//   {
//     "id": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA0MjYwMjA3MzMtdGVzdHJldml0Mi5ydnQtZGEvb3VwdXRfMjAyMjA0MjYwOTA4MzZfdGVzdFJldml0Mi5ydnQ=",
//     "text": "ouput_20220426090836_testRevit2.rvt",
//     "type": "object",
//     "children": false
//   }
// ]

// 3. get id (or objectName) from result (here is first id)
// (objectName) id: dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA0MjYwMjA3MzMtdGVzdHJldml0Mi5ydnQtZGEvdGVzdFJldml0Mi5ydnQ=

// 4. Goto Modal Derivative, use (useGetModelDerivativeJobsQuery) to get (urn):
// "result": "success",
//   "urn": "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dXNlcjEtMjAyMjA0MjYwMjA3MzMtdGVzdHJldml0Mi5ydnQtZGEvdGVzdFJldml0Mi5ydnQ",
//   "acceptedJobs": {
//     "output": {
//       "formats": {
//         "0": {
//           "type": "svf",
//           "views": {
//             "0": "2d",
//             "1": "3d"
//           }
//         }
//       }
//     }
//   }

// 5. from take urn to ForgeViewer to show model on screen

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

export const {
  setOssBucketKey,
  setOssObjectNameKey
} = ossSlice.actions;
export const {reducer} = ossSlice;
