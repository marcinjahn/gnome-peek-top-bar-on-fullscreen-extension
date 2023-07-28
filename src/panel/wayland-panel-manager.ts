import { PanelManager } from "./panel-manager";
import { spawn_command_line_async } from "@gi-ts/glib2";

const Main = imports.ui.main;
const PanelBox = Main.layoutManager.panelBox;
const ExtensionUtils = imports.misc.extensionUtils;
const extensionPath = ExtensionUtils.getCurrentExtension().path;

/**
 * On Wayland, making the panel visible is not enough,
 * there is some weird issue that causes the panel to stay invisible,
 * even though it becomes clickable. As a workaround, on Wayland a concealed dumb
 * app with invisible window (always on top) is started. That makes the panel visible.
 */
export class WaylandPanelManager implements PanelManager {
  constructor() {
    spawn_command_line_async(
      `sh -c "GDK_BACKEND=x11 gjs ${extensionPath}/dummy-window.js"`
    );
  }

  showPanel(): void {
    PanelBox.visible = true;
  }

  hidePanel(): void {
    PanelBox.visible = false;
  }

  dispose(): void {
    spawn_command_line_async('pkill -f "marcinjahn.com/dummy-window.js"');
  }
}
