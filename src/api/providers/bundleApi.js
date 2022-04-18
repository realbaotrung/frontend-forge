import axiosClient from "../axiosClient";

const bundleApi = {
    getAll: () => {
        const url = '/bundle';
        return axiosClient.get(url);
    },
    get: (id) => {
        const url = `/bundle/${id}`;
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = `/bundle`;
        return axiosClient.post(url, data);
    },
    update: (id, data) => {
        const url = `/bundle/${id}`;
        return axiosClient.post(url, data);
    },
    delete: (id) => {
        const url = `/bundle/${id}`;
        return axiosClient.delete(url);
    },
}

export default bundleApi;