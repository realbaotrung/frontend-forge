import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../utils/ForgeViewer';
import {selectFlattedErrorDoorsFromFsCheckDoors} from '../../../../slices/forgeStandard/checkDoors';

const style = {
  width: 'calc((100vw - 600px))',
  height: 'calc(100vh - 48px)',
};

export default function ForgeViewerTest({token, urn, guid}) {
  const flattedErrorDoors = useSelector(
    selectFlattedErrorDoorsFromFsCheckDoors,
  );

  console.log('flatted error door', flattedErrorDoors)

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

  const initCheckStandardViewer = (myViewer) => {
    const databaseId = [];

    const externalIds = [
      '1bc90e37-6cbb-42af-b034-1007e3059ce3-00056a5a',
      '1bc90e37-6cbb-42af-b034-1007e3059ce3-00056a24',
      '43fffdab-cac7-4545-aa1f-72f77344d607-00056fba',
      '43fffdab-cac7-4545-aa1f-72f77344d607-00056fb9',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-000570a3',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-000570a2',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-00057173',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-00057172',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-0005718c',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-0005718b',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-00057196',
      'f93ec7a7-810c-4afd-be9f-8120a305dbdd-00057195',
    ];

    // const externalIds = [...flattedErrorDoors];

    const onSelectionEvent = () => {
      const selectedIds = myViewer.getSelection();

      // ==============================================================
      // Should have this Condition to guard agains
      // viewer3D.min.js:sourcemap:18 Uncaught RangeError:
      // Maximum call stack size exceeded
      // ==============================================================
      if (selectedIds.length === 0 || !databaseId.includes(selectedIds[0])) {
        // myViewer.select(databaseId)
        // myViewer.hide(databaseId[0])
        // myViewer.lockSelection(databaseId, true)
        myViewer.isolate(databaseId);
        myViewer.fitToView(databaseId);
      }
    };

    const OnConvertExtIdToDbId = () => {
      const onSuccessCallback = (mappingObject) => {
        // ==============================================================
        // The magic starts here...
        // All external Id will be mapped and converted to 'dbid'
        // ==============================================================
        externalIds.forEach((externalId) =>
          databaseId.push(mappingObject[externalId]),
        );
        console.log('from ForgeViewerTest: ', databaseId);
      };
      const onErrorCallback = (data) => {
        console.log('Cannot convert externalId to DbId: ', data);
      };
      myViewer.model.getExternalIdMapping(onSuccessCallback, onErrorCallback);
    };

    const _createGroupButton = () => {
      let group = myViewer.toolbar.getControl('transformExtensionsToolbar');
      if (!group) {
        group = new Autodesk.Viewing.UI.ControlGroup(
          'transformExtensionsToolbar',
        );
        myViewer.toolbar.addControl(group);
      }
      return group;
    };

    const buttonIsolateNotStandardDoors = () => {
      const group = _createGroupButton();

      // Add a new button to the toolbar group
      const button = new Autodesk.Viewing.UI.Button(
        'transformExtensionButton1',
      );
      button.icon.style = `background-color: #003d99; background-size: 24px 24px;`;
      button.onClick = (e) => onSelectionEvent();

      button.setToolTip('Isolates not standard doors');

      group.addControl(button);
    };

    const buttonHighlightNotStandardDoors = () => {
      const group = _createGroupButton();

      // Add a new button to the toolbar group
      const button = new Autodesk.Viewing.UI.Button(
        'transformExtensionButton2',
      );

      button.icon.style = `background-color: #be4616; background-size: 24px 24px;`;
      button.onClick = (e) =>
        databaseId.forEach((id) => myViewer.toggleSelect(id));

      button.setToolTip('Highlight all not standard doors');

      group.addControl(button);
    };

    const getFloorData = () => {
      const floorData = myViewer.getExtension('Autodesk.Aec.LevelsExtension');
      console.log(floorData);
    };

    // Event to load each methods...

    myViewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      OnConvertExtIdToDbId,
    );

    myViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      buttonIsolateNotStandardDoors,
    );

    myViewer.addEventListener(
      Autodesk.Viewing.EXTENSION_LOADED_EVENT,
      buttonHighlightNotStandardDoors,
    );

    myViewer.addEventListener(
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
      getFloorData,
    );

    // myViewer.addEventListener(
    //   Autodesk.Viewing.SELECTION_CHANGED_EVENT,
    //   onSelectionEvent,
    // )
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
  no-restricted-syntax:0,
  no-unused-vars:0,
  max-classes-per-file: 0,
  no-underscore-dangle: 0,
  no-undef: 0
*/
