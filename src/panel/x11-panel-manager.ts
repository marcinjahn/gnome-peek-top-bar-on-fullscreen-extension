import { PanelManager } from "./panel-manager";

const PanelBox = imports.ui.main.layoutManager.panelBox;

export class X11PanelManager implements PanelManager {
  showPanel(): void {
    PanelBox.visible = true;
  }

  hidePanel(): void {
    PanelBox.visible = false;
  }

  resetAnyTweaks(): void {}

  dispose() {}
}
