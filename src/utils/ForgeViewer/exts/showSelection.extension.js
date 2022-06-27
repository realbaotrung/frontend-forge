import {ForgeExtension} from '..';

// 1. from 'dbid' can get properties:
// getProperties(dbId, scb, ecb)
// getProperties2(dbId, scb, ecb) // async method

// 2. select highlight object by toogleSelect(dbId)

// 3. get number of selection: getSelectionCount()

// 4. get default Model: viewer.getAllModels()[0]
// Note: see result of: this.viewer.getAllModels()[0].getInstanceTree().nodeAccess | .dbIdToIndex() | .nameSuffixes() => get ElementId from Revit
// Note: see result of: this.viewer.model.getInstanceTree().nodeAccess | .dbIdToIndex() | .nameSuffixes() => get ElementId from Revit

// data["1bc90e37-6cbb-42af-b034-1007e3059ce3-00056ae7"]
// data["1bc90e37-6cbb-42af-b034-1007e3059ce3-00056ceb"]
// data["1bc90e37-6cbb-42af-b034-1007e3059ce3-00056d7d"]

const extIds = [
  '1bc90e37-6cbb-42af-b034-1007e3059ce3-000569cb',
  '1bc90e37-6cbb-42af-b034-1007e3059ce3-00056ceb',
  '1bc90e37-6cbb-42af-b034-1007e3059ce3-00056d7d',
];

export class ShowSelectionExtension extends ForgeExtension {
  static get extensionName() {
    return 'ShowSelectionExtension';
  }

  constructor(viewer, options) {
    super(viewer, options);

    this.externalId = extIds;

    this.onSelectionEvent = this.onSelectionEvent.bind(this);
    this.convertExternalIdToDatabaseId =
      this.convertExternalIdToDatabaseId.bind(this);
  }

  convertExternalIdToDatabaseId() {
    // const externalId = extIds;

    const onSuccessCallback = (data) => {
      // =======================
      // Get Database Id here...
      // TODO: save State redux to show here...
      // =======================
      // this.externalId.forEach((id) => console.log(data[id]));
      console.log(data);
    };

    const onErrorCallback = (data) => {
      console.log(data);
    };
    this.viewer.model.getExternalIdMapping(onSuccessCallback, onErrorCallback);
  }

  onSelectionEvent() {
    // const DBids = this.viewer.impl.selector.getAggregateSelection();
    // console.log('DBids', DBids);

    // const instanceTree = this.viewer.model.getInstanceTree()
    // console.log(instanceTree)

    // const selectedIds = this.viewer.getSelection();
    const selectedIds = [3081, 3082];
    // console.log('currentSelect: ', selectedIds);

    const scb = (data) => {
      console.log('getProperties: ', data);
      console.log('dbId: ', data?.dbId);
      console.log('externalId: ', data?.externalId);
    };
    const ecb = (data) => {};

    // BUG: Uncaught RangeError: Maximum call stack size exceeded
    // for (const id of selectedIds) {
    //   this.viewer.select(id);
    //   this.viewer.fitToView([id]);
    // }
    selectedIds.forEach((id) => {
      this.viewer.getProperties(id, scb, ecb);
    });
    // this.viewer.select(3082)
    // this.viewer.fitToView([3082]);

    // if (selectedIds.length == 0 || selectedIds[0] !== partId) {
    //   mainViewer.select(partId);
    //   mainViewer.fitToView([partId]);
    // }

    // if (this.dbId !== undefined) {
    //   console.log('from convert id:', this.dbId)
    //   this.viewer.toggleSelect(this.dbId)
    // }
  }

  async load() {
    // this.onSelectionBinded = this.onSelectionEvent.bind(this);

    // this.viewer.addEventListener(
    //   Autodesk.Viewing.SELECTION_CHANGED_EVENT,
    //   this.convertExternalIdToDatabaseId,
    // );

    this.viewer.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      this.onSelectionEvent,
    );

    return true;
  }

  async unload() {
    this.viewer.removeEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      this.convertExternalIdToDatabaseId,
    );

    this.viewer.removeEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      this.onSelectionEvent,
    );

    this.convertExternalIdToDatabaseId = null;
    this.onSelectionEvent = null;

    return true;
  }

  activate() {}

  deactivate() {}
}

/*
eslint
  no-restricted-syntax: 0
*/
