import {createSelector} from '@reduxjs/toolkit';
import {designAutomationApi, designAutomationAdapter, initialState} from '.';

const selectDomain =
  designAutomationApi.endpoints.postDesignAutomationGetInfoProject.select();

const selectDesignAutomationGetInfoProject = createSelector(
  selectDomain,
  (state) => state.result,
);

// export const {
//   selectAll: selectAllInfoProject,
//   selectById: selectInfoProjectById,
// } = designAutomationAdapter.getSelectors(
//   (state) => selectDesignAutomationGetInfoProject(state) ?? initialState,
// );
