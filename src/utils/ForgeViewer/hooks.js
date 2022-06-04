import {useState, useRef, useEffect} from 'react';
import {
  DEFAULT_INITIALIZER_OPTIONS,
  DEFAULT_VIEWER_OPTIONS,
  DEFAULT_EXTENSIONS,
} from './default';
import {loadScripts} from './helpers';

/**
 * Custom hook to create forge viewer
 */
export function useForgeViewer({
  version,
  token,
  urn,
  initializerOptions,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  headless,
  viewerOptions,
  viewableOptions,
  onInit,
  disableLoader,
  extensions,
  onModelLoaded,
  onViewerInitialized,
  skipHiddenFragments,
}) {
  const viewerRef = useRef(null);
  const viewerDomRef = useRef(null);

  function onModelLoadedInside(event) {
    const viewer = viewerRef.current;

    const av = Autodesk.Viewing;
    viewer.removeEventListener(av.GEOMETRY_LOADED_EVENT, onModelLoadedInside);

    if (onModelLoaded) {
      onModelLoaded(viewer, event);
    }
  }

  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  /**
   * Loads the specified model into the viewer.
   *
   * @param {Object} viewer Initialized LMV object
   * @param {string} documentId Document URN of the model to be loaded
   */
  const loadModel = (currViewer, documentId) => {
    const DocumentLoadSuccessInside = (viewerDocument) => {
      const viewable = onDocumentLoadSuccess(viewerDocument);

      const viewableOpts = {...viewableOptions, skipHiddenFragments};

      currViewer.loadDocumentNode(viewerDocument, viewable, viewableOpts)
      // modify the preference settings, since ghosting is causing heavy z-fighting with the room geometry
      // it would be good we turn it off
      // currViewer.prefs.set('ghosting', false);
    };
    Autodesk.Viewing.Document.load(
      `urn:${documentId}`,
      DocumentLoadSuccessInside,
      onDocumentLoadError,
    );
  };

  // =============================================================================================
  // Initialize the viewer
  const initializeViewer = async () => {
    // see: https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/#initializer-options-callback
    const initializerOpts = {
      ...DEFAULT_INITIALIZER_OPTIONS,
      ...initializerOptions,
    };

    // add token here...
    initializerOpts.getAccessToken = (onTokenReady) => {
      const accessToken = token;
      const timeInSeconds = 3600; // Use value provided by Forge Authentication (OAuth) API
      onTokenReady(accessToken, timeInSeconds);
    };

    // see: https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/Viewer3D/#new-viewer3d-container-config
    const viewerOpts = {...DEFAULT_VIEWER_OPTIONS, ...viewerOptions};

    let viewer;

    Autodesk.Viewing.Initializer(initializerOpts, () => {
      if (headless) {
        viewer = new Autodesk.Viewing.Viewer3D(
          viewerDomRef.current,
          viewerOpts,
        );
      } else {
        viewer = new Autodesk.Viewing.GuiViewer3D(
          viewerDomRef.current,
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

      if (extensions) {
        extensions.forEach((extension) => {
          const extensionName = extension.extensionName;
          if (extensionName === DEFAULT_EXTENSIONS[extensionName]) {
            viewer.loadExtension(extensionName, viewerOptions);
          } else {
            Autodesk.Viewing.theExtensionManager.registerExtension(
              extension.extensionName,
              extension,
            );
            viewer.loadExtension(extension.extensionName, viewerOptions);
          }
        });
      }

      // ===========================
      // reference to viewer here...
      // ===========================
      viewerRef.current = viewer;

      // Start viewer
      const startedCode = viewer.start(
        undefined,
        undefined,
        undefined,
        undefined,
        initializerOpts,
      );
      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }

      const av = Autodesk.Viewing;
      viewer.addEventListener(av.GEOMETRY_LOADED_EVENT, onModelLoadedInside, {
        once: true,
      });
      loadModel(viewer, urn);

      if (onViewerInitialized) {
        onViewerInitialized(viewer);
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

  // triggered on forge scripts loaded
  useEffect(async() => {
    try {
      if (!window.Autodesk) {
        const res = await loadScripts(version);
        if (res) setScriptsLoaded(true);
      }
      setScriptsLoaded(true);
    } catch (error) {
      console.log(error)
    }

    if (scriptsLoaded) {
      await initializeViewer();
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.finish();
      }
    };
  }, [scriptsLoaded]);

  return {
    refs: {
      viewer: viewerDomRef,
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
