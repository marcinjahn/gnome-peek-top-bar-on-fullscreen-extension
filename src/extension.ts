import { TopHotEdge } from "./TopHotEdge";

const Main = imports.ui.main;

class Extension {
  private _uuid: string | null = null;
  private _hotCornersSub: any = null;

  constructor(uuid: string) {
    this._uuid = uuid;
  }

  enable() {
    log(`Enabling extension ${this._uuid}`);

    // setInterval(() => {
    //   log('interval')
    //   layoutManager.panelBox.visible = true;
    // }, 1000)

    const layoutManager = Main.layoutManager;
    this._hotCornersSub = layoutManager.connect(
      "hot-corners-changed",
      (data) => {
        log("hot-corners-changed");
        log(JSON.stringify(data));
        this.setupHotEdge();
      }
    );

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
    const layoutManager = Main.layoutManager;
    const primaryMonitor = layoutManager.primaryMonitor;

    const panelHeight = layoutManager.panelBox.get_children()[0].height;
    log("panel height: " + panelHeight);

    const edge = new TopHotEdge(
      primaryMonitor,
      panelHeight,
      () => {
        log("SHOW PANEL");

        if (!primaryMonitor.inFullscreen) {
          return;
        }

        // show
      },
      () => {
        log("HIDE PANEL");
        if (!primaryMonitor.inFullscreen) {
          return;
        }

        // hide
      }
    );

    edge.initialize();
    Main.layoutManager.hotCorners.push(edge);
  }

  disable() {
    log(`Disabling extension ${this._uuid}`);

    Main.layoutManager.disconnect(this._hotCornersSub);
    Main.layoutManager._updateHotCorners();
  }
}

export default function (meta: { uuid: string }): Extension {
  return new Extension(meta.uuid);
}
