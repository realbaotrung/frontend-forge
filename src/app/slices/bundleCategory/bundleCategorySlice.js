import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {api} from "../../../api/axiosClient";

const initialState = {
  isLoading: false,
  errorMessage: "",
  bundleCategories: null,
  bundleCategory: {},
};

export const getBundleCategory = createAsyncThunk(
  "bundleCategory/get",
  async (data, { rejectWithValue }) => {
    const response = await api.get("/bundleCategory");
    return response.data
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
    const config = { headers : {"Content-Type": "applicaltion/json"}
    };
    try {
      const response = await api.create('/bundleCategory', data, config);
      return response.data
    } catch (e) {
      return e;
    }
  }
);

// Config slice
export const bundleCategorySlice = createSlice({
  name: "bundle",
  initialState ,
  reducers: {
    
  },
  extraReducers: (builder) => {
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
      state.errorMessage = action.payload.message;
    });

    builder.addCase(deleteBundleCategory.pending, (state) => {
      state.isDeleting = true;
    });

    // Request successful
    builder.addCase(deleteBundleCategory.fulfilled, (state, action) => {
      state.isDeleting = false;
      state.bundleCategories = action.payload;
    });

    // Request error
    builder.addCase(deleteBundleCategory.rejected, (state, action) => {
      state.isDeleting = false;
      state.errorMessage = action.payload.message;
    });

    builder.addCase(postBundleCategory.pending, (state) => {
      state.isLoading = true;
    });

    // Request successful
    builder.addCase(postBundleCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bundleCategories = action.payload;
    });

    // Request error
    builder.addCase(postBundleCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });

  },
});

// Select state currentUser from slice
export const selectBundleCategory = (state) => state.bundleCategory.bundleCategories;
export const selectLoading = (state) => state.bundleCategory.isLoading;
export const deleteDeleting = (state) => state.bundleCategory.isDeleting;
export const selectErrorMessage = (state) => state.bundleCategory.errorMessage;
// Export reducer
export default bundleCategorySlice.reducer;
