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
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

/**
 * This function help format string of json to json object
 * by using regex pattern
 */
export const formatStringToJsonObjectWithRegex = (str="", pattern) => {
  // const regex = /\\/g;
  const newString = str.replace(pattern, "");
  const jsonObject = JSON.parse(newString)
  return jsonObject;
}
