import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../../../../utils/ForgeViewer';
import {selectGuid2dViewFromFV} from '../../../../../../../slices/forgeViewer';

export default function Forge2DViewer({token, urn}) {
  const guid2dFromFV = useSelector(selectGuid2dViewFromFV);

  const onDocumentLoadSuccess = useCallback((document) => {
    return document.getRoot().findByGuid(guid2dFromFV);
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

Forge2DViewer.propTypes = {
  token: PropsTypes.string.isRequired,
  urn: PropsTypes.string.isRequired,
};

/*
eslint
  no-restricted-syntax:0,
  no-unused-vars:0,
*/
