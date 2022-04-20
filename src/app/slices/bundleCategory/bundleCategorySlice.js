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

// Config slice
export const bundleCategorySlice = createSlice({
  name: "bundle",
  initialState ,
  reducers: {
    
  },
  extraReducers: (builder) => {
    // Start login request
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
  },
});

// Select state currentUser from slice
export const selectBundleCategory = (state) => state.bundleCategory.bundleCategories;
export const selectLoading = (state) => state.bundleCategory.isLoading;
export const selectErrorMessage = (state) => state.bundleCategory.errorMessage;
// Export reducer
export default bundleCategorySlice.reducer;
