import {configureStore} from '@reduxjs/toolkit';
import {apiRtk, apiPrivate} from '../api/rtkQuery';
import {reducer as messageReducer} from '../app/slices/message';
import {reducer as authReducer} from '../app/slices/auth/authSlice';
import {reducer as designAutomationReducer} from '../app/slices/designAutomation/designAutomationSlice';

/**
 * All reducers put here...
 */

const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    designAutomation: designAutomationReducer,
    [apiRtk.reducerPath]: apiRtk.reducer,
    [apiPrivate.reducerPath]: apiPrivate.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiRtk.middleware)
      .concat(apiPrivate.middleware),
});

export default store;

/* eslint
  import/no-import-module-exports:0
 */
