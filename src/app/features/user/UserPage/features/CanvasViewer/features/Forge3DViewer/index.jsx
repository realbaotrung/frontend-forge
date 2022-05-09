import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../../../../utils/ForgeViewer';
import {selectGuid3dViewFromFV} from '../../../../../../../slices/forgeViewer/selectors';

export default function Forge3DViewer({token, urn}) {
  const guidFromFV = useSelector(selectGuid3dViewFromFV);

  const onDocumentLoadSuccess = useCallback((document) => {
    return document.getRoot().findByGuid(guidFromFV);
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
      className='forge-viewer adsk-viewing-viewer'
      onDocumentLoadSuccess={onDocumentLoadSuccess}
      onDocumentLoadError={onDocumentLoadError}
    />
  );
}

Forge3DViewer.propTypes = {
  token: PropsTypes.string.isRequired,
  urn: PropsTypes.string.isRequired,
};

/*
eslint
  no-restricted-syntax:0,
  no-unused-vars:0,
*/
