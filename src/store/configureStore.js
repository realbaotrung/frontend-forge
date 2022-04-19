import {configureStore} from '@reduxjs/toolkit';
import {reducer as messageReducer} from '../app/slices/message';
import {reducer as authReducer} from '../app/slices/auth/authSlice';
import {api, apiPrivate} from '../api/rtkQuery';
import bundleReducer from '../app/slices/bundle/bundleSlice';
import bundleCategoryReducer from '../app/slices/bundleCategory/bundleCategorySlice';

/**
 * All reducers put here...
 */

const store = configureStore({
  reducer: {
    auth: authReducer,
    bundle: bundleReducer,
    bundleCategory: bundleCategoryReducer,
    message: messageReducer,
    [api.reducerPath]: api.reducer,
    [apiPrivate.reducerPath]: apiPrivate.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(apiPrivate.middleware),
});

export default store;

/* eslint
  import/no-import-module-exports:0
 */
