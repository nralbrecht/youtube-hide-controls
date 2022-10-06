export class Settings {
    constructor() {
        this.onChangeCallbacks = [];

        this.injectOptionButton = true;

        this.triggerTop = 0;
        this.triggerLeft = 5;
        this.triggerRight = 5;
        this.triggerBottom = 0;

        this.hotkey = null;
        this.useHotkey = false;
        this.useMouse = true;
        this.invertTrigger = false;
        this.onlyFullscreen = false;
        this.hideVideoOverlays = false;
        this.hidePlayPauseAnimation = false;

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

            }

            if (didMigrateCallback) {
                didMigrateCallback();
            }
        });
    }

    init(initCallback) {
        this.migrateOldSettings(() => {
            chrome.storage.local.get([
                "injectOptionButton",
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
                for (let key in result) {
                    if (key in this) {
                        this[key] = result[key];
                    }
                }

                this.emitOnChange();
                if (initCallback) {
                    initCallback();
                }
            });
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
