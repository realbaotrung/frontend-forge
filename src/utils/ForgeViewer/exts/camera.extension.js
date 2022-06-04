/* eslint-disable no-undef */

import { ForgeExtension } from "..";

/* eslint-disable no-underscore-dangle */
export class TurnTableExtension extends ForgeExtension {
  static get extensionName() { return 'TurnTableExtension' };

  constructor(viewer, options) {
      super(viewer, options);
      this._group = null;
      this._button = null;
      this.customize = this.customize.bind(this);
  }

  load() {
      if (this.viewer.model.getInstanceTree()) {
          this.customize();
      } else {
          this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this.customize());
      }        

      return true;
  }

  unload() {
      console.log('TurnTableExtension is now unloaded!');
      // Clean our UI elements if we added any
      if (this._group) {
          this._group.removeControl(this._button);
          if (this._group.getNumberOfControls() === 0) {
              this.viewer.toolbar.removeControl(this._group);
          }
      }
      return true;
  }

  customize() {

      const viewer = this.viewer;

      this._button = new Autodesk.Viewing.UI.Button('turnTableButton');
      this._button.addClass('toolbarCameraRotation');
      this._button.setToolTip('Start/Stop Camera rotation');

      // _group
      this._group = new Autodesk.Viewing.UI.ControlGroup('CameraRotateToolbar');
      this._group.addControl(this._button);
      this.viewer.toolbar.addControl(this._group);

      let started = false;

      const rotateCamera = () => {
          if (started) {
              requestAnimationFrame(rotateCamera);
          }

          const nav = viewer.navigation;
          const up = nav.getCameraUpVector();
          const axis = new THREE.Vector3(0, 0, 1);
          const speed = 10.0 * Math.PI / 180;
          const matrix = new THREE.Matrix4().makeRotationAxis(axis, speed * 0.1);

          const pos = nav.getPosition();
          pos.applyMatrix4(matrix);
          up.applyMatrix4(matrix);
          nav.setView(pos, new THREE.Vector3(0, 0, 0));
          nav.setCameraUpVector(up);
          const viewState = viewer.getState();
          // viewer.restoreState(viewState);

      };

      this._button.onClick = function (e) {
          started = !started;
          if (started) rotateCamera()
      };

  }

}
