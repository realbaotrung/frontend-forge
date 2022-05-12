import { removeItemFromSS, storageItem } from "./storage.utils";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error) {
  return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error) {
  return ( typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

/**
 * This function help format string of json to json object
 * by using regex pattern
 */
export const formatStringToJsonObjectWithRegex = (pattern, str="") => {
  // const regex = /\\/g;
  const newString = str.replace(pattern, "");
  return JSON.parse(newString);
}

export function signOut() {
  console.log('from Signout func....')
  removeItemFromSS(storageItem.auth);
  window.location.href = '/'
}
