import axios from 'axios';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {getItemFromSS, storageItem} from '../utils/storage.utils';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Custom AxiosBaseQuery
const axiosBaseQuery =
  ({baseUrl} = {baseUrl: ''}) =>
  async ({url, method, data, headers, params}) => {
    // Set header with authorization for each request
    axios.interceptors.request.use(
      (config) => {
        const accessToken = getItemFromSS(storageItem.auth)?.accessToken;
        if (accessToken) {
          // eslint-disable-next-line dot-notation
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );

    try {
      const result = await axios({
        url: `${baseUrl}${url}`,
        method,
        data,
        headers,
        params,
      });
      return {data: result.data};
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

// ===========================================================================
// API slice here
// ===========================================================================

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: () => ({}),
});

export const apiPrivate = createApi({
  reducerPath: 'apiPrivate',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: () => ({}),
});
