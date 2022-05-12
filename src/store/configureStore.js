import {configureStore} from '@reduxjs/toolkit';
import {reducer as messageReducer} from '../app/slices/message';
import {reducer as authReducer} from '../app/slices/auth/authSlice';
import {reducer as designAutomationReducer} from '../app/slices/designAutomation/designAutomationSlice';
import {reducer as ossReducer} from '../app/slices/oss/ossSlice';
import {reducer as modelDerivativeReducer} from '../app/slices/modelDerivative/modelDerivativeSlice';
import {reducer as oAuthReducer} from '../app/slices/oAuth/oAuthSlice';
import {reducer as forgeViewerReducer} from '../app/slices/forgeViewer/forgeViewerSlice';
import {apiRtk} from '../api/rtkQuery';
import bundleReducer from '../app/slices/bundle/bundleSlice';
import bundleCategoryReducer from '../app/slices/bundleCategory/bundleCategorySlice';

/**
 * All reducers put here...
 */

const store = configureStore({
  reducer: {
    auth: authReducer,
    oAuth: oAuthReducer,
    bundle: bundleReducer,
    bundleCategory: bundleCategoryReducer,
    designAutomation: designAutomationReducer,
    oss: ossReducer,
    modelDerivative: modelDerivativeReducer,
    forgeViewer: forgeViewerReducer,
    message: messageReducer,
    [apiRtk.reducerPath]: apiRtk.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiRtk.middleware),
});

export default store;

/* eslint
  import/no-import-module-exports:0
 */
