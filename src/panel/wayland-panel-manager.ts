import { registerClass } from "@gi-ts/gobject2";
import { PanelManager } from "./panel-manager";

const Main = imports.ui.main;
const PanelBox = Main.layoutManager.panelBox;
const StatusArea = Main.panel.statusArea;
const PopupMenu = imports.ui.popupMenu;
const PanelMenuButton = imports.ui.panelMenu.Button;

const TOP_BAR_DUMB_INDICATOR =
  "peek-top-bar-on-fullscreen@marcinjahn.com-indicator";

/**
 * On Wayland, making the panel visible is not enough,
 * there is some weird issue that causes the panel to stay invisible,
 * even though it becomes clickable. As a workaround, on Wayland a dumb
 * top bar indicator is added and activated when the panel is supposed
 * to show up. That causes the panel to be visible, at the cost
 * of requiring the user to click outside of the panel to hide it.
 */
export class WaylandPanelManager implements PanelManager {
  showPanel(): void {
    PanelBox.visible = true;

    Main.panel.addToStatusArea(
      TOP_BAR_DUMB_INDICATOR,
      new FullMenu(),
      0,
      "left"
    );
    StatusArea[TOP_BAR_DUMB_INDICATOR]?.menu.toggle();
  }

  hidePanel(): void {
    PanelBox.visible = false;
    StatusArea[TOP_BAR_DUMB_INDICATOR]?.destroy();
  }

  dispose() {
    StatusArea[TOP_BAR_DUMB_INDICATOR]?.destroy();
  }
}

@registerClass
export class FullMenu extends PanelMenuButton {
  constructor() {
    super(0.5, TOP_BAR_DUMB_INDICATOR);

    this.menu.addMenuItem(new PopupMenu.PopupBaseMenuItem());
    this.menu.actor.height = 0;
  }
}
