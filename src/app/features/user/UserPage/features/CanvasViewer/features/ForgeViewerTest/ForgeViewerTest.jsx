/* eslint-disable no-plusplus */
import {useCallback, useEffect, useState} from 'react';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../../../../utils/ForgeViewer';
import {ExampleExtension} from '../../../../../../../../utils/ForgeViewer/exts/example.extension';
import {ShowSelectionExtension} from '../../../../../../../../utils/ForgeViewer/exts/showSelection.extension';

// const extensions = [ExampleExtension, ShowSelectionExtension];
const extensions = [ShowSelectionExtension];

const style = {
  // "width": "calc((100vw - 318px) / 2)",
  width: 'calc((100vw - 318px))',
  height: 'calc(100vh - 144px)',
};

const outputText = {
  value: '',
};

function viewerGetProperties(viewer1, outputTextArea) {
  // Callback for view.getProperties() on success.
  function propCallback(data) {
    // Check if we got properties.
    if (!data?.properties) {
      outputTextArea = 'no properties';
      return;
    }

    // Iterate over properties and put together
    // a list of property's name/value pairs to display.
    let str = '';
    const length = data.properties.length;

    for (let i = 0; i < length; i++) {
      const obj = data.properties[i];
      str += `${obj.displayName}: ${obj.displayValue}\n`;
    }

    outputTextArea = str;
  }

  function propErrorCallback(data) {
    outputTextArea = 'error in getProperties().';
  }

  //----------------------------------------
  // Main - Properties
  //---------------------

  if (viewer1.getSelection().length > 0) {
    const objSelected = viewer1.getSelection()[0];
    viewer1.getProperties(objSelected, propCallback, propErrorCallback);
  } else {
    outputTextArea = 'Please select one element to show properties.';
  }

  return outputTextArea;
}

export default function ForgeViewerTest({token, urn, guid}) {
  // const guid3dFromFV = useSelector(selectGuid3dViewFromFV);

  const onDocumentLoadSuccess = useCallback((document) => {
    const bubbleNode = document?.getRoot();

    // ===============================

    // const logger = viewerGetProperties(viewer, outputText);
    // console.log('logger document: ', logger)
    // const viewables = bubbleNode?.search({type: 'geometry'});

    // ===============================
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
    <div>
      <div>
        Items selected: <span id='MySelectionValue'>0</span>
      </div>
      <ForgeViewer
        disableLoader
        token={token}
        urn={urn}
        className='adsk-viewing-viewer'
        style={style}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onDocumentLoadError={onDocumentLoadError}
        extensions={extensions}
      />
    </div>
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
