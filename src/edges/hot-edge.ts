import { Actor } from "@gi-ts/clutter1";
import { registerGObjectClass } from "utils/gobject";
import { Barrier, HitDirection, TriggerMode } from "./barrier";
import { BarrierLeaveDetector } from "./leave-detection/barrier-leave-detector";

const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;

/**
 * Edge detection, hardcoded for top edge, since
 * I don't need anything else at the moment
 */
@registerGObjectClass
export class HotEdge extends Actor {
  private barrier: Barrier | null = null;
  private leaveDetector: BarrierLeaveDetector | null = null;
  private _isTriggered = false;

  constructor(
    private monitor: Monitor,
    private leaveOffset: number,
    private triggerAction: () => void,
    private leaveAction: () => void
  ) {
    super();
    this.connect("destroy", this.dispose.bind(this));
  }

  initialize() {
    log("Creating hot edge");
    const { x, y, width } = this.monitor;

    this.barrier = new Barrier(
      {
        x1: x,
        x2: x + width,
        y1: y,
        y2: y,
      },
      HitDirection.FromBottom,
      TriggerMode.Delayed,
      this.onEnter.bind(this)
    );

    this.barrier.activate();
  }

  onEnter() {
    if (this._isTriggered) {
      return;
    }
    this._isTriggered = true;

    log("entered");

    const { x, y, width } = this.monitor;

    this.leaveDetector = new BarrierLeaveDetector(
      {
        x1: x,
        x2: x + width,
        y1: y + this.leaveOffset,
        y2: y + this.leaveOffset,
      },
      HitDirection.FromTop,
      this.onLeave.bind(this)
    );

    this.leaveDetector.activate();

    this.triggerAction();
  }

  onLeave() {
    if (!this._isTriggered) {
      return;
    }

    this._isTriggered = false;

    this.disposeOfLeaveDetector();

    log("left");

    this.leaveAction();
  }

  dispose() {
    this.barrier?.dispose();
    this.barrier = null;
    this.disposeOfLeaveDetector();
  }

  disposeOfLeaveDetector() {
    this.leaveDetector?.dispose();
    this.leaveDetector = null;
  }
}
