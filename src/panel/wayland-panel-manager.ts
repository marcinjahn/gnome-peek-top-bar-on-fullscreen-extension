import { registerClass } from "@gi-ts/gobject2";
import { delay } from "../utils/delay";
import { PanelManager } from "./panel-manager";
import { ActorAlign } from "@gi-ts/clutter1";

import { Actor } from "@gi-ts/clutter1";

import { spawn_command_line_async } from "@gi-ts/glib2";

const panelBox = imports.ui.main.layoutManager.panelBox;
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Main = imports.ui.main;

const TOP_BAR_DUMB_INDICATOR = "";

/**
 * On Wayland, making the panel visible is not enough,
 * there is some weird issue that causes the panel to stay invisible,
 * even though it becomes clickable. A workaround proposed by
 * Javad Rahmatzadeh is to modify panel's height, which
 * causes it to be rendered properly on the screen.
 * https://gitlab.gnome.org/jrahmatzadeh/just-perfection/-/blob/main/src/lib/API.js#L367-380
 */
export class WaylandPanelManager implements PanelManager {
  private heightChangeIsOn = false;
  private isInitialHeight = true;

  showPanel(): void {
    panelBox.visible = true;

    Main.panel.addToStatusArea(
      "topbaronfullscreenhelper",
      new FullMenu(),
      0,
      "left"
    );
    Main.panel.statusArea.topbaronfullscreenhelper.menu.toggle();

    // imports.ui.main.panel.toggleCalendar();
    // imports.ui.main.panel.toggleCalendar();
    // imports.ui.main.panel._leftBox.get_child_at_index(2).get_child().menu.toggle()
    log("calendar toggled");
    // this.heightChangeIsOn = true;
    // this.runHeightChanges();

    // let windowActor = new Actor({
    //   width: 400,
    //   height: 400,
    //   reactive: true
    //   });

    // let windowContent = new imports.gi.St.Label({
    //       text: 'Hello, World!'
    //   });

    // windowActor.add_child(windowContent);

    // global.stage.add_child(windowActor);

    // windowActor.show();

    // spawn_command_line_async('gjs /home/mnj/code/private/gnome-extensions/gnome-top-bar-on-fullscreen-extension/dist/app.js');

    // const app = new Shell.App();
    // app.activate();
    // log('fake app active');
  }

  private runHeightChanges() {
    const run = () => {
      if (!this.heightChangeIsOn && this.isInitialHeight) {
        return;
      }

      delay(20).then(() => {
        this.changeHeight();
        run();
      });
    };

    run();
  }

  private changeHeight() {
    if (this.isInitialHeight) {
      panelBox.height--;
      this.isInitialHeight = false;
    } else {
      panelBox.height++;
      this.isInitialHeight = true;
    }
  }

  hidePanel(): void {
    this.heightChangeIsOn = false;
    panelBox.visible = false;
    Main.panel.statusArea.topbaronfullscreenhelper.destroy();
  }

  dispose() {
    this.heightChangeIsOn = false;
    Main.panel.statusArea.topbaronfullscreenhelper?.destroy();
  }
}

@registerClass
export class FullMenu extends imports.ui.panelMenu.Button {
  public name = "FullMenu";

  constructor() {
    super(0.5, "full");

    this.menu.addMenuItem(new FullMenuItem());
    this.menu.actor.height = 1;
  }
}

@registerClass
class FullMenuItem extends imports.ui.popupMenu.PopupBaseMenuItem {}
