declare module "gnomejs://main.js" {
  export type DeviceItem = {
    label: {
      get_text: () => string;
      set_text: (text: string) => void;
    };
  };

  type VolumeIndicator = {
    _deviceItems: Map<number, DeviceItem>;
    _removeDevice: (id: number) => void;
    _addDevice: (id: number) => void;
  };

  export interface Monitor {
    width: number;
    height: number;
    x: number;
    y: number;
    inFullscreen: boolean;
  }

  export const panel: {
    statusArea: {
      dateMenu: {
        _eventsItem: {
          _reloadEvents: () => void;
        };
      };
      quickSettings: {
        _volumeOutput: {
          _output: VolumeIndicator;
        };
        _volumeInput: {
          _input: VolumeIndicator;
        };
        menu: {
          _grid: {
            get_children: () => [{ text: string }];
          };
        };
      };
    };
  };

  export const screenshotUI: {
    connect: (signalName: string, callback: () => void) => number;
    disconnect: (subscriptionId: number) => void;
    screencast_in_progress: boolean;
  };

  export const layoutManager: {
    connect: (signalName: string, callback: () => void) => number;
    disconnect: (subscriptionId: number) => void;
    primaryMonitor: Monitor;
    hotCorners: any[];
    _updateHotCorners: () => void;
    _inOverview: boolean;
    panelBox: {
      get_children(): any;
      visible: boolean;
    };
  };
}

declare module "gnomejs://extension.js" {
  export class Extension {
    uuid: string;
    path: string;
  }
}

declare module "gnomejs://prefs.js" {
  export class ExtensionPreferences {}
}

declare module "gi://Shell" {
  export enum ActionMode {
    NORMAL,
  }
}

declare module "gnomejs://layout.js" {
  import { ActionMode } from "gi://Shell";

  export class PressureBarrier {
    constructor(treshold: number, timeout: number, action: ActionMode);
    connect: (signalName: string, callback: () => void) => number;
    disconnect: (subscriptionId: number) => void;
    addBarrier(barrier: any): void;
    removeBarrier(barrier: any): void;
    destroy(): void;
  }
}
