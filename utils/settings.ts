import { HotKey } from "./hotkey";

export class Settings {
  public injectOptionButton = storage.defineItem<boolean>("local:injectOptionButton", {
    defaultValue: true,
  });

  public triggerTop = storage.defineItem<number>("local:triggerTop", {
    defaultValue: 0,
  });
  public triggerLeft = storage.defineItem<number>("local:triggerLeft", {
    defaultValue: 5,
  });
  public triggerRight = storage.defineItem<number>("local:triggerRight", {
    defaultValue: 5,
  });
  public triggerBottom = storage.defineItem<number>("local:triggerBottom", {
    defaultValue: 0,
  });

  public hotkey = storage.defineItem<HotKey | undefined>("local:triggerBottom", {
    defaultValue: undefined,
  });

  public useHotkey = storage.defineItem<boolean>("local:useHotkey", {
    defaultValue: false,
  });
  public useMouse = storage.defineItem<boolean>("local:useMouse", {
    defaultValue: true,
  });
  public invertTrigger = storage.defineItem<boolean>("local:invertTrigger", {
    defaultValue: false,
  });
  public onlyFullscreen = storage.defineItem<boolean>("local:onlyFullscreen", {
    defaultValue: false,
  });
  public hideVideoOverlays = storage.defineItem<boolean>("local:hideVideoOverlays", {
    defaultValue: false,
  });
  public hidePlayPauseAnimation = storage.defineItem<boolean>("local:hidePlayPauseAnimation", {
    defaultValue: false,
  });

  addOnChangeListener(callback: () => void) {
    this.injectOptionButton.watch(callback);
    this.triggerTop.watch(callback);
    this.triggerLeft.watch(callback);
    this.triggerRight.watch(callback);
    this.triggerBottom.watch(callback);
    this.hotkey.watch(callback);
    this.useHotkey.watch(callback);
    this.useMouse.watch(callback);
    this.invertTrigger.watch(callback);
    this.onlyFullscreen.watch(callback);
    this.hideVideoOverlays.watch(callback);
    this.hidePlayPauseAnimation.watch(callback);
  }
}
