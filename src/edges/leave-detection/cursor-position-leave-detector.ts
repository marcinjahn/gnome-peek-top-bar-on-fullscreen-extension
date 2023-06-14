import {
  timeout_add,
  PRIORITY_DEFAULT,
  SOURCE_CONTINUE,
  source_remove,
  SOURCE_REMOVE,
} from "@gi-ts/glib2";

import { HitDirection, Position } from "../barrier";
import { LeaveDetector } from "./leave-detector";

export class CursorPositionLeaveDetector implements LeaveDetector {
  private timeoutId: number | null = null;
  private boundsChecker: (mouyseY: number) => boolean;

  constructor(
    private position: Position,
    hitDirection: HitDirection,
    private leaveAction: () => void,
    private leaveCondition?: () => boolean
  ) {
    this.boundsChecker =
      hitDirection === HitDirection.FromBottom
        ? this.fromBottomBoundsChecker
        : this.fromTopBoundsChecker;
  }

  activate() {
    this.timeoutId = timeout_add(PRIORITY_DEFAULT, 400, () => {
      if (!this.isOutOfBounds() || !this.leaveCondition?.()) {
        return SOURCE_CONTINUE;
      }

      this.leaveAction();

      return SOURCE_REMOVE;
    });
  }

  dispose() {
    if (this.timeoutId) {
      source_remove(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private isOutOfBounds(): boolean {
    let [_, mouse_y, __] = global.get_pointer();

    return this.boundsChecker(mouse_y);
  }

  private fromTopBoundsChecker(mouseY: number): boolean {
    return this.position.y1 < mouseY;
  }

  private fromBottomBoundsChecker(mouseY: number): boolean {
    return this.position.y1 > mouseY;
  }
}
