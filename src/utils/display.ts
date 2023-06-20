export function isFullscreen(monitor: Monitor): boolean {
  return monitor.inFullscreen;
}

export function isInOverview(): boolean {
  const layoutManager = imports.ui.main.layoutManager;

  return layoutManager._inOverview;
}
