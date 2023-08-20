import * as Main from "gnomejs://main.js";
import { Monitor } from "gnomejs://main.js";

export function isFullscreen(monitor: Monitor): boolean {
  return monitor.inFullscreen;
}

export function isInOverview(): boolean {
  const layoutManager = Main.layoutManager;

  return layoutManager._inOverview;
}
