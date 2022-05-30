import {ForgeExtension} from '..';

export class ShowSelectionExtension extends ForgeExtension {

  static extensionName = 'ShowSelectionExtension';

  onSelectionEvent() {
    const selectedIds = this.viewer.getSelection();
    // if (selectedIds.length == 0 || selectedIds[0] !== partId) {
    //   mainViewer.select(partId);
    //   mainViewer.fitToView([partId]);
    // }
    console.log('currentSelect: ', selectedIds.length)
  }

  load() {
    const onSelectionBinded = this.onSelectionEvent.bind(this);

    this.viewer.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      onSelectionBinded,
    );

    return true;
  }

  unload() {
    return true;
  }

  activate() {}

  deactivate() {}
}
