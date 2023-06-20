export interface PanelManager {
  showPanel(): void;
  hidePanel(): void;
  resetAnyTweaks(): void;
  dispose(): void;
}
