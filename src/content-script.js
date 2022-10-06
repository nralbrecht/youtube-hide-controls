import { PlayerStateMachine } from "./state-machine.js";
import { Settings } from "./settings.js";

// inject player script
const script = document.createElement("script");
script.setAttribute("src", chrome.runtime.getURL("player.js"));
script.addEventListener("load", function() {
    this.remove();
});
(document.head || document.documentElement).appendChild(script);

// inject styles
const style = document.createElement("link");
style.setAttribute("rel", "stylesheet");
style.setAttribute("href", chrome.runtime.getURL("player.css"));
(document.head || document.documentElement).appendChild(style);


function hideControls() {
    console.log("[youtube-hide-controls] HIDE_PLAYER!", settings);
    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "HIDE_PLAYER"
    });
}

function showControls() {
    console.log("[youtube-hide-controls] SHOW_PLAYER!", settings);
    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "SHOW_PLAYER"
    });
}

function updateClassNames() {
    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "HIDE_VIDEO_OVERLAYS",
        "value": settings.hideVideoOverlays
    });
    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "HIDE_PLAY_PAUSE_ANIMATION",
        "value": settings.hidePlayPauseAnimation
    });
}

const settings = new Settings();
const stateMachine = new PlayerStateMachine(showControls, hideControls, settings);
settings.addOnChangeListener(() => {
    stateMachine.send("settingsChanged");
    updateClassNames();
    onFullscreenChanged();
    updateInjectedOptionButton();
});
settings.init();

// handle fullscreen change
function isFullscreen() {
    if (settings.onlyFullscreen) {
        return Boolean(document.fullscreenElement);
    }
    return true;
}

function onFullscreenChanged() {
    if (isFullscreen()) {
        stateMachine.send("fullscreenEntered");
    }
    else {
        stateMachine.send("fullscreenExited");
    }
}

document.addEventListener("fullscreenchange", onFullscreenChanged);
document.addEventListener("fullscreenerror", onFullscreenChanged);

// handle mouse tigger zone
document.addEventListener("mousemove", function(e) {
    if (!settings.useMouse){
        return;
    }

    let mouseIsInTriggerZone = e.clientX < settings.triggerLeft
        || e.clientY < settings.triggerTop
        || document.documentElement.clientWidth - e.clientX < settings.triggerRight
        || document.documentElement.clientHeight - e.clientY < settings.triggerBottom;

    if (mouseIsInTriggerZone) {
        stateMachine.send("mouseTriggerZoneEntered");
    }
    else {
        stateMachine.send("mouseTriggerZoneExited");
    }
});

// handle hotkey
document.addEventListener("keydown", function(e) {
    let hotkeyMatches = settings.useHotkey && settings.hotkey
        && settings.hotkey.code == e.code
        && settings.hotkey.altKey == e.altKey
        && settings.hotkey.ctrlKey == e.ctrlKey
        && settings.hotkey.metaKey == e.metaKey
        && settings.hotkey.shiftKey == e.shiftKey;

    if (hotkeyMatches) {
        stateMachine.send("hotkey");
    }
});

// inject button to the addon option page
function updateInjectedOptionButton() {
    let optionButtonContainer = document.getElementById("hide-controls-options-button");

    if (optionButtonContainer && !settings.injectOptionButton) {
        // remove if option changed
        optionButtonContainer.style.display = "none";
        return;
    }
    else if (optionButtonContainer) {
        // ignore if allready injected
        optionButtonContainer.style.display = "block";
        return;
    }

    const rightHeaderContainer = document.querySelector("ytd-masthead #end");

    if (!rightHeaderContainer) {
        setTimeout(() => updateInjectedOptionButton(), 1000);
        return;
    }

    optionButtonContainer = document.createElement("yt-icon-button");
    optionButtonContainer.id = "hide-controls-options-button";
    optionButtonContainer.setAttribute("label", "Hide Control Options");
    optionButtonContainer.className = "style-scope ytd-masthead";

    const iconElement = document.createElement("img");
    iconElement.src = chrome.runtime.getURL("icon.svg");
    iconElement.className = "style-scope ytd-masthead";
    optionButtonContainer.appendChild(iconElement);
    rightHeaderContainer.prepend(optionButtonContainer);

    let optionPopupElement = document.getElementById("hide-controls-option-popup");
    optionButtonContainer.addEventListener("click", () => {
        if (optionPopupElement) {
            if (optionPopupElement.style.display === "none") {
                optionPopupElement.style.display = "block";
            }
            else {
                optionPopupElement.style.display = "none";
            }
        }
        else {
            optionPopupElement = document.createElement("iframe");

            optionPopupElement.src = chrome.runtime.getURL("options/options.html");
            optionPopupElement.id = "hide-controls-option-popup";

            document.body.appendChild(optionPopupElement);
            document.addEventListener("keydown", (event) => {
                if ("Escape" === event.key) {
                    optionPopupElement.style.display = "none";
                }
            });
            document.addEventListener("click", (event) => {
                if (optionPopupElement.style.display !== "none"
                    && !optionButtonContainer.contains(event.target)
                    && !optionPopupElement.contains(event.target)
                ) {
                    optionPopupElement.style.display = "none";
                }
            });
        }
    });
}
