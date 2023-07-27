import { PanelManager } from "./panel-manager";
import { spawn_command_line_async } from "@gi-ts/glib2";

const Main = imports.ui.main;
const PanelBox = Main.layoutManager.panelBox;

/**
 * On Wayland, making the panel visible is not enough,
 * there is some weird issue that causes the panel to stay invisible,
 * even though it becomes clickable. As a workaround, on Wayland a concealed dumb
 * window with active always on top makes it work as expected.
 */
export class WaylandPanelManager implements PanelManager {
  constructor() {
    spawn_command_line_async(
      "gjs .local/share/gnome-shell/extensions/peek-top-bar-on-fullscreen@marcinjahn.com/dummy-window.js"
    );
  }

  showPanel(): void {
    PanelBox.visible = true;
  }

  hidePanel(): void {
    PanelBox.visible = false;
  }

  resetAnyTweaks() {}

  dispose(): void {}
}
