import { Monitor } from "gnomejs://main.js";

import Clutter from "@gi-ts/clutter1";

import { registerGObjectClass } from "../utils/gobject";
import { Barrier, HitDirection, TriggerMode, Position } from "./barrier";
import { LeaveDetector, CursorPositionLeaveDetector } from "./leave-detection";

export type EdgePosition = "top" | "bottom" | "left" | "right";

/**
 * Edge detection with configurable edge position
 */
@registerGObjectClass
export class HotEdge extends Clutter.Actor {
  private barrier: Barrier | null = null;
  private leaveDetector: LeaveDetector | null = null;
  private _isTriggered = false;

  constructor(
    private monitor: Monitor,
    private edgePosition: EdgePosition,
    private leaveOffset: number,
    private triggerAction: () => void,
    private leaveAction: () => void,
    private leaveCondition?: () => boolean
  ) {
    super();
    this.connect("destroy", this.dispose.bind(this));
  }

  initialize() {
    const { x, y, width, height } = this.monitor;

    const barrierPosition = this.getBarrierPosition(x, y, width, height);
    const hitDirection = this.getHitDirection();

    this.barrier = new Barrier(
      barrierPosition,
      hitDirection,
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

    const { x, y, width, height } = this.monitor;

    const leavePosition = this.getLeavePosition(x, y, width, height);
    const leaveHitDirection = this.getLeaveHitDirection();

    this.leaveDetector = new CursorPositionLeaveDetector(
      leavePosition,
      leaveHitDirection,
      this.onLeave.bind(this),
      this.leaveCondition
    );

    this.leaveDetector.activate();

    this.triggerAction();
  }

  private getBarrierPosition(
    x: number,
    y: number,
    width: number,
    height: number
  ): Position {
    switch (this.edgePosition) {
      case "top":
        return {
          x1: x,
          x2: x + width,
          y1: y + 1,
          y2: y + 1,
        };
      case "bottom":
        return {
          x1: x,
          x2: x + width,
          y1: y + height - 1,
          y2: y + height - 1,
        };
      case "left":
        return {
          x1: x + 1,
          x2: x + 1,
          y1: y,
          y2: y + height,
        };
      case "right":
        return {
          x1: x + width - 1,
          x2: x + width - 1,
          y1: y,
          y2: y + height,
        };
    }
  }

  private getHitDirection(): HitDirection {
    switch (this.edgePosition) {
      case "top":
        return HitDirection.FromBottom;
      case "bottom":
        return HitDirection.FromTop;
      case "left":
        return HitDirection.FromRight;
      case "right":
        return HitDirection.FromLeft;
    }
  }

  private getLeavePosition(
    x: number,
    y: number,
    width: number,
    height: number
  ): Position {
    switch (this.edgePosition) {
      case "top":
        return {
          x1: x,
          x2: x + width,
          y1: y + this.leaveOffset,
          y2: y + this.leaveOffset,
        };
      case "bottom":
        return {
          x1: x,
          x2: x + width,
          y1: y + height - this.leaveOffset,
          y2: y + height - this.leaveOffset,
        };
      case "left":
        return {
          x1: x + this.leaveOffset,
          x2: x + this.leaveOffset,
          y1: y,
          y2: y + height,
        };
      case "right":
        return {
          x1: x + width - this.leaveOffset,
          x2: x + width - this.leaveOffset,
          y1: y,
          y2: y + height,
        };
    }
  }

  private getLeaveHitDirection(): HitDirection {
    switch (this.edgePosition) {
      case "top":
        return HitDirection.FromTop;
      case "bottom":
        return HitDirection.FromBottom;
      case "left":
        return HitDirection.FromLeft;
      case "right":
        return HitDirection.FromRight;
    }
  }

  onLeave() {
    if (!this._isTriggered) {
      return;
    }

    this._isTriggered = false;
    this.disposeOfLeaveDetector();
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
