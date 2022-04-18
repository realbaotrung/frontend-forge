import axiosClient from "../axiosClient";
import {apiPaths} from "../features/apiPaths"

const bundleApi = {
    getAll: () => {
        const url = apiPaths.API_BUNDLE;
        return axiosClient.get(url);
    },
    get: (id) => {
        const url = `${apiPaths.API_BUNDLE}/${id}`;
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = apiPaths.API_BUNDLE;
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        }
        return axiosClient.post(url, data, config);
    },
    update: (id, data) => {
        const url = `${apiPaths.API_BUNDLE}/${id}`;
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        }
        return axiosClient.post(url, data, config);
    },
    delete: (id) => {
        const url = `${apiPaths.API_BUNDLE}/${id}`;
        return axiosClient.delete(url);
    },
}

export default bundleApi;