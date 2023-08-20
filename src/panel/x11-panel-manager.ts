import * as Main from "gnomejs://main.js";

import { PanelManager } from "./panel-manager";

const PanelBox = Main.layoutManager.panelBox;

export class X11PanelManager implements PanelManager {
  showPanel(): void {
    PanelBox.visible = true;
  }

  hidePanel(): void {
    PanelBox.visible = false;
  }

  dispose() {}
}
