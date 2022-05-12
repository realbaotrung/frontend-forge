// Custom AxiosBaseQuery
import axios from 'axios';
import {signOut} from '../../utils/helpers.utils';
import {getItemFromSS, storageItem} from '../../utils/storage.utils';

export const axiosBaseQuery =
  ({baseUrl} = {baseUrl: ''}) =>
  async ({url, method, data, headers, params}) => {
    // Set header with authorization for each request
    const axiosApi = axios.create({baseURL: baseUrl});

    axiosApi.interceptors.request.use(
      (config) => {
        const accessToken = getItemFromSS(storageItem.auth)?.accessToken;
        if (accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );

    axiosApi.interceptors.response.use(
      (config) => {
        if (config.data.code === 401) {
          signOut();
          return Promise.reject();
        }
        if (config && config.result) {
          return config.result;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    try {
      const result = await axiosApi({
        url: `${url}`,
        method,
        data,
        headers,
        params,
      });
      return {data: result.data};
    } catch (axiosError) {
      if (axiosError?.response?.status === 401) {
        signOut();
      }
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };
