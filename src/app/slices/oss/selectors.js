import {createSelector} from '@reduxjs/toolkit';
import {
  initialState,
} from './ossSlice';

const selectDomain = (state) => state.oss || initialState;

export const selectOssBucketKeyFromOSS = createSelector(
  [selectDomain],
  (ossState) => ossState.ossBucketKey,
);

export const selectOssObjectNameKeyFromOSS = createSelector(
  [selectDomain],
  (ossState) => ossState.ossObjectNameKey,
);

export const selectBucketsFromOSS = createSelector(
  [selectDomain],
  (ossState) => ossState.buckets,
);

export const selectBucketFromOSS = createSelector(
  [selectDomain],
  (ossState) => ossState.bucket,
);