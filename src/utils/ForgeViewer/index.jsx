import { memo } from 'react';
import PropsTypes from 'prop-types';
import {useForgeViewer} from './hooks';
import {
  DEFAULT_DOCUMENT_LOAD_ERROR,
  DEFAULT_DOCUMENT_LOAD_SUCCESS,
  DEFAULT_INITIALIZER_OPTIONS,
  DEFAULT_INJECTED_FUNC_WITH_VIEWER,
  DEFAULT_ON_INIT,
  DEFAULT_ON_MODEL_LOADED,
  DEFAULT_ON_VIEWER_INITIALIZED,
  DEFAULT_VERSION,
  DEFAULT_VIEWABLE_OPTIONS,
} from './default';

function ForgeViewer({
  version,
  className,
  style,
  token,
  urn,
  initializerOptions,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  headless,
  viewerOptions,
  viewableOptions,
  onInit,
  disableLoader,
  extensions,
  onModelLoaded,
  onViewerInitialized,
  skipHiddenFragments,
}) {
  const {refs} = useForgeViewer({
    version,
    token,
    urn,
    initializerOptions,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    headless,
    viewerOptions,
    viewableOptions,
    onInit,
    disableLoader,
    extensions,
    onModelLoaded,
    onViewerInitialized,
    skipHiddenFragments,
  });

  return (
    <div
      id='forgeViewer'
      ref={refs.viewer}
      className={className}
      style={style}
    ></div>
  );
}

ForgeViewer.displayName = 'ForgeViewer'

ForgeViewer.propsType = {
  version: PropsTypes.string.isRequired,
  className: PropsTypes.string.isRequired,
  style: PropsTypes.object.isRequired,
  token: PropsTypes.string.isRequired,
  urn: PropsTypes.string.isRequired,
  initializerOptions: PropsTypes.object.isRequired,
  onDocumentLoadSuccess: PropsTypes.func.isRequired,
  onDocumentLoadError: PropsTypes.func.isRequired,
  headless: PropsTypes.bool.isRequired,
  viewerOptions: PropsTypes.object.isRequired,
  viewableOptions: PropsTypes.object.isRequired,
  onInit: PropsTypes.func.isRequired,
  disableLoader: PropsTypes.bool.isRequired,
  extensions: PropsTypes.array.isRequired,
  onModelLoaded: PropsTypes.func.isRequired,
  onViewerInitialized: PropsTypes.func.isRequired,
  skipHiddenFragments: PropsTypes.bool.isRequired,
};

ForgeViewer.defaultProps = {
  version: DEFAULT_VERSION,
  className: '',
  style: {},
  token: '',
  urn: '',
  initializerOptions: DEFAULT_INITIALIZER_OPTIONS,
  onDocumentLoadSuccess: DEFAULT_DOCUMENT_LOAD_SUCCESS,
  onDocumentLoadError: DEFAULT_DOCUMENT_LOAD_ERROR,
  headless: false,
  viewerOptions: {},
  viewableOptions: DEFAULT_VIEWABLE_OPTIONS,
  onInit: DEFAULT_ON_INIT,
  disableLoader: false,
  extensions: [],
  onModelLoaded: DEFAULT_ON_MODEL_LOADED,
  onViewerInitialized: DEFAULT_ON_VIEWER_INITIALIZED,
  skipHiddenFragments: false,
};

export {Extension as ForgeExtension} from './extension';
export default memo(ForgeViewer);
/*
eslint
  react/destructuring-assignment: 0,
  react/prop-types: 0,
*/
