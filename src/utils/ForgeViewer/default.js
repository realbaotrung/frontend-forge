export const DEFAULT_VERSION = '7.*';

export const DEFAULT_INITIALIZER_OPTIONS = {
  env: 'AutodeskProduction',
  api: 'derivativeV2',
};
export const DEFAULT_DOCUMENT_LOAD_SUCCESS = (
  viewerDocument, // Autodesk.Viewing.Document
) => viewerDocument.getRoot().getDefaultGeometry();

export const DEFAULT_DOCUMENT_LOAD_ERROR = (
  errorCode, // Autodesk.Viewing.ErrorCodes
  errorMsg, // string
  messages, // any[]
) => {
  console.error(errorCode, errorMsg, messages);
};

export const DEFAULT_VIEWER_OPTIONS = {};

export const DEFAULT_VIEWABLE_OPTIONS = {};

export const DEFAULT_ON_INIT = () => {};

export const DEFAULT_EXTENSIONS = {
  'Autodesk.DocumentBrowser': 'Autodesk.DocumentBrowser',
  'Autodesk.BimWalk': 'Autodesk.BimWalk',
  'Autodesk.CrossFadeEffects': 'Autodesk.CrossFadeEffects',
  'Autodesk.Edit2D': 'Autodesk.Edit2D',
  'Autodesk.FullScreen': 'Autodesk.FullScreen',
  'Autodesk.Viewing.FusionOrbit': 'Autodesk.Viewing.FusionOrbit',
  'Autodesk.Geolocation': 'Autodesk.Geolocation',
  'Autodesk.BIM360.GestureDocumentNavigation': 'Autodesk.BIM360.GestureDocumentNavigation',
  'Autodesk.GoHome': 'Autodesk.GoHome',
  'Autodesk.Hyperlink': 'Autodesk.Hyperlink',
  'Autodesk.LayerManager': 'Autodesk.LayerManager',
  'Autodesk.Measure': 'Autodesk.Measure',
  'Autodesk.BIM360.Minimap': 'Autodesk.BIM360.Minimap',
  'Autodesk.ModelStructure': 'Autodesk.ModelStructure',
  'Autodesk.DefaultTools.NavTools': 'Autodesk.DefaultTools.NavTools',
  'Autodesk.Viewing.Popout': 'Autodesk.Viewing.Popout',
  'Autodesk.PropertiesManager': 'Autodesk.PropertiesManager',
  'Autodesk.BIM360.RollCamera': 'Autodesk.BIM360.RollCamera',
  'Autodesk.Viewing.SceneBuilder': 'Autodesk.Viewing.SceneBuilder',
  'Autodesk.Section': 'Autodesk.Section',
  'Autodesk.Snapping': 'Autodesk.Snapping',
  'Autodesk.ViewCubeUi': 'Autodesk.ViewCubeUi',
  'Autodesk.ViewerSettings': 'Autodesk.ViewerSettings',
  'Autodesk.Viewing.Wireframes': 'Autodesk.Viewing.Wireframes',
  'Autodesk.Viewing.ZoomWindow': 'Autodesk.Viewing.ZoomWindow',
};
