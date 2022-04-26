import {createSlice} from '@reduxjs/toolkit';
import {apiPrivate} from '../../../api/rtkQuery'
import {apiPaths} from '../../../api/features/apiPaths'
import {
  setItemToSS,
  getItemFromSS,
  storageItem,
} from '../../../utils/storage.utils';

// ============================================================================
// Configure endpoints here...
// ============================================================================

// --- Config all endpoints here ---

const signInMutation = {
  query: ({username, password}) => ({
    url: apiPaths.API_SIGNIN,
    method: 'POST',
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    // body: qs.stringify({username, password}),
    body: {username, password},
  }),
  transformResponse: (response) => {
    if (response.result.accessToken) {
      setItemToSS(storageItem.auth, response.result);
    }
    return response;
  },
};

// --- Pass configuration of endpoints here ---

const authApi = apiPrivate.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation(signInMutation),
  }),
});

// --- Export hooks with corresponding endpoints here ---

export const {useSignInMutation} = authApi;

// ============================================================================
// Slice here...
// ============================================================================

const user = getItemFromSS(storageItem.auth);

// --- InitialState start here ---

export const initialState = user
  ? {
      isLoggedIn: true,
      user,
      accessToken: user?.accessToken,
      role: user?.roles[0],
    }
  : {isLoggedIn: false, user: null, accessToken: '', role: ''};

// --- Declaring slice here ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.signIn.matchFulfilled,
        (state, {payload}) => {
          state.isLoggedIn = payload.succeeded;
          state.user = payload.result;
          state.accessToken = payload.result.accessToken;
          state.role = payload.result.roles[0];
        },
      )
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.accessToken = '';
        state.role = '';
      });
  },
});

// --- Export reducer here ---

export const {reducer} = authSlice;
