// Link examples:
// https://www.npmjs.com/package/@contecht/react-adsk-forge-viewer
// https://linuxhint.com/javascript-abstraction/
export class Extension {
  constructor(
    viewer, // Autodesk.Viewing.Viewer3D || Autodesk.Viewing.GuiViewer3D
    options, // Autodesk.Viewing.ExtensionOptions
  ) {
    if (this.constructor === Extension) {
      throw new Error('Cant not create an instance from abstract class');
    }
    this.viewer = viewer;
    this.extOptions = options || {};
  }

  load() {
    throw new Error(' Abstract method has no implementation');
  }

  unload() {
    throw new Error(' Abstract method has no implementation');
  }

  activate() {
    throw new Error(' Abstract method has no implementation');
  }

  deactivate() {
    throw new Error(' Abstract method has no implementation');
  }
}
