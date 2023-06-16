import { PanelManager } from "./panel-manager";

const panelBox = imports.ui.main.layoutManager.panelBox;

export class X11PanelManager implements PanelManager {
  showPanel(): void {
    panelBox.visible = true;
  }

  hidePanel(): void {
    panelBox.visible = false;
  }

  dispose() {}
}
