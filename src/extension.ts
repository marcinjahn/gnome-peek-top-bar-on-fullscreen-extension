import * as Main from "gnomejs://main.js";
import { Extension } from "gnomejs://extension.js";

import Meta from "@girs/meta-14";
import Gio from "@gi-ts/gio2";

import { HotEdge, EdgePosition } from "./edges/hot-edge";
import { isFullscreen, isInOverview } from "./utils/display";
import { delay, disposeDelayTimeouts } from "./utils/delay";
import { PanelManager } from "./panel/panel-manager";
import { WaylandPanelManager } from "panel/wayland-panel-manager";
import { X11PanelManager } from "panel/x11-panel-manager";
import {
  getPanelHeight,
  isAnyPanelMenuOpen,
  toggleAnyIndicator,
} from "panel/utils";

export default class PeekTopBarOnFullscreenExtension extends Extension {
  private hotEdge: HotEdge | null = null;
  private hotCornersSub: any = null;
  private panelManager: PanelManager | null = null;
  private settings: Gio.Settings | null = null;
  private settingsSub: number | null = null;

  enable() {
    console.log(`Enabling extension ${this.uuid}`);

    this.settings = this.getSettings();

    if (Meta.is_wayland_compositor()) {
      this.panelManager = WaylandPanelManager.createAndInitialize(this.path);
    } else {
      this.panelManager = new X11PanelManager();
    }

    const layoutManager = Main.layoutManager;
    this.hotCornersSub = layoutManager.connect("hot-corners-changed", () => {
      this.setupHotEdge();
    });

    this.settingsSub = this.settings.connect("changed::panel-edge", () => {
      this.setupHotEdge();
    });

    this.setupHotEdge();
  }

  setupHotEdge() {
    this.hotEdge?.dispose();

    const primaryMonitor = Main.layoutManager.primaryMonitor;
    const edgePosition = (this.settings!.get_string("panel-edge") ||
      "top") as EdgePosition;

    this.hotEdge = new HotEdge(
      primaryMonitor,
      edgePosition,
      getPanelHeight(),
      () => {
        if (!isFullscreen(primaryMonitor)) {
          return;
        }

        this.panelManager?.showPanel();
      },
      () => {
        if (!isFullscreen(primaryMonitor) || isInOverview()) {
          toggleAnyIndicator();
          return;
        }

        delay(200).then(() => {
          if (!isFullscreen(primaryMonitor) || isInOverview()) {
            toggleAnyIndicator();
            return;
          }

          this.panelManager?.hidePanel();
        });
      },
      () => !isAnyPanelMenuOpen() || isInOverview()
    );

    this.hotEdge.initialize();
    Main.layoutManager.hotCorners.push(this.hotEdge);
  }

  disable() {
    console.log(`Disabling extension ${this.uuid}`);

    this.hotEdge?.dispose();
    this.hotEdge = null;

    Main.layoutManager.disconnect(this.hotCornersSub);
    this.hotCornersSub = null;

    if (this.settingsSub !== null) {
      this.settings?.disconnect(this.settingsSub);
      this.settingsSub = null;
    }

    this.settings = null;

    this.panelManager?.dispose();
    this.panelManager = null;

    disposeDelayTimeouts();

    Main.layoutManager._updateHotCorners();
  }
}
