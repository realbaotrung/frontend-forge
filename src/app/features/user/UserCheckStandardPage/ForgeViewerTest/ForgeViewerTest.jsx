import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../utils/ForgeViewer';
import {
  selectFlattedDbIdErrorDoorsFromFsCheckDoors,
  selectFlattedExternalIdErrorDoorsFromFsCheckDoors,
  selectIsShowAllDbIdErrorDoorsFromFsCheckDoors,
  selectWarningDataAtLevelFromFsCheckDoors,
  setFlattedDbIdErrorDoors,
  showAllDbIdErrorDoors,
} from '../../../../slices/forgeStandard/checkDoors';
import {ExampleExtension} from '../../../../../utils/ForgeViewer/exts/example.extension';

const style = {
  width: 'inherit',
  height: 'inherit',
};

const extensions = [ExampleExtension];

export default function ForgeViewerTest({token, urn, guid}) {
  // ===================================
  // get all FlattedErrorDoors
  // ===================================
  const viewRef = useRef(null);

  const flattedExternalIdErrorDoors = useSelector(
    selectFlattedExternalIdErrorDoorsFromFsCheckDoors,
  );
  const isShowAllDbIdErrorDoorsFromFsCheckDoors = useSelector(
    selectIsShowAllDbIdErrorDoorsFromFsCheckDoors,
  );

  const flattedDbIdErrorDoors = useSelector(
    selectFlattedDbIdErrorDoorsFromFsCheckDoors,
  );

  const warningDataAtLevel = useSelector(
    selectWarningDataAtLevelFromFsCheckDoors,
  );

  // ===================================
  const dispatch = useDispatch();
  // =================================

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

  const onModelLoaded = (viewer, event) => {
    const databaseId = [];

    const onConvertExtIdToDbId = () => {
      const onSuccessCallback = (mappingObject) => {
        // ==============================================================
        // The magic starts here...
        // All external Id will be mapped and converted to 'DbId'
        // ==============================================================
        flattedExternalIdErrorDoors.forEach((externalId) =>
          databaseId.push(mappingObject[externalId]),
        );
        // ==============================================================
        // Dispatch to set all databaseId that have converted to Store
        // ==============================================================
        dispatch(setFlattedDbIdErrorDoors(databaseId));
      };
      const onErrorCallback = (data) => {
        console.error('Cannot convert externalId to DbId: ', data);
      };
      viewer.model.getExternalIdMapping(onSuccessCallback, onErrorCallback);
    };

    onConvertExtIdToDbId();
  };
  const onViewerInitialized = (viewer) => {
    if (viewRef.current) {
      throw new Error('viewer has been recreated');
    }
    viewRef.current = viewer;
  };

  useEffect(() => {
    const viewer = viewRef.current;
    if (warningDataAtLevel) {
      const flattedExternalIdData = [...warningDataAtLevel.flat()]
      let flattedDbIdData = []
      const onSuccessCallback = (mappingObject) => {
        flattedDbIdData = flattedExternalIdData.map((externalId) => {return mappingObject[externalId]});
        // ================================================================
        // On Button Show clicked, show error doors at specified level...
        // ================================================================
        viewer.select(flattedDbIdData);
      };
      const onErrorCallback = (data) => {
        console.error('Cannot convert externalId to DbId: ', data);
      };
      viewer.model.getExternalIdMapping(onSuccessCallback, onErrorCallback);
    }
  }, [warningDataAtLevel]);

  useEffect(() => {
    const viewer = viewRef.current;
    // ==================================
    // On Button Show All Errors clicked...
    // ==================================
    if (isShowAllDbIdErrorDoorsFromFsCheckDoors && flattedDbIdErrorDoors) {
      viewer.isolate(flattedDbIdErrorDoors);
      viewer.select(flattedDbIdErrorDoors);
      viewer.fitToView(flattedDbIdErrorDoors);
      dispatch(showAllDbIdErrorDoors(false));
    }
  }, [isShowAllDbIdErrorDoorsFromFsCheckDoors, flattedDbIdErrorDoors]);

  return (
    <ForgeViewer
      disableLoader
      token={token}
      urn={urn}
      className='adsk-viewing-viewer'
      style={style}
      onDocumentLoadSuccess={onDocumentLoadSuccess}
      onDocumentLoadError={onDocumentLoadError}
      extensions={extensions}
      onModelLoaded={onModelLoaded}
      onViewerInitialized={onViewerInitialized}
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
  no-use-before-define: 0,
  no-restricted-syntax:0,
  no-unused-vars:0,
  max-classes-per-file: 0,
  no-underscore-dangle: 0,
  no-undef: 0
*/
