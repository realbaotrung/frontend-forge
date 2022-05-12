import axios from 'axios';
import {getItemFromSS, storageItem} from '../utils/storage.utils';
import routePaths from '../app/features/route/routePaths';
import {signOut} from '../utils/helpers.utils';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    const accessToken = getItemFromSS(storageItem.auth)?.accessToken;
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  } catch (error) {
    console.log('error: ', error);
    return Promise.reject(error);
  }
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      console.log('UnAuthorize 401');
      signOut();
      return Promise.reject();
    }
    if (response && response.result) {
      return response.result;
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      signOut();
    } else {
      try {
        console.log(error.response.data);
        if (error?.response?.data?.errors)
          error.message = error.response.data.errors[0];
      } catch (e) {
        console.log(e);
      }
    }
    return Promise.reject(error);
  },
);

export const api = {
  get: (url) => {
    return axiosClient.get(url);
  },
  create: (url, data, config = {}) => {
    return axiosClient.post(url, data, config);
  },
  update: (url, data, config = {}) => {
    return axiosClient.put(url, data, config);
  },
  patch: (url, data, config = {}) => {
    return axiosClient.patch(url, data, config);
  },
  delete: (url) => {
    return axiosClient.delete(url);
  },
};
