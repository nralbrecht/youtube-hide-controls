export class Settings {
    constructor() {
        this.onChangeCallbacks = [];

        this.triggerTop = -1;
        this.triggerLeft = 5;
        this.triggerRight = 5;
        this.triggerBottom = -1;

        this.hotkey = null;
        this.useHotkey = false;
        this.onlyHotkey = false;
        this.invertTrigger = false;
        this.onlyFullscreen = true;

        chrome.storage.local.get(null, (result) => {
            console.log(result);
        });
        chrome.storage.local.get([
            "triggerTop",
            "triggerLeft",
            "triggerRight",
            "triggerBottom",
            "hotkey",
            "useHotkey",
            "onlyHotkey",
            "invertTrigger",
            "onlyFullscreen"
        ], (result) => {
            for (let value in result) {
                if (value in this) {
                    this[value] = result[value];
                }
            }
        });

        chrome.storage.onChanged.addListener((changes) => {
            console.log(changes);

            let changedSomething = false;
            for (let value in changes) {
                if (value in this) {
                    this[value] = changes[value].newValue;
                    changedSomething = true;
                }
            }

            if (changedSomething) {
                for (let callback of this.onChangeCallbacks) {
                    callback();
                }
            }
        });
    }

    addOnChangeListener(callback) {
        this.onChangeCallbacks.push(callback);
    }

}
