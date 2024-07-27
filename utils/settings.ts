import { HotKey } from "./hotkey";

export interface AddonSettings {
  injectOptionButton: boolean;
  trigger: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  hotkey: HotKey | undefined;
  useHotkey: boolean;
  useMouse: boolean;
  invertTrigger: boolean;
  onlyFullscreen: boolean;
  hideVideoOverlays: boolean;
  hidePlayPauseAnimation: boolean;
}
export const defaultAddonSettings: AddonSettings = {
  injectOptionButton: true,
  trigger: {
    top: 0,
    left: 5,
    right: 5,
    bottom: 0,
  },
  hotkey: undefined,
  useHotkey: false,
  useMouse: true,
  invertTrigger: false,
  onlyFullscreen: false,
  hideVideoOverlays: false,
  hidePlayPauseAnimation: false,
};

export const addonSettings = storage.defineItem<AddonSettings>("local:addonSettings", {
  defaultValue: defaultAddonSettings,
  version: 1,
  migrations: {},
});
