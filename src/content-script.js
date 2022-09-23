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
const style = document.createElement("style");
style.innerText = `
.hidePlayPauseAnimation .ytp-bezel,
.hideVideoOverlays .annotation,
.hideVideoOverlays .ytp-ce-element,
.hideVideoOverlays .ytp-paid-content-overlay {
    display: none; !important
}`;
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

const settings = new Settings(() => {
    updateClassNames();
});
settings.addOnChangeListener(() => {
    updateClassNames();
});
const stateMachine = new PlayerStateMachine(showControls, hideControls, settings);

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

onFullscreenChanged();
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
        && settings.hotkey.shiftKey == e.shiftKey
        && settings.hotkey.ctrlKey == e.ctrlKey
        && settings.hotkey.metaKey == e.metaKey
        && settings.hotkey.altKey == e.altKey
        && settings.hotkey.code == e.code;

    if (hotkeyMatches) {
        stateMachine.send("hotkey");
    }
});
