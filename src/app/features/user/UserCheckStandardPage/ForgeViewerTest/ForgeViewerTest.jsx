import {useCallback} from 'react';
import PropsTypes from 'prop-types';
import {initCheckStandardViewer} from '../../../../../utils/ForgeViewer/injected-functions/checkStandard.injected';
import ForgeViewer from '../../../../../utils/ForgeViewer';

const style = {
  width: 'calc((100vw - 600px))',
  height: 'calc(100vh - 48px)',
}

export default function ForgeViewerTest({token, urn, guid}) {
  const onDocumentLoadSuccess = useCallback((document) => {
    const bubbleNode = document?.getRoot();
    const viewer = bubbleNode.findByGuid(guid);

    return viewer;
  }, []);

  const onDocumentLoadError = useCallback((errorCode, errorMsg) => {
    console.error(
      `Could not load document, Error code - ${errorCode}:`,
      errorMsg,
    );
  }, []);

  return (
      <ForgeViewer
        disableLoader
        token={token}
        urn={urn}
        className='adsk-viewing-viewer'
        style={style}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onDocumentLoadError={onDocumentLoadError}
        injectedFuncWithViewer={initCheckStandardViewer}
        // extensions={extensions}
      />
  );
}

ForgeViewerTest.propTypes = {
  token: PropsTypes.string.isRequired,
  urn: PropsTypes.string.isRequired,
  guid: PropsTypes.string.isRequired,
};

/*
eslint
  no-restricted-syntax:0,
  no-unused-vars:0,
  max-classes-per-file: 0,
*/
