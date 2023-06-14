const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;

export class Barrier {
  private pressureBarrier: any;
  private nativeBarrier: any;

  constructor(
    private position: Position,
    private hitDirection: HitDirection,
    private triggerMode: TriggerMode,
    private triggerAction: () => void
  ) {}

  activate() {
    this.pressureBarrier = new imports.ui.layout.PressureBarrier(
      this.triggerMode === TriggerMode.Delayed ? 15 : 0,
      this.triggerMode === TriggerMode.Delayed ? 200 : 0,
      Shell.ActionMode.NORMAL
    );
    this.pressureBarrier.connect("trigger", this.onTrigger.bind(this));

    const { x1, x2, y1, y2 } = this.position;

    this.nativeBarrier = new Meta.Barrier({
      display: global.display,
      x1,
      x2,
      y1,
      y2,
      directions:
        this.hitDirection === HitDirection.FromBottom
          ? Meta.BarrierDirection.POSITIVE_Y
          : Meta.BarrierDirection.NEGATIVE_Y,
    });

    this.pressureBarrier.addBarrier(this.nativeBarrier);
  }

  onTrigger() {
    this.triggerAction();
  }

  dispose() {
    if (!this.nativeBarrier) {
      return;
    }

    this.pressureBarrier?.removeBarrier(this.nativeBarrier);
    this.nativeBarrier.destroy();
    this.nativeBarrier = null;
    this.pressureBarrier?.destroy();
    this.pressureBarrier = null;
  }
}

export interface Position {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export enum HitDirection {
  FromTop,
  FromBottom,
}

export enum TriggerMode {
  Instant,
  Delayed,
}
