// Custom AxiosBaseQuery
import axios from "axios";
import {getItemFromSS, storageItem} from "../../utils/storage.utils";

export const axiosBaseQuery =
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
