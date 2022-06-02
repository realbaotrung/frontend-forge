import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../../api/axiosClient';
import {SystemContants} from '../../../common/systemcontants';
import Notification from '../../components/Notification';

export const getCheckStandardAll = createAsyncThunk(
  'checkstandard/getall',
  async ({index, size}, {rejectWithValue}) => {
    try {
      const response = await api.get(`/CheckStandard`);
      if (response.status >= 400) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (e) {
      console.log('Error', e.response.data);
      return rejectWithValue(e.response.data);
    }
  },
);

export const getCheckStandard = createAsyncThunk(
  'checkstandard/get',
  async ({index, size}, {rejectWithValue}) => {
    try {
      const response = await api.get(
        `/CheckStandard?PageNumber=${index}&PageSize=${size}`,
      );
      if (response.status >= 400) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (e) {
      console.log('Error', e.response.data);
      return rejectWithValue(e.response.data);
    }
  },
);

export const deleteCheckStandard = createAsyncThunk(
  'checkstandard/delete',
  async (data, {rejectWithValue}) => {
    try {
      const response = await api.delete(`/CheckStandard/${data.id}`);
      return response.data;
    } catch (e) {
      return e;
    }
  },
);

export const postCheckStandard = createAsyncThunk(
  'checkstandard/post',
  async (data, {rejectWithValue}) => {
    try {
      const config = {headers: {'Content-Type': 'applicaltion/json'}};
      const response = await api.create('/CheckStandard', data, config);
      if (response.status >= 400) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (e) {
      console.log('Error', e.response.data);
      return rejectWithValue(e.response.data);
    }
  },
);

export const putCheckStandard = createAsyncThunk(
  'checkstandard/update',
  async ({data, id}, {rejectWithValue}) => {
    try {
      const config = {headers: {'Content-Type': 'applicaltion/json'}};
      const response = await api.patch(`/CheckStandard/${id}`, data, config);
      if (response.status >= 400) {
        return rejectWithValue(response.data);
      }
      return response;
    } catch (e) {
      console.log('Error', e.response.data);
      return rejectWithValue(e.response.data);
    }
  },
);

// Config slice
export const checkStandardSlice = createSlice({
  name: 'checkStandard',
  initialState: {
    isLoading: false,
    isSuccess: false,
    errorMessage: '',
    checkStandardes: null,
    checkStandardAlls: null,
    noti: SystemContants.NOTI_INFO,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Requset GET ALL ----------------------------------------------------------
    builder.addCase(getCheckStandardAll.pending, (state) => {
      state.isLoading = true;
    });

    // Request successful
    builder.addCase(getCheckStandardAll.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bundleCategoryAlls = action.payload;
    });

    // Request error
    builder.addCase(getCheckStandardAll.rejected, (state, action) => {
      state.isLoading = false;
    });

    // Requset GET ----------------------------------------------------------
    builder.addCase(getCheckStandard.pending, (state) => {
      state.isLoading = true;
    });

    // Request successful
    builder.addCase(getCheckStandard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.checkStandardes = action.payload;
    });

    // Request error
    builder.addCase(getCheckStandard.rejected, (state, action) => {
      state.isLoading = false;
    });

    // Requset DELETE ----------------------------------------------------------
    builder.addCase(deleteCheckStandard.pending, (state) => {
      state.isDeleting = true;
      state.isSuccess = false;
    });

    // Request successful
    builder.addCase(deleteCheckStandard.fulfilled, (state, action) => {
      state.isDeleting = false;
      state.checkStandardes = action.payload;
      state.isSuccess = true;
      state.noti = SystemContants.NOTI_SUCCESS;
    });

    // Request error
    builder.addCase(deleteCheckStandard.rejected, (state, action) => {
      state.isDeleting = false;
      state.isSuccess = false;
      state.errorMessage = action.payload.message;
      state.noti = SystemContants.NOTI_ERROR;
    });

    // Requset POST ----------------------------------------------------------
    builder.addCase(postCheckStandard.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });

    // Request successful
    builder.addCase(postCheckStandard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      Notification(SystemContants.NOTI_SUCCESS, 'Save successful');
    });

    // Request error
    builder.addCase(postCheckStandard.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = action.payload.message;
      Notification(SystemContants.NOTI_ERROR, [...action.payload.errors][0]);
    });

    // Requset PUT ----------------------------------------------------------
    builder.addCase(putCheckStandard.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
    });

    // Request successful
    builder.addCase(putCheckStandard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      Notification(SystemContants.NOTI_SUCCESS, 'Save successful');
    });

    // Request error
    builder.addCase(putCheckStandard.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      Notification(SystemContants.NOTI_ERROR, [...action.payload.errors][0]);
    });
  },
});

// Select state currentUser from slice
export const selectCheckStandard = (state) =>
  state.checkStandard.checkStandardes;

export const selectCheckStandardAll = (state) =>
  state.checkStandard.checkStandardAlls;

export const selectLoading = (state) => state.checkStandard.isLoading;
export const selectSuccess = (state) => state.checkStandard.isSuccess;
export const deleteDeleting = (state) => state.checkStandard.isDeleting;
export const selectErrorMessage = (state) => state.checkStandard.errorMessage;

export const selectCheckStandarSlice = (state) => state.checkStandard;
// Export reducer
export default checkStandardSlice.reducer;
