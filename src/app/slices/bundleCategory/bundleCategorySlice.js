import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../../api/axiosClient";
import { SystemContants } from '../../../common/systemcontants';
import Notification from '../../components/Notification';


export const getBundleCategory = createAsyncThunk(
  "bundleCategory/get",
  async ({index, size}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bundleCategory?PageNumber=${index}&PageSize=${size}`);
      if (response.status >= 400) {
        return rejectWithValue(response.data)
      } 
        return response.data;
    } catch (e) {
      console.log("Error", e.response.data)
      return rejectWithValue(e.response.data)
    }
  }
);

export const deleteBundleCategory = createAsyncThunk(
  "bundleCategory/delete",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/bundleCategory/${data.id}`);
      return response.data
    } catch (e) {
      return e;
    }
  }
);

export const postBundleCategory = createAsyncThunk(
  "bundleCategory/post",
  async (data, { rejectWithValue }) => {
    try {
      const config = {headers: {'Content-Type': 'applicaltion/json'}};
      const response = await api.create('/bundleCategory', data, config);
      if (response.status >= 400) {
          return rejectWithValue(response.data)
        } 
        return response.data;  
    } catch (e) {
      console.log("Error", e.response.data)
      return rejectWithValue(e.response.data)
    }
  }
);

export const putBundleCategory = createAsyncThunk(
  'bundleCategory/update',
  async ({data, id}, {rejectWithValue}) => {
    try {
      const config = {headers: {'Content-Type': 'applicaltion/json'}};
      const response = await api.patch(`/BundleCategory/${id}`, data, config);
      if (response.status >= 400) {
        return rejectWithValue(response.data)
      } 
      return response;
    } catch (e) {
      console.log("Error", e.response.data)
      return rejectWithValue(e.response.data)
    }
  },
);

// Config slice
export const bundleCategorySlice = createSlice({
  name: "bundleCategory",
  initialState:{
    isLoading: false,
    isSuccess: false,
    errorMessage: '',
    bundleCategories: null,
    noti: SystemContants.NOTI_INFO
  } ,
  reducers: {},
  extraReducers: (builder) => {
    // Requset GET ----------------------------------------------------------
    builder.addCase(getBundleCategory.pending, (state) => {
      state.isLoading = true;
    });

    // Request successful
    builder.addCase(getBundleCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bundleCategories = action.payload;
    });

    // Request error
    builder.addCase(getBundleCategory.rejected, (state, action) => {
      state.isLoading = false;
    });

    // Requset DELETE ----------------------------------------------------------
    builder.addCase(deleteBundleCategory.pending, (state) => {
      state.isDeleting = true;
      state.isSuccess = false;
    });

    // Request successful
    builder.addCase(deleteBundleCategory.fulfilled, (state, action) => {
      state.isDeleting = false;
      state.bundleCategories = action.payload;
      state.isSuccess = true;
      state.noti = SystemContants.NOTI_SUCCESS;
    });

    // Request error
    builder.addCase(deleteBundleCategory.rejected, (state, action) => {
      state.isDeleting = false;
      state.isSuccess = false;
      state.errorMessage = action.payload.message;
      state.noti = SystemContants.NOTI_ERROR;
    });

    // Requset POST ----------------------------------------------------------
    builder.addCase(postBundleCategory.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });

    // Request successful
    builder.addCase(postBundleCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      Notification(SystemContants.NOTI_SUCCESS, 'Save successful');
    });

    // Request error
    builder.addCase(postBundleCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload.message;
      Notification(SystemContants.NOTI_ERROR, [...action.payload.errors][0]);
    });


     // Requset PUT ----------------------------------------------------------
    builder.addCase(putBundleCategory.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });

    // Request successful
    builder.addCase(putBundleCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      Notification(SystemContants.NOTI_SUCCESS, 'Save successful');
    });

    // Request error
    builder.addCase(putBundleCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      Notification(SystemContants.NOTI_ERROR, [...action.payload.errors][0])
    });

  },
});

// Select state currentUser from slice
export const selectBundleCategory = (state) => state.bundleCategory.bundleCategories;
export const selectLoading = (state) => state.bundleCategory.isLoading;
export const selectSuccess = (state) => state.bundleCategory.isSuccess;
export const deleteDeleting = (state) => state.bundleCategory.isDeleting;
export const selectErrorMessage = (state) => state.bundleCategory.errorMessage;

export const selectCategorySlice = (state) => state.bundleCategory;
// Export reducer
export default bundleCategorySlice.reducer;
