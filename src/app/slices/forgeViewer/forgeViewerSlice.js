import { createSlice } from '@reduxjs/toolkit';

// ============================================================================
// Slice here...
// ============================================================================

export const initialState = {
  didChosenViewToShowBreadcrumb: false,
  isFirstTimeLoadViewer: true,
  haveSelectedView: false,
  currentViewName: '',
  view2Ds: null,
  guid2dView: '',
  view3Ds: null,
  guid3dView: '',
};

const forgeViewerSlice = createSlice({
  name: 'forgeViewer',
  initialState,
  reducers: {
    setCurrentViewName: (state, {payload}) => {
      state.currentViewName = payload;
    },
    setView2Ds: (state, {payload}) => {
      state.view2Ds = payload;
    },
    setView3Ds: (state, {payload}) => {
      state.view3Ds = payload;
    },
    setGuid2dView: (state, {payload}) => {
      state.guid2dView = payload;
    },
    setGuid3dView: (state, {payload}) => {
      state.guid3dView = payload;
    },
    setIsFirstTimeLoadViewer: (state, {payload}) => {
      state.isFirstTimeLoadViewer = payload;
    },
    setHaveSelectedView: (state, {payload}) => {
      state.haveSelectedView = payload;
    },
    setDidChosenViewToShowBreadcrumb: (state, {payload}) => {
      state.didChosenViewToShowBreadcrumb = payload;
    },
    resetAllFromForgeViewerSlice: (state) => {
      state.isFirstTimeLoadViewer = true;
      state.haveSelectedView = false;
      state.view2Ds = null;
      state.view3Ds = null;
      state.guid2dView = '';
      state.guid3dView = '';
    }
  },
});

// --- Export reducer here ---

export const {
  setCurrentViewName,
  setView2Ds,
  setGuid2dView,
  setView3Ds,
  setGuid3dView,
  setIsFirstTimeLoadViewer,
  setHaveSelectedView,
  setDidChosenViewToShowBreadcrumb,
  resetAllFromForgeViewerSlice,
} = forgeViewerSlice.actions;
export const {reducer} = forgeViewerSlice;

/**
 * 1. Loading ForgeView at the first time (3D) (base on tree to open new doc)
 * to get all Guid for 2D and 3D views and take it to ForgeViewer Slice
 * 2. Make a list of 2D (3D) with guid, name of view
 * 3. When click at specific guid => load and open the model
 * by re-render ForgeViewer component
 */