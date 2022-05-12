import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from "./features/customBaseQuery";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// ===========================================================================
// API slice here
// ===========================================================================

export const apiRtk = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Auth', 'Oss'],
  endpoints: () => ({}),
});
