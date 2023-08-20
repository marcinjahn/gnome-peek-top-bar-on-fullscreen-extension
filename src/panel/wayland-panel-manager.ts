import * as Main from "gnomejs://main.js";

import Glib from "@gi-ts/glib2";

import { PanelManager } from "./panel-manager";

const PanelBox = Main.layoutManager.panelBox;

/**
 * On Wayland, making the panel visible is not enough,
 * there is some weird issue that causes the panel to stay invisible,
 * even though it becomes clickable. As a workaround, on Wayland a concealed dumb
 * app with invisible window (always on top) is started. That makes the panel visible.
 */
export class WaylandPanelManager implements PanelManager {
  private constructor(extensionPath: string) {
    this.extensionPath = extensionPath;
  }

  private extensionPath: string;

  static createAndInitialize(extensionPath: string): PanelManager {
    const manager = new WaylandPanelManager(extensionPath);
    manager.spawnDummyApp();

    return manager;
  }

  showPanel(): void {
    PanelBox.visible = true;
  }

  hidePanel(): void {
    PanelBox.visible = false;
  }

  dispose(): void {
    Glib.spawn_command_line_async('pkill -f "marcinjahn.com/dummy-window.js"');
  }

  private async spawnDummyApp() {
    Glib.spawn_command_line_async(
      `sh -c "GDK_BACKEND=x11 gjs ${this.extensionPath}/dummy-window.js"`
    );
  }
}
