import axios from "axios";
import {getItemFromSS, storageItem} from "../utils/storage.utils";
import routePaths from "../app/features/route/routePaths";

const axiosClient = axios.create({
    baseURL: REACT_APP_API_URL,
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
})

axiosClient.interceptors.response.use((response) => {
    if (response.data.code === 401) {
        console.log("UnAuthorize 401")
        window.location.href = routePaths.LOGIN_URL;
        return Promise.reject();
    }
    if(response && response.result) {
        return response.result
    }
    return response;
}, (error) => {
    if (error?.response?.status === 401) {
      window.location.href = routePaths.LOGIN_URL;
    } else {
      try {
        console.log(error.response.data)
        if (error?.response?.data?.result.errors) error.message = error.response.data.result.errors[0];    
      } catch (e) {
        console.log(e)
      }
    }
    return Promise.reject(error);
});

export default axiosClient;