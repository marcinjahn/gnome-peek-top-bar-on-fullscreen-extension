import { Actor } from "@gi-ts/clutter1";
import { registerGObjectClass } from "utils/gobject";

const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;

@registerGObjectClass
export class TopHotEdge extends Actor {
  private _enterPressureBarrier: any;
  private _enterBarrier: any;

  private _leavePressureBarrier: any;
  private _leaveBarrier: any;

  private _monitor: Monitor;

  private _triggerAction: () => void;
  private _leaveAction: () => void;
  private _leaveOffset: number;

  private _isTriggered = false;

  constructor(
    monitor: Monitor,
    leaveOffset: number,
    onTrigger: () => void,
    onLeave: () => void
  ) {
    super();

    this._monitor = monitor;
    this._triggerAction = onTrigger;
    this._leaveAction = onLeave;
    this._leaveOffset = leaveOffset;

    this.connect("destroy", this.onDestroy.bind(this));
  }

  initialize() {
    log("Creating hot edge");
    this._enterPressureBarrier = new imports.ui.layout.PressureBarrier(
      10, // treshold
      200,
      Shell.ActionMode.NORMAL
    );
    this._enterPressureBarrier.connect("trigger", this.onEnter.bind(this));

    const { x, y, width } = this._monitor;

    this._enterBarrier = new Meta.Barrier({
      display: global.display,
      x1: x,
      x2: x + width,
      y1: y,
      y2: y,
      directions: Meta.BarrierDirection.NEGATIVE_Y,
    });

    this._enterPressureBarrier.addBarrier(this._enterBarrier);
  }

  onDestroy() {
    if (this._enterBarrier) {
      this._enterPressureBarrier.removeBarrier(this._enterBarrier);
      this._enterBarrier.destroy();
      this._enterBarrier = null;
      this._enterPressureBarrier.destroy();
      this._enterPressureBarrier = null;
    }

    if (this._leaveBarrier) {
      this._leavePressureBarrier.removeBarrier(this._leaveBarrier);
      this._leaveBarrier.destroy();
      this._leaveBarrier = null;
      this._leavePressureBarrier.destroy();
      this._leavePressureBarrier = null;
    }
  }

  onEnter() {
    if (this._isTriggered) {
      return;
    }
    this._isTriggered = true;

    log("entered");

    // the below thing doesn't work well, because PressureBarrier seems to be broken
    // it'll be better to set up interval to check every 500ms if cursor is still within the bounds
    // of top panel
    const createLeaveStuff = () => {
      this._leavePressureBarrier = new imports.ui.layout.PressureBarrier(
        0,
        0,
        Shell.ActionMode.NORMAL
      );
      this._leavePressureBarrier.connect("trigger", this.onLeave.bind(this));

      const { x, y, width } = this._monitor;

      this._leaveBarrier = new Meta.Barrier({
        display: global.display,
        x1: x,
        x2: x + width,
        y1: y + this._leaveOffset,
        y2: y + this._leaveOffset,
        directions: Meta.BarrierDirection.POSITIVE_Y,
      });

      this._leavePressureBarrier.addBarrier(this._leaveBarrier);
    };

    createLeaveStuff();

    this._triggerAction();
  }

  onLeave() {
    if (!this._isTriggered) {
      return;
    }
    this._isTriggered = false;

    if (this._leaveBarrier) {
      this._leavePressureBarrier.removeBarrier(this._leaveBarrier);
      this._leaveBarrier.destroy();
      this._leaveBarrier = null;
      this._leavePressureBarrier.destroy();
      this._leavePressureBarrier = null;
    }

    log("left");

    this._leaveAction();
  }
}
