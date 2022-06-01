import {useCallback} from 'react';
import PropsTypes from 'prop-types';
import ForgeViewer from '../../../../../../../../utils/ForgeViewer';
import {ExampleExtension} from '../../../../../../../../utils/ForgeViewer/exts/example.extension';
import {ShowSelectionExtension} from '../../../../../../../../utils/ForgeViewer/exts/showSelection.extension';
import { initCheckStandardViewer } from '../../../../../../../../utils/ForgeViewer/injected-functions/checkStandard.injected';

// ====================================
// For checking extensions
// ====================================
// const extensions = [ExampleExtension, ShowSelectionExtension];

const style = {
  // "width": "calc((100vw - 318px) / 2)",
  width: 'calc((100vw - 318px))',
  height: 'calc(100vh - 144px)',
};

export default function ForgeViewerTest({token, urn, guid}) {
  // const guid3dFromFV = useSelector(selectGuid3dViewFromFV);

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
        injectedFuncWithViewer={initCheckStandardViewer}
        // extensions={extensions}
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
