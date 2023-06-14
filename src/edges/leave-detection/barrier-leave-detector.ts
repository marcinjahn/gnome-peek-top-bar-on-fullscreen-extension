import { Barrier, HitDirection, Position, TriggerMode } from "../barrier";
import { LeaveDetector } from "./leave-detector";

export class BarrierLeaveDetector implements LeaveDetector {
  private barrier: Barrier;

  constructor(
    position: Position,
    hitDirection: HitDirection,
    leaveAction: () => void
  ) {
    this.barrier = new Barrier(
      position,
      hitDirection,
      TriggerMode.Instant,
      leaveAction
    );
  }

  activate() {
    this.barrier.activate();
  }

  dispose() {
    this.barrier?.dispose();
  }
}
