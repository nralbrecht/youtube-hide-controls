import { Settings } from "../settings";

let injectOptionButtonInput = document.querySelector("#injectOptionButton input");
let hideVideoOverlaysInput = document.querySelector("#hideVideoOverlays input");
let hidePlayPauseAnimationInput = document.querySelector("#hidePlayPauseAnimation input");

let mouseSection = document.querySelector("#useMouse");
let useMouseInput = document.querySelector("#useMouse .section-header input");

let presetSelect = document.querySelector("#preset select");
let presetSelectStyled = document.querySelector("#preset .select-styled");
let presetSelectOptions = document.querySelector("#preset .select-options");

const triggerOverlayWidth = 300;
const triggerOverlayHeight = 168;
let triggerOverlay = document.querySelector(".trigger-overlay");
let triggerTop = document.querySelector("#top");
let triggerLeft = document.querySelector("#left");
let triggerRight = document.querySelector("#right");
let triggerBottom = document.querySelector("#bottom");

let invertTrigger = document.querySelector("#invertTrigger input");
let onlyFullscreen = document.querySelector("#onlyFullscreen input");

let hotkeySection = document.querySelector("#useHotkey");
let useHotkeyInput = document.querySelector("#useHotkey .section-header input");
let hotkeyInput = document.querySelector("#hotkey input");


function keyToString(key) {
    if (!key
        || key.shiftKey === undefined
        || key.ctrlKey === undefined
        || key.metaKey === undefined
        || key.altKey === undefined
        || key.key === undefined
    ) {
        return "None";
    }

    let result = "";
    if (key.ctrlKey) result += "Ctrl+";
    if (key.shiftKey) result += "Shift+";
    if (key.altKey) result += "Alt+";
    if (key.meta) result += "Meta+";
    if (key.code.startsWith("Numpad")) result += "Numpad ";
    result += key.key.substring(0, 1).toUpperCase() + key.key.substring(1);

    return result;
}

function updateSectionEnabledState() {
    // mouse section
    if (useMouseInput.checked) {
        mouseSection.classList.remove("disabled");
    }
    else {
        mouseSection.classList.add("disabled");
    }

    for (const input of mouseSection.querySelectorAll(".section-settings input, .section-settings select")) {
        input.disabled = !useMouseInput.checked;
    }

    // hotkey section
    if (useHotkeyInput.checked) {
        hotkeySection.classList.remove("disabled");
    }
    else {
        hotkeySection.classList.add("disabled");
    }

    for (const input of hotkeySection.querySelectorAll(".section-settings input")) {
        input.disabled = !useHotkeyInput.checked;
    }
}
function updateDomWithSettings() {
    triggerTop.value = settings.triggerTop;
    triggerLeft.value = settings.triggerLeft;
    triggerRight.value = settings.triggerRight;
    triggerBottom.value = settings.triggerBottom;

    useMouseInput.checked = settings.useMouse;

    hotkeyInput.value = keyToString(settings.hotkey);

    useHotkeyInput.checked = settings.useHotkey;

    invertTrigger.checked = settings.invertTrigger;
    onlyFullscreen.checked = settings.onlyFullscreen;

    injectOptionButtonInput.checked = settings.injectOptionButton;
    hideVideoOverlaysInput.checked = settings.hideVideoOverlays;
    hidePlayPauseAnimationInput.checked = settings.hidePlayPauseAnimation;

    updateSectionEnabledState();
}
function updateTriggerVisualisation() {
    const top = triggerTop.value;
    const left = triggerLeft.value;
    const right = triggerRight.value;
    const bottom = triggerBottom.value;

    const topSize = Math.min(triggerOverlayHeight / 2, Math.max(2, Math.atan(top / 100) / (Math.PI / 2) * triggerOverlayHeight / 2));
    const leftSize = Math.min(triggerOverlayWidth / 2, Math.max(2, Math.atan(left / 100) / (Math.PI / 2) * triggerOverlayWidth / 2));
    const rightSize = Math.min(triggerOverlayWidth / 2, Math.max(2, Math.atan(right / 100) / (Math.PI / 2) * triggerOverlayWidth / 2));
    const bottomSize = Math.min(triggerOverlayHeight / 2, Math.max(2, Math.atan(bottom / 100) / (Math.PI / 2) * triggerOverlayHeight / 2));

    triggerOverlay.style.borderTopWidth = `${topSize}px`;
    triggerOverlay.style.borderLeftWidth = `${leftSize}px`;
    triggerOverlay.style.borderRightWidth = `${rightSize}px`;
    triggerOverlay.style.borderBottomWidth = `${bottomSize}px`;

    let backgroundColor;
    let bottomTopBorderColor;
    let leftRightBorderColor;
    let disabledBorderColor = "red";

    if (invertTrigger.checked) {
        backgroundColor = "#c8f1aa";
        bottomTopBorderColor = "#f4f4f4";
        leftRightBorderColor = "#e4e4e4";
    }
    else {
        backgroundColor = "transparent";
        bottomTopBorderColor = "#c8f1aa";
        leftRightBorderColor = "#80bd55";
    }

    triggerOverlay.style.backgroundColor = backgroundColor;

    if (top <= 0) triggerOverlay.style.borderTopColor = disabledBorderColor;
    else triggerOverlay.style.borderTopColor = bottomTopBorderColor;

    if (left <= 0) triggerOverlay.style.borderLeftColor = disabledBorderColor;
    else triggerOverlay.style.borderLeftColor = leftRightBorderColor;

    if (right <= 0) triggerOverlay.style.borderRightColor = disabledBorderColor;
    else triggerOverlay.style.borderRightColor = leftRightBorderColor;

    if (bottom <= 0) triggerOverlay.style.borderBottomColor = disabledBorderColor;
    else triggerOverlay.style.borderBottomColor = bottomTopBorderColor;
}
function updatePreset() {
    if (triggerTop.value == 0
        && triggerLeft.value == 5
        && triggerRight.value == 5
        && triggerBottom.value == 0
        && invertTrigger.checked === false
        && onlyFullscreen.checked === false)
    {
        presetSelect.value = "hide";
    }
    else if (triggerTop.value == 70
        && triggerLeft.value == 10
        && triggerRight.value == 10
        && triggerBottom.value == 80
        && invertTrigger.checked === true
        && onlyFullscreen.checked === true)
    {
        presetSelect.value = "show";
    }
    else {
        presetSelect.value = "custom";
    }

    for (const selectOption of presetSelectOptions.children) {
        if (selectOption.getAttribute("rel") === presetSelect.value) {
            presetSelectStyled.innerText = selectOption.querySelector(".title").innerText;
        }
    }
}

const settings = new Settings();

updateDomWithSettings();
updateTriggerVisualisation();
updatePreset();

settings.init(() => {
    updateDomWithSettings();
    updateTriggerVisualisation();
    updatePreset();
});

function updateTriggerDistance(e) {
    if (e.target.validity.valid) {
        settings.set("trigger" + e.target.name, Number(e.target.value), () => {
            updateTriggerVisualisation();
            updatePreset();
        });
    }
}

triggerTop.addEventListener("input", updateTriggerDistance);
triggerLeft.addEventListener("input", updateTriggerDistance);
triggerRight.addEventListener("input", updateTriggerDistance);
triggerBottom.addEventListener("input", updateTriggerDistance);

injectOptionButtonInput.addEventListener("click", () => {
    settings.set("injectOptionButton", injectOptionButtonInput.checked);
});
hideVideoOverlaysInput.addEventListener("click", () => {
    settings.set("hideVideoOverlays", hideVideoOverlaysInput.checked);
});
hidePlayPauseAnimationInput.addEventListener("click", () => {
    settings.set("hidePlayPauseAnimation", hidePlayPauseAnimationInput.checked);
});

useHotkeyInput.addEventListener("click", () => {
    hotkeyInput.disabled = !useHotkeyInput.checked;
    if (useHotkeyInput.checked) {
        hotkeySection.classList.remove("disabled");
    }
    else {
        hotkeySection.classList.add("disabled");
    }
    updateSectionEnabledState();

    settings.set("useHotkey", useHotkeyInput.checked);
});

useMouseInput.addEventListener("click", () => {
    if (useMouseInput.checked) {
        mouseSection.classList.remove("disabled");
    }
    else {
        mouseSection.classList.add("disabled");
    }
    updateSectionEnabledState();

    settings.set("useMouse", useMouseInput.checked);
});

hotkeyInput.addEventListener("keydown", event => {
    if (event.keyCode < 20 && event.keyCode > 15) return;
    if (event.target.name !== "hotkey") return;

    event.preventDefault();

    let hotkey = {
        "shiftKey": event.shiftKey,
        "ctrlKey": event.ctrlKey,
        "metaKey": event.metaKey,
        "altKey": event.altKey,
        "code": event.code,
        "key": event.key
    };

    hotkeyInput.value = keyToString(hotkey);

    settings.set("hotkey", hotkey);
});

invertTrigger.addEventListener("click", () => {
    updateTriggerVisualisation();
    updatePreset();
    settings.set("invertTrigger", invertTrigger.checked);
});

onlyFullscreen.addEventListener("click", () => {
    updatePreset();
    settings.set("onlyFullscreen", onlyFullscreen.checked);
});

// preset select
presetSelectStyled.addEventListener("click", (e) => {
    e.stopPropagation();
    if (presetSelect.disabled) {
        return;
    }

    if (presetSelectStyled.classList.contains("active")) {
        presetSelectStyled.classList.remove("active");
        presetSelectOptions.style.display = "none";
    }
    else {
        presetSelectStyled.classList.add("active");
        presetSelectOptions.style.display = "block";
    }
});

for (const selectOption of presetSelectOptions.children) {
    selectOption.addEventListener("click", (e) => {
        e.stopPropagation();
        if (presetSelect.disabled) {
            return;
        }

        const chosenPreset = selectOption.getAttribute("rel");

        presetSelectStyled.innerText = selectOption.querySelector(".title").innerText;
        presetSelectStyled.classList.remove("active");
        presetSelect.value = chosenPreset;

        presetSelectOptions.style.display = "none";

        if (chosenPreset === "hide") {
            settings.set("useMouse", true);
            useMouseInput.checked = true;
            settings.set("triggerTop", 0);
            triggerTop.value = 0;
            settings.set("triggerLeft", 5);
            triggerLeft.value = 5;
            settings.set("triggerRight", 5);
            triggerRight.value = 5;
            settings.set("triggerBottom", 0);
            triggerBottom.value = 0;
            settings.set("invertTrigger", false);
            invertTrigger.checked = false;
            settings.set("onlyFullscreen", false);
            onlyFullscreen.checked = false;

            updateTriggerVisualisation();
            updateSectionEnabledState();
        }
        else if (chosenPreset === "show") {
            settings.set("useMouse", true);
            useMouseInput.checked = true;
            settings.set("triggerTop", 70);
            triggerTop.value = 70;
            settings.set("triggerLeft", 10);
            triggerLeft.value = 10;
            settings.set("triggerRight", 10);
            triggerRight.value = 10;
            settings.set("triggerBottom", 80);
            triggerBottom.value = 80;
            settings.set("invertTrigger", true);
            invertTrigger.checked = true;
            settings.set("onlyFullscreen", true);
            onlyFullscreen.checked = true;

            updateTriggerVisualisation();
            updateSectionEnabledState();
        }
    });
}

document.addEventListener("click", () => {
    presetSelectStyled.classList.remove("active");
    presetSelectOptions.style.display = "none";
});


document.querySelector("#general .section-title").innerText = chrome.i18n.getMessage("generalSectionTitle");
document.querySelector("#injectOptionButton .preference-title").innerText = chrome.i18n.getMessage("injectOptionButtonPreferenceTitle");
document.querySelector("#injectOptionButton .preference-description").innerText = chrome.i18n.getMessage("injectOptionButtonPreferenceDescription");
document.querySelector("#hideVideoOverlays .preference-title").innerText = chrome.i18n.getMessage("hideVideoOverlaysPreferenceTitle");
document.querySelector("#hideVideoOverlays .preference-description").innerText = chrome.i18n.getMessage("hideVideoOverlaysPreferenceDescription");
document.querySelector("#hidePlayPauseAnimation .preference-title").innerText = chrome.i18n.getMessage("hidePlayPauseAnimationPreferenceTitle");
document.querySelector("#hidePlayPauseAnimation .preference-description").innerText = chrome.i18n.getMessage("hidePlayPauseAnimationPreferenceDescription");

document.querySelector("#useMouse .section-title").innerText = chrome.i18n.getMessage("useMouseSectionTitle");
document.querySelector("#preset .preference-title").innerText = chrome.i18n.getMessage("presetPreferenceTitle");
document.querySelector("#preset .preference-description").innerText = chrome.i18n.getMessage("presetPreferenceDescription");
document.querySelector("#preset li[rel=hide] .title").innerText = chrome.i18n.getMessage("presetDropdownHideTitle");
document.querySelector("#preset li[rel=hide] .description").innerText = chrome.i18n.getMessage("presetDropdownHideDescription");
document.querySelector("#preset li[rel=show] .title").innerText = chrome.i18n.getMessage("presetDropdownShowTitle");
document.querySelector("#preset li[rel=show] .description").innerText = chrome.i18n.getMessage("presetDropdownShowDescription");
document.querySelector("#preset li[rel=custom] .title").innerText = chrome.i18n.getMessage("presetDropdownCustomTitle");
document.querySelector("#triggerDistance .preference-title").innerText = chrome.i18n.getMessage("triggerDistancePreferenceTitle");
document.querySelector("#triggerDistance .preference-description").innerHTML = chrome.i18n.getMessage("triggerDistancePreferenceDescription");
document.querySelector("#invertTrigger .preference-title").innerText = chrome.i18n.getMessage("invertTriggerPreferenceTitle");
document.querySelector("#invertTrigger .preference-description").innerText = chrome.i18n.getMessage("invertTriggerPreferenceDescription");
document.querySelector("#onlyFullscreen .preference-title").innerText = chrome.i18n.getMessage("onlyFullscreenPreferenceTitle");
document.querySelector("#onlyFullscreen .preference-description").innerText = chrome.i18n.getMessage("onlyFullscreenPreferenceDescription");

document.querySelector("#useHotkey .section-title").innerText = chrome.i18n.getMessage("useHotkeySectionTitle");
document.querySelector("#hotkey .preference-title").innerText = chrome.i18n.getMessage("hotkeyPreferenceTitle");
document.querySelector("#hotkey .preference-description").innerHTML = chrome.i18n.getMessage("hotkeyPreferenceDescription");
hotkeyInput.placeholder = chrome.i18n.getMessage("hotkeyPreferencePlaceholder");
