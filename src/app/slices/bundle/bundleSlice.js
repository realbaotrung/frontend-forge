import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {api} from '../../../api/axiosClient';
import { SystemContants } from '../../../common/systemcontants';
import Notification from '../../components/Notification';

export const getBundle = createAsyncThunk(
  'bundle/get',
  async ({index, size}, {rejectWithValue}) => {
    try {
      
      const response = await api.get(`/bundle?PageNumber=${index}&PageSize=${size}`);
      if (response.status === 200) {
        return response.data;
      } 
        return rejectWithValue(response.data)
    } catch (e) {
      console.log("Error", e.response.data)
      return rejectWithValue(e.response.data)
    }
    
  }
  
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
      if (response.status === 200) {
        return response.data;
      } 
        return rejectWithValue(response.data)
    } catch (e) {
      return rejectWithValue(e.response.data)
    }

  },
);

export const putBundle = createAsyncThunk(
  'bundle/update',
  async ({data, id}) => {
    const config = {headers: {'Content-Type': 'multipart/form-data'}};
    try {
      const response = await api.patch(`/bundle/${id}`, data, config);
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
    isSuccess: false,
    errorMessage: '',
    bundles: null,
    bundle: {},
    versions: [],
    noti: SystemContants.NOTI_INFO
  },
  reducers: {},
  extraReducers: (builder) => {
    // Start GET request
    builder.addCase(getBundle.pending, (state) => {
      state.isLoading = true;
    });

    // Request GET successful
    builder.addCase(getBundle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bundles = action.payload;
      state.noti = SystemContants.NOTI_SUCCESS;
    });

    // Request GET error
    builder.addCase(getBundle.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
      state.noti = SystemContants.NOTI_ERROR;
    });

     // Start POST  request
     builder.addCase(postBundle.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    // Request POST successful
    builder.addCase(postBundle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.bundle = action.payload;
      Notification(SystemContants.NOTI_SUCCESS, 'Save successful');
      
    });
    // Request POST error
    builder.addCase(postBundle.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload;
      Notification(SystemContants.NOTI_ERROR, [...action.payload.errors][0])
    });

    // Start DELETE request
    builder.addCase(deleteBundle.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    // Request DELETE successful
    builder.addCase(deleteBundle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.noti = SystemContants.NOTI_SUCCESS;
      state.bundle = action.payload;
    });
    // Request DELETE error
    builder.addCase(deleteBundle.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload.message;
      state.noti = SystemContants.NOTI_ERROR;
    });

    // Start PATCH request
    builder.addCase(putBundle.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });
    // Request PATCH successful
    builder.addCase(putBundle.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.bundle = action.payload;
      Notification(SystemContants.NOTI_SUCCESS, 'Save successful');
    });
    // Request PATCH error
    builder.addCase(putBundle.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload.message;
      Notification(SystemContants.NOTI_ERROR, [...action.payload.errors][0])
    });

    // Request VersionRevit successful
    builder.addCase(getVersionRevit.fulfilled, (state, action) => {
      state.isLoading = false;
      state.versions = action.payload;
    });
  },
});

// Select state currentUser from slice
export const selectBundle = (state) => state.bundle.bundles;
export const selectLoading = (state) => state.bundle.isLoading;
export const selectSuccess = (state) => state.bundle.isSuccess;
export const selectErrorMessage = (state) => state.bundle.errorMessage;
export const selectVersion = (state) => state.bundle.versions;
export const addBundle = (state) => state.bundle.bundle;
export const updateBundle = (state) => state.bundle.bundle;

export const selectBundleSlice = (state) => state.bundle

// Export reducer
export default bundleSlice.reducer;
