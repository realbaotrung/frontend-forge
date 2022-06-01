import { memo } from 'react';
import PropsTypes from 'prop-types';
import {useForgeViewer} from './hooks';
import {
  DEFAULT_DOCUMENT_LOAD_ERROR,
  DEFAULT_DOCUMENT_LOAD_SUCCESS,
  DEFAULT_INITIALIZER_OPTIONS,
  DEFAULT_INJECTED_FUNC_WITH_VIEWER,
  DEFAULT_ON_INIT,
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
  injectedFuncWithViewer,
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
    injectedFuncWithViewer,
  });

  return (
    <div>
      <div ref={refs.viewer} className={className} style={style}></div>
    </div>
  );
}

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
  injectedFuncWithViewer: PropsTypes.func.isRequired,
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
  injectedFuncWithViewer: DEFAULT_INJECTED_FUNC_WITH_VIEWER
};


export {Extension as ForgeExtension} from './extension';
export default memo(ForgeViewer);
/*
eslint
  react/destructuring-assignment: 0,
  react/prop-types: 0,
*/
