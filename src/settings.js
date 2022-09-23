export class Settings {
    constructor(onAfterInitCallback) {
        this.onChangeCallbacks = [];

        this.triggerTop = 0;
        this.triggerLeft = 5;
        this.triggerRight = 5;
        this.triggerBottom = 0;

        this.hotkey = null;
        this.useHotkey = false;
        this.useMouse = false;
        this.invertTrigger = false;
        this.onlyFullscreen = true;
        this.hideVideoOverlays = false;
        this.hidePlayPauseAnimation = false;

        this.migrateOldSettings(onAfterInitCallback);

        chrome.storage.local.get([
            "triggerTop",
            "triggerLeft",
            "triggerRight",
            "triggerBottom",
            "hotkey",
            "useHotkey",
            "useMouse",
            "invertTrigger",
            "onlyFullscreen",
            "hideVideoOverlays",
            "hidePlayPauseAnimation",
        ], (result) => {
            for (let value in result) {
                if (value in this) {
                    this[value] = result[value];
                }
            }

            if (onAfterInitCallback) {
                onAfterInitCallback();
            }
        });

        chrome.storage.onChanged.addListener((changes) => {
            let changedSomething = false;
            for (let key in changes) {
                if (key in this && changes[key].newValue !== this[key]) {
                    this[key] = changes[key].newValue;
                    changedSomething = true;
                }
            }

            if (changedSomething) {
                this.emitOnChange();
            }
        });
    }

    migrateOldSettings(didMigrateCallback) {
        chrome.storage.local.get([
            "onlyHotkey",
        ], (result) => {
            if ("onlyHotkey" in result) {
                this.remove("onlyHotkey");

                if (result["onlyHotkey"]) {
                    this.set("useMouse", this.useMouse = false);
                    this.set("useHotkey", this.useHotkey = true);
                }
                else {
                    this.set("useMouse", this.useMouse = true);
                    this.set("useHotkey", this.useHotkey = true);
                }

                if (didMigrateCallback) {
                    didMigrateCallback();
                }
            }
        });
    }

    addOnChangeListener(callback) {
        this.onChangeCallbacks.push(callback);
    }
    emitOnChange() {
        for (let callback of this.onChangeCallbacks) {
            callback();
        }
    }

    set(key, value, callback) {
        if (value in this) {
            this[key] = value;
        }

        chrome.storage.local.set({
            [key]: value
        });

        if (callback) {
            callback();
        }
    }
    remove(key) {
        browser.storage.local.remove(key);
    }
}
