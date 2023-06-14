import { getPanelHeight, hidePanel, showPanel } from "utils/panel";
import { HotEdge } from "./edges/hot-edge";
import { isFullscreen } from "utils/display";

const Main = imports.ui.main;

class Extension {
  private uuid: string | null = null;
  private hotEdge: HotEdge | null = null;
  private hotCornersSub: any = null;

  constructor(uuid: string) {
    this.uuid = uuid;
  }

  enable() {
    log(`Enabling extension ${this.uuid}`);

    const layoutManager = Main.layoutManager;
    this.hotCornersSub = layoutManager.connect("hot-corners-changed", () => {
      log("hot-corners-changed");
      this.setupHotEdge();
    });

    this.setupHotEdge();

    // const display = global.display;

    // fires whenever something goes fullscreen (or out of it) on any screen
    // display.connect('in-fullscreen-changed', () => {
    //   log('in-fullscreen-changed event fired');

    //   // find out if primary monitor is fullscreen
    //   const primaryMonitor = layoutManager.primaryMonitor;
    //   if (!primaryMonitor.inFullscreen) {
    //     return;
    //   }
    // });
  }

  setupHotEdge() {
    this.hotEdge?.dispose();

    const primaryMonitor = Main.layoutManager.primaryMonitor;

    this.hotEdge = new HotEdge(
      primaryMonitor,
      getPanelHeight(),
      () => {
        if (!isFullscreen(primaryMonitor)) {
          return;
        }

        log("SHOW PANEL");
        showPanel();
      },
      () => {
        if (!isFullscreen(primaryMonitor)) {
          return;
        }

        log("HIDE PANEL");
        hidePanel();
      }
    );

    this.hotEdge.initialize();
    Main.layoutManager.hotCorners.push(this.hotEdge);
  }

  disable() {
    log(`Disabling extension ${this.uuid}`);

    this.hotEdge?.dispose();
    this.hotEdge = null;

    Main.layoutManager.disconnect(this.hotCornersSub);
    this.hotCornersSub = null;

    Main.layoutManager._updateHotCorners();
  }
}

export default function (meta: { uuid: string }): Extension {
  return new Extension(meta.uuid);
}
