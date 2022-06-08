import {removeItemFromSS, storageItem} from './storage.utils';

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
export const formatStringToJsonObjectWithRegex = (pattern, str = '') => {
  // const regex = /\\/g;
  const newString = str.replace(pattern, '');
  return JSON.parse(newString);
};

export function signOut() {
  console.log('from Signout func....');
  removeItemFromSS(storageItem.auth);
  window.location.href = '/';
}

export const calculateValidAndErrorByPercent = (totalValues, errorValues) => {
  const errorPercent = (errorValues / totalValues) * 100;
  const errorPercentWithFixed2Decimal = parseFloat(errorPercent).toFixed(2);
  const validPercentWithFixed2Decimal = parseFloat(100 - errorPercent).toFixed(
    2,
  );

  return {
    validPercent: validPercentWithFixed2Decimal,
    errorPercent: errorPercentWithFixed2Decimal,
  };
};

export const calculateTotalValidAndErrorByPercent = (
  totalValidAllLevels,
  totalErrorAllLevels,
) => {
  let totalValid = 0;
  let totalError = 0;
  let totalValidByPercent = 0;
  let totalErrorByPercent = 0;

  if (totalValidAllLevels && totalErrorAllLevels) {
    const initialValue = 0;
    totalValid = totalValidAllLevels.reduce(
      (prev, curr) => prev + curr,
      initialValue,
    );
    totalError = totalErrorAllLevels.reduce(
      (prev, curr) => prev + curr,
      initialValue,
    );
  }

  if (totalValid && totalError) {
    const {validPercent, errorPercent} = calculateValidAndErrorByPercent(
      totalValid,
      totalError,
    );
    totalValidByPercent = validPercent;
    totalErrorByPercent = errorPercent;
  }

  return {
    totalValidByPercent,
    totalErrorByPercent,
  };
};
