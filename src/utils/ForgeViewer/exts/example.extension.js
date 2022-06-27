import { ForgeExtension } from "..";

export class ExampleExtension extends ForgeExtension {
  static get extensionName() { return 'Autodesk.DocumentBrowser'};

  load() {
    // change selection color to red

    // this.viewer.(red, Autodesk.Viewing.SelectionType.MIXED);
    // viewer.loadExtension(this.extensionName)

    return true;
  }

  unload() {
    return true;
  }

  activate() {}

  deactivate() {}
}
