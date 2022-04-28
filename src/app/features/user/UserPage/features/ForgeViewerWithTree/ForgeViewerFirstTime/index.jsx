import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import PropsTypes from 'prop-types';
import {
  setView2Ds,
  setView3Ds,
} from '../../../../../../slices/forgeViewer/forgeViewerSlice';
import ForgeViewer from '../../../../../../../utils/ForgeViewer';

export default function ForgeViewerFirstTime({token, urn}) {
  const dispatch = useDispatch();

  const onDocumentLoadSuccess = useCallback((document) => {
    const viewables = document?.getRoot()?.search({type: 'geometry'});
    console.log('viewables', viewables);

    const view2dData = [];
    const view2Ds = viewables?.filter((v) => v.is2D());
    view2Ds?.forEach((view) => { view2dData.push(view?.data) });

    if (view2dData) {
      dispatch(setView2Ds(view2dData));
    }

    const view3dData = [];
    const view3Ds = viewables?.filter((v) => v.is3D());
    view3Ds.forEach((view) => { view3dData.push(view?.data) });

    if (view3dData) {
      dispatch(setView3Ds(view3dData));
    }

    return document.getRoot().getDefaultGeometry();
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

ForgeViewerFirstTime.propTypes = {
  token: PropsTypes.string.isRequired,
  urn: PropsTypes.string.isRequired,
};

/*
eslint
  no-restricted-syntax:0,
  no-unused-vars:0,
*/
