export const DEFAULT_VERSION = '7.*';

export const DEFAULT_INITIALIZER_OPTIONS = {
  env: 'AutodeskProduction',
  api: 'derivativeV2'
};
export const DEFAULT_DOCUMENT_LOAD_SUCCESS = (
  viewerDocument // Autodesk.Viewing.Document
) => viewerDocument.getRoot().getDefaultGeometry();

export const DEFAULT_DOCUMENT_LOAD_ERROR = (
  errorCode, // Autodesk.Viewing.ErrorCodes
  errorMsg, // string
  messages, // any[]
) => {
  console.error(errorCode, errorMsg, messages);
};

export const DEFAULT_VIEWER_OPTIONS = {};

export const DEFAULT_VIEWABLE_OPTIONS = {};

export const DEFAULT_ON_INIT = () => {};
