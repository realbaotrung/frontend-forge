import {createSelector} from '@reduxjs/toolkit';
import {
  initialState,
} from './forgeViewerSlice';

const selectDomain = (state) => state.forgeViewer || initialState;

export const selectCurrentViewNameFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.currentViewName,
);

export const selectView2DsFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.view2Ds,
);

export const selectView3DsFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.view3Ds,
);

export const selectGuid2dViewFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.guid2dView,
);

export const selectGuid3dViewFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.guid3dView,
);

export const selectIsFirstTimeLoadViewerFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.isFirstTimeLoadViewer,
);

export const selectDidChosenViewToShowBreadcrumbFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.didChosenViewToShowBreadcrumb,
);

export const selectHaveSelectedViewFromFV = createSelector(
  [selectDomain],
  (forgeViewerState) => forgeViewerState.haveSelectedView,
);