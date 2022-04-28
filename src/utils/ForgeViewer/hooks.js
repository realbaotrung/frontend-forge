import {useState, useRef, useEffect} from 'react';
import {
  DEFAULT_DOCUMENT_LOAD_ERROR,
  DEFAULT_DOCUMENT_LOAD_SUCCESS,
  DEFAULT_INITIALIZER_OPTIONS,
  DEFAULT_VIEWER_OPTIONS,
  DEFAULT_VERSION,
  DEFAULT_VIEWABLE_OPTIONS,
  DEFAULT_ON_INIT,
} from './default';
import {loadScripts} from './helpers';

/**
 * Custom hook to create forge viewer
 */
export function useForgeViewer({
  version = DEFAULT_VERSION,
  token,
  urn,
  initializerOptions,
  onDocumentLoadSuccess = DEFAULT_DOCUMENT_LOAD_SUCCESS,
  onDocumentLoadError = DEFAULT_DOCUMENT_LOAD_ERROR,
  headless = false,
  viewerOptions,
  viewableOptions = DEFAULT_VIEWABLE_OPTIONS,
  onInit = DEFAULT_ON_INIT,
  disableLoader = false,
  extensions,
}) {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const viewerRef = useRef(null);

  // see: https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/#initializer-options-callback
  const initializerOpts = {
    ...DEFAULT_INITIALIZER_OPTIONS,
    ...initializerOptions,
  };
  // add token here...
  initializerOpts.getAccessToken = (done) => done(token, 3600);

  // see: https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/Viewer3D/#new-viewer3d-container-config
  const viewerOpts = {...DEFAULT_VIEWER_OPTIONS, ...viewerOptions};

  // viewer object
  // api : https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/GuiViewer3D/
  let viewer; // Autodesk.Viewing.Viewer3D;

  // Initialize the viewer
  const initialize = () => {
    Autodesk.Viewing.Initializer(initializerOpts, () => {
      if (headless) {
        viewer = new Autodesk.Viewing.Viewer3D(viewerRef.current, viewerOpts);
      } else {
        viewer = new Autodesk.Viewing.GuiViewer3D(
          viewerRef.current,
          viewerOpts,
        );
      }
      viewer.addEventListener(Autodesk.Viewing.VIEWER_INITIALIZED, (e) => {
        if (disableLoader) {
          const spinnerContainer = viewer._loadingSpinner.domElement;
          while (spinnerContainer.hasChildNodes()) {
            spinnerContainer.removeChild(spinnerContainer.lastChild);
          }
        }
        onInit(e);
      });
      const startedCode = viewer.start();
      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }
      if (extensions) {
        extensions.forEach((extension) => {
          Autodesk.Viewing.theExtensionManager.registerExtension(
            extension.extensionName,
            extension,
          );
          viewer.loadExtension(extension.extensionName, viewerOptions);
        });
      }
    });
  };

  // ========================================================================
  // Aggregated View.....
  // ========================================================================
  // const initialize = () => {
  //   Autodesk.Viewing.Initializer(initializerOpts, () => {
  //     const view = new Autodesk.Viewing.AggregatedView(); // Autodesk.Viewing.AggregatedView;
  //     view.init(viewerRef.current, initializerOpts).then(() => {
  //       const bubbleNodes = [];
  //       Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) => {
  //         const nodes2D = doc.getRoot().search({role: '2d', type: 'geometry'});
  //         nodes2D.forEach(node => bubbleNodes.push(node))
  //         // view.setNodes(bubbleNodes);
  //         view.switchView([bubbleNodes[1], bubbleNodes[2], bubbleNodes[1]]);
  //         console.log('bubbleNodes', bubbleNodes)
  //         console.log('view', view)
  //       });
  //       view.switchView([bubbleNodes[1], bubbleNodes[2], bubbleNodes[1]]);
  //   });
  // })}

  // =============================================================================================

  const handleDocumentLoad = (viewerDocument) => {

    // const onDocumentLoadSuccess1 = (viewerDc) => {
      // viewerDc is Document
      // api : https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/Document/
      // const viewables = viewerDc.getRoot().search({type: 'geometry'});
      // console.log('viewables', viewables);
      // const view2Ds = viewables.find((v) => {
        // v is BubbleNode
        // api : https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/BubbleNode/
    //     console.log('viewSmall', v);
    //     return v.is2D()
    //   });
    //   console.log('view2Ds', view2Ds);
    //   return view2Ds;
    // };

    // const viewable = onDocumentLoadSuccess1(viewerDocument);
    // const viewable = onDocumentLoadSuccess2(viewerDocument);
    const viewable = onDocumentLoadSuccess(viewerDocument);
    viewer.loadDocumentNode(viewerDocument, viewable, viewableOptions);
  };
  // load model using Derivatives API
  const loadModel = () => {
    Autodesk.Viewing.Document.load(
      `urn:${urn}`,
      handleDocumentLoad,
      onDocumentLoadError,
    );
  };
  // triggered on forge scripts loaded
  useEffect(() => {
    if (!window.Autodesk) {
      loadScripts(version)
        .then(() => {
          setScriptsLoaded(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setScriptsLoaded(true);
    }
    if (scriptsLoaded) {
      initialize();
      loadModel();
    }
  }, [scriptsLoaded]);

  return {
    refs: {
      viewer: viewerRef,
    },
  };
}

/*
eslint
  no-underscore-dangle: 0,
  no-useless-return: 0,
  no-unused-vars: 0,
  no-undef: 0,
*/
