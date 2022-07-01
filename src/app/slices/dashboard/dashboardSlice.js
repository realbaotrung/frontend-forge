import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../../api/axiosClient';

export const getDashboardDay = createAsyncThunk(
  'dashboard/getDay',
  async (data, {rejectWithValue}) => {
    try {
      const response = await api.get('/price-daily');
      return response.data;
    } catch (error) {
      console.log('Error', error.data.errors);
      return rejectWithValue(error.data.errors);
    }
  },
);
export const getDashboardMonth = createAsyncThunk(
  'dashboard/getMonth',
  async (data, {rejectWithValue}) => {
    try {
      const response = await api.get('/price-monthly');
      return response.data;
    } catch (error) {
      console.log('Error', error.data.errors);
      return rejectWithValue(error.data.errors);
    }
  },
);
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardDay: {
      errors: [],
      result: [],
      succeeded: '',
    },
    dashboardMonth: {
      errors: [],
      result: [],
      succeeded: '',
    },
    isLoading: false,
    isSuccess: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    // Start GET request
    builder.addCase(getDashboardDay.pending, (state) => {
      state.isLoading = true;
    });
    // Request GET successful
    builder.addCase(getDashboardDay.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      // let arr = [];
      // arr = payload.result.map((obj,index) => {

      //   if (obj.cost === 0) {
      //     obj = {
      //       ...obj,
      //       cost: NaN,
      //     };
      //   }
      //   return obj;
      // });
      // console.log('payload', arr);
      state.dashboardDay = payload;
    });

    // Request GET error
    builder.addCase(getDashboardDay.rejected, (state, {payload}) => {
      state.isLoading = false;
      state.errorMessage = payload.message;
    });

    builder.addCase(getDashboardMonth.pending, (state) => {
      state.isLoading = true;
    });
    // Request GET successful
    builder.addCase(getDashboardMonth.fulfilled, (state, {payload}) => {
      state.isLoading = false;

      state.dashboardMonth.result = payload.result;
    });

    // Request GET error
    builder.addCase(getDashboardMonth.rejected, (state, {payload}) => {
      state.isLoading = false;
      state.errorMessage = payload.message;
    });
  },
});
export const selectDashboardMonth = (state) => state.dashboard.dashboardMonth;
export const selectDashboardDay = (state) => state.dashboard.dashboardDay;
export const selectLoading = (state) => state.dashboard.isLoading;
export const selectSuccess = (state) => state.dashboard.isSuccess;
export const selectErrorMessage = (state) => state.dashboard.errorMessage;

export const {reducer} = dashboardSlice;
