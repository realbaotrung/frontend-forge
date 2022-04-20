import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {api} from '../../../api/axiosClient';

const initialState = {
  isLoading: false,
  isDeleting: false,
  errorMessage: '',
  bundles: null,
  bundle: {},
};

export const getBundle = createAsyncThunk(
  'bundle/get',
  async (data, {rejectWithValue}) => {
    const response = await api.get('/bundle');
    return response.data;
  },
);

export const getVersionRevit = createAsyncThunk(
  'bundle/getVersion',
  async (data, {rejectWithValue}) => {
    const response = await api.get('/forge/designautomation/engines');
    return response.data;
  },
);

export const postBundle = createAsyncThunk(
  'bundle/post',
  async (data, {rejectWithValue}) => {
    const config = {headers: {'Content-Type': 'multipart/form-data'}};
    try {
      const response = await api.create('/bundle', data, config);
      return response.data;
    } catch (e) {
      return e;
    }
  },
);

export const putBundle = createAsyncThunk(
  'bundle/update',
  async (data, {rejectWithValue}) => {
    const config = {headers: {'Content-Type': 'multipart/form-data'}};
    try {
      const response = await api.patch('/bundle', data, config);
      return response.data;
    } catch (e) {
      return e;
    }
  },
);

export const deleteBundle = createAsyncThunk(
  'bundle/delete',
  async (data, {rejectWithValue}) => {
    try {
      const response = await api.delete(`/bundle/${data.id}`);
      return response.data;
    } catch (e) {
      return e;
    }
  },
);

// Config slice
export const bundleSlice = createSlice({
  name: 'bundle',
  initialState: {
    isLoading: false,
    errorMessage: '',
    bundles: null,
    bundle: {},
    versions: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    // Start get request
    builder.addCase(getBundle.pending, (state) => {
      state.isLoading = true;
    });

    // Request successful
    builder.addCase(getBundle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bundles = action.payload;
    });

    // Request error
    builder.addCase(getBundle.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });

    // Request successful
    builder.addCase(postBundle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bundle = action.payload;
    });
    // Request error
    builder.addCase(postBundle.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });

    // Start get request
    builder.addCase(deleteBundle.pending, (state) => {
      state.isDeleting = true;
    });
    // Request successful
    builder.addCase(deleteBundle.fulfilled, (state, action) => {
      state.isDeleting = false;
      state.bundle = action.payload;
    });
    // Request error
    builder.addCase(deleteBundle.rejected, (state, action) => {
      state.isDeleting = false;
      state.errorMessage = action.payload.message;
    });

    // Start get request
    builder.addCase(putBundle.pending, (state) => {
      state.isLoading = true;
    });
    // Request successful
    builder.addCase(putBundle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bundle = action.payload;
    });
    // Request error
    builder.addCase(putBundle.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });

    // Request successful
    builder.addCase(getVersionRevit.fulfilled, (state, action) => {
      state.isLoading = false;
      state.versions = action.payload;
    });
  },
});

// Select state currentUser from slice
export const selectBundle = (state) => state.bundle.bundles;
export const selectLoading = (state) => state.bundle.isLoading;
export const deleteLoading = (state) => state.bundle.isDeleting;
export const selectErrorMessage = (state) => state.bundle.errorMessage;
export const selectVersion = (state) => state.bundle.versions;
export const addBundle = (state) => state.bundle.bundle;
export const updateBundle = (state) => state.bundle.bundle;
// Export reducer
export default bundleSlice.reducer;
