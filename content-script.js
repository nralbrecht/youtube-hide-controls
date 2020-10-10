let settings = {
    "triggerTop": -1,
    "triggerLeft": 5,
    "triggerRight": 5,
    "triggerBottom": -1,

    "hotkey": null,
    "useHotkey": false,
    "invertTrigger": false
}
let isHidden = false;

chrome.storage.local.get(settings, function(res) {
    for (let value in res) {
        settings[value] = res[value] || settings[value];
    }
});

chrome.storage.onChanged.addListener(function(changes) {
    for (let value in changes) {
        settings[value] = changes[value].newValue;
    }
});

// inject player script
const script = document.createElement("script");
script.setAttribute("src", chrome.runtime.getURL("player.js"));
script.addEventListener("load", function() {
    this.remove();
});
(document.head || document.documentElement).appendChild(script);

function isFullscreen() {
    return Boolean(document.fullscreenElement);
}

function hideControls() {
    isHidden = true;

    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "HIDE_PLAYER"
    });
}

function showControls() {
    isHidden = false;

    window.postMessage({
        "source": "YOUTUBE_HIDE_CONTROL",
        "action": "SHOW_PLAYER"
    });
}

function onFullscreenChanged() {
    if (isFullscreen() && settings.invertTrigger) {
        hideControls();
    }
    else {
        showControls();
    }
}
onFullscreenChanged();

document.addEventListener("fullscreenchange", onFullscreenChanged);
document.addEventListener("fullscreenerror", onFullscreenChanged);

document.addEventListener("mousemove", function(e) {
    let triggered = e.clientX <= settings.triggerLeft
        || e.clientY <= settings.triggerTop
        || document.documentElement.clientWidth - e.clientX <= settings.triggerRight
        || document.documentElement.clientHeight - e.clientY <= settings.triggerBottom;

    if (settings.invertTrigger) {
        if (!isHidden && isFullscreen() && !triggered) {
            hideControls();
        }
        else if (isHidden && ((!isFullscreen() && !triggered) || triggered)) {
            showControls();
        }
    }
    else {
        if (!isHidden && isFullscreen() && triggered) {
            hideControls();
        }
        else if (isHidden && isFullscreen() && !triggered) {
            showControls();
        }
    }
});

document.addEventListener("keydown", function(e) {
    let hotkeyOk = settings.useHotkey && settings.hotkey
        && settings.hotkey.shiftKey == e.shiftKey
        && settings.hotkey.ctrlKey == e.ctrlKey
        && settings.hotkey.metaKey == e.metaKey
        && settings.hotkey.altKey == e.altKey
        && settings.hotkey.code == e.code;

    if (isFullscreen() && hotkeyOk) {
        if (isHidden) {
            showControls();
        }
        else {
            hideControls();
        }
    }
});
