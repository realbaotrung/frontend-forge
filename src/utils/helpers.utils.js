import { Alert, message } from 'antd';
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

/**
 * Helps sign out of app
 */
export function signOut() {
  console.log('from Signout func....');
  removeItemFromSS(storageItem.auth);
  window.location.href = '/';
}

/**
 * Calculate valid or error by percent
 */
export function calculateValidAndErrorByPercent(totalValues, errorValues) {
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

/**
 * Calculate total valid or error by percent
 */
export function calculateTotalValidAndErrorByPercent(
  totalValidAllLevels,
  totalErrorAllLevels,
) {
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

// ============================================================================
// Support Show Alert Message
// ============================================================================

export function alertErrorMessage(title = '') {
  const content = (
    <Alert
      description={title}
      type='error'
      closeable
      showIcon
    />
  );
  message.open({
    content,
    duration: 5,
    className: 'my-message',
  });
}

export function alertSuccessMessage(title = '') {
  const content = (
    <Alert
      description={title}
      type='success'
      closeable
      showIcon
    />
  );
  message.open({
    content,
    duration: 5,
    className: 'my-message',
  });
}

export function alertWarningMessage(title = '') {
  const content = (
    <Alert
      description={title}
      type='warning'
      closeable
      showIcon
    />
  );
  message.open({
    content,
    duration: 5,
    className: 'my-message',
  });
}

export function alertInfoMessage(title = '') {
  const content = (
    <Alert
      description={title}
      type='info'
      closeable
      showIcon
    />
  );
  message.open({
    content,
    duration: 5,
    className: 'my-message',
  });
}

/*
eslint
  react/jsx-filename-extension: 0
*/