import { PlayerStateMachine } from "./state-machine.js";
import { Settings } from "./settings.js";

const settings = new Settings();

// inject player script
const script = document.createElement("script");
script.setAttribute("src", chrome.runtime.getURL("player.js"));
script.addEventListener("load", function() {
    this.remove();
});
(document.head || document.documentElement).appendChild(script);

function hideControls() {
    console.log("HIDE_PLAYER!", settings);
    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "HIDE_PLAYER"
    });
}

function showControls() {
    console.log("SHOW_PLAYER!", settings);
    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "SHOW_PLAYER"
    });
}

const stateMachine = new PlayerStateMachine(showControls, hideControls, settings);
console.log("machine", stateMachine);

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
    if (settings.onlyHotkey){
        return;
    }

    let mouseIsInTriggerZone = e.clientX <= settings.triggerLeft
        || e.clientY <= settings.triggerTop
        || document.documentElement.clientWidth - e.clientX <= settings.triggerRight
        || document.documentElement.clientHeight - e.clientY <= settings.triggerBottom;

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

// function init() {
//     const bottomControlElement = document.querySelector(".ytp-chrome-bottom");
//     const topControlElement = document.querySelector(".ytp-chrome-top");

//     const onEnter = function(e) {
//         console.log("enter", "bottom", e);

//         if (isFullscreen() && isHidden) {
//             showControls();
//         }
//     }

//     const onLeave = function(e) {
//         console.log("leave", "bottom", e);

//         if (isFullscreen() && !isHidden) {
//             hideControls();
//         }
//     }

//     bottomControlElement.addEventListener("mouseenter", onEnter);
//     topControlElement.addEventListener("mouseenter", onEnter);

//     bottomControlElement.addEventListener("mouseleave", onLeave);
//     topControlElement.addEventListener("mouseleave", onLeave);
// }
// init();
