import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../utils/ForgeViewer';
import {
  selectFlattedDataFromFsCheckDoors,
  selectFlattedDbIdErrorDoorsFromFsCheckDoors,
  selectFlattedExternalIdErrorDoorsFromFsCheckDoors,
  selectIsShowAllDbIdErrorDoorsFromFsCheckDoors,
  selectIsShowDbIdErrorDoorsFromFsCheckDoors,
  selectWarningDataAtLevelFromFsCheckDoors,
  setFlattedData,
  setFlattedDbIdErrorDoors,
  setIsShowDbIdErrorDoors,
  showAllDbIdErrorDoors,
} from '../../../../slices/forgeStandard/checkDoors';

const style = {
  width: 'calc((100vw - 600px))',
  height: 'calc(100vh - 48px)',
};

const dataIds = [
  3064, 3063, 3096, 3095, 3106, 3105, 3140, 3139, 3158, 3157, 3168, 3167,
];

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

  const isShowDbIdErrorDoorsFromFsCheckDoors = useSelector(
    selectIsShowDbIdErrorDoorsFromFsCheckDoors,
  );

  const flattedDbIdErrorDoors = useSelector(
    selectFlattedDbIdErrorDoorsFromFsCheckDoors,
  );

  const warningDataAtLevel = useSelector(
    selectWarningDataAtLevelFromFsCheckDoors,
  );

  const flattedDataFromFS = useSelector(selectFlattedDataFromFsCheckDoors);

  // ===================================
  const dispatch = useDispatch();
  // ===================================

  // =========================
  // UseEffect viewer....
  // =========================
  useEffect(() => {
    const currViewer = viewRef.current;

    if (currViewer !== null) {
      console.log('viewer from useEffect: ', currViewer);

      // ==================================
      // On Button Show All Errors click...
      // ==================================
      if (isShowAllDbIdErrorDoorsFromFsCheckDoors && flattedDbIdErrorDoors) {
        currViewer.isolate(flattedDbIdErrorDoors);
        currViewer.select(flattedDbIdErrorDoors);
        currViewer.fitToView(flattedDbIdErrorDoors);
        dispatch(showAllDbIdErrorDoors(false));
      }

      if (warningDataAtLevel) {
        const flattedData = [];
        const onConvertExtIdToDbId = () => {
          const onSuccessCallback = (mappingObject) => {
            warningDataAtLevel
              .flat()
              .forEach((externalId) =>
                flattedData.push(mappingObject[externalId]),
              );
          };
          const onErrorCallback = (data) => {
            console.log('Cannot convert externalId to DbId: ', data);
          };
          currViewer.model.getExternalIdMapping(
            onSuccessCallback,
            onErrorCallback,
          );
        };

        onConvertExtIdToDbId();
        console.log(flattedData)
        dispatch(setFlattedData(flattedData));
      }
    }
  }, [
    warningDataAtLevel,
    isShowAllDbIdErrorDoorsFromFsCheckDoors,
    flattedDbIdErrorDoors,
    setFlattedData
  ]);

  useEffect(() => {
    // TODO: need fixed show error doors here
    const currViewer2 = viewRef.current;

    if (currViewer2 !== null) {
      if (isShowDbIdErrorDoorsFromFsCheckDoors && flattedDataFromFS) {
        currViewer2.isolate(flattedDataFromFS);
        currViewer2.select(flattedDataFromFS);
        dispatch(setIsShowDbIdErrorDoors(false));
      }

      // TODO: handle all view error
    }
  }, [isShowDbIdErrorDoorsFromFsCheckDoors, flattedDataFromFS]);

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

  const initCheckStandardViewer = (view) => {
    // =============================
    // Set Referent viewer here....
    // =============================
    viewRef.current = view;

    const databaseId = [];

    const onConvertExtIdToDbId = () => {
      const onSuccessCallback = (mappingObject) => {
        // ==============================================================
        // The magic starts here...
        // All external Id will be mapped and converted to 'dbid'
        // ==============================================================
        flattedExternalIdErrorDoors.forEach((externalId) =>
          databaseId.push(mappingObject[externalId]),
        );
        console.log('from ForgeViewerTest: ', databaseId);
        // ==============================================================
        // Dispatch to set all databaseId that have converted to Store
        // ==============================================================
        dispatch(setFlattedDbIdErrorDoors(databaseId));
      };
      const onErrorCallback = (data) => {
        console.log('Cannot convert externalId to DbId: ', data);
      };
      view.model.getExternalIdMapping(onSuccessCallback, onErrorCallback);
    };

    view.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      onConvertExtIdToDbId,
    );
  };

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
  no-use-before-define: 0,
  no-restricted-syntax:0,
  no-unused-vars:0,
  max-classes-per-file: 0,
  no-underscore-dangle: 0,
  no-undef: 0
*/
