import {useCallback, useEffect, useState} from 'react';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../../../../utils/ForgeViewer';
import {ExampleExtension} from './extension';

const extensions = [ExampleExtension];

export default function ForgeViewerTest({token, urn, guid}) {
  // const guid3dFromFV = useSelector(selectGuid3dViewFromFV);

  const onDocumentLoadSuccess = useCallback((document) => {
    return document.getRoot().findByGuid(guid);
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
      style={{
        // "width": "calc((100vw - 318px) / 2)",
        width: 'calc((100vw - 318px))',
        height: 'calc(100vh - 144px)',
      }}
      onDocumentLoadSuccess={onDocumentLoadSuccess}
      onDocumentLoadError={onDocumentLoadError}
      extensions={extensions}
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
*/
