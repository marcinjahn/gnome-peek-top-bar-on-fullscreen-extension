import { Barrier, HitDirection, Position, TriggerMode } from "../barrier";

export class BarrierLeaveDetector {
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
