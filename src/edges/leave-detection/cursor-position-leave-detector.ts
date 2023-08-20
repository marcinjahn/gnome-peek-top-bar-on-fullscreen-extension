import Glib from "@gi-ts/glib2";

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
    this.timeoutId = Glib.timeout_add(Glib.PRIORITY_DEFAULT, 400, () => {
      if (!this.isOutOfBounds() || !this.leaveCondition?.()) {
        return Glib.SOURCE_CONTINUE;
      }

      this.leaveAction();

      return Glib.SOURCE_REMOVE;
    });
  }

  dispose() {
    if (this.timeoutId) {
      Glib.source_remove(this.timeoutId);
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
