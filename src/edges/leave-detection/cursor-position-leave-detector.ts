import Glib from "@gi-ts/glib2";

import { HitDirection, Position } from "../barrier";
import { LeaveDetector } from "./leave-detector";

export class CursorPositionLeaveDetector implements LeaveDetector {
  private timeoutId: number | null = null;
  private boundsChecker: (mouseX: number, mouseY: number) => boolean;

  constructor(
    private position: Position,
    private hitDirection: HitDirection,
    private leaveAction: () => void,
    private leaveCondition?: () => boolean
  ) {
    switch (hitDirection) {
      case HitDirection.FromBottom:
        this.boundsChecker = this.fromBottomBoundsChecker;
        break;
      case HitDirection.FromTop:
        this.boundsChecker = this.fromTopBoundsChecker;
        break;
      case HitDirection.FromRight:
        this.boundsChecker = this.fromRightBoundsChecker;
        break;
      case HitDirection.FromLeft:
        this.boundsChecker = this.fromLeftBoundsChecker;
        break;
    }
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
    let [mouse_x, mouse_y, __] = global.get_pointer();

    return this.boundsChecker(mouse_x, mouse_y);
  }

  private fromTopBoundsChecker(mouseX: number, mouseY: number): boolean {
    return this.position.y1 < mouseY;
  }

  private fromBottomBoundsChecker(mouseX: number, mouseY: number): boolean {
    return this.position.y1 > mouseY;
  }

  private fromLeftBoundsChecker(mouseX: number, mouseY: number): boolean {
    return this.position.x1 < mouseX;
  }

  private fromRightBoundsChecker(mouseX: number, mouseY: number): boolean {
    return this.position.x1 > mouseX;
  }
}
